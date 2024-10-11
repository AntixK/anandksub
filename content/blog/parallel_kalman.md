@def title = "Parallelizing Kalman Filters"
@def published = "31 May 2022"
@def description = "The associative property of Kalman (Bayesian) filters can yield a parallel algorithm in O(log N). "
@def tags = ["math","ml", "parallel", "code", "jax"]
@def has_math = true
@def has_chart = false
@def has_code = true
@def show_info = true
@def is_draft = false
@def is_index = false

&emsp; *Parallel scan* or the *Associative scan* algorithm is a popular parallel computing technique that is used to parallelize sequential algorithms using the associative property of that algorithm. This technique is a generalization of the earlier and much more popular *prefix sum* algorithm (summing operation is associative). 

Consider a sequential algorithm $\fA$ that runs in $\fO(N)$. By definition, at each step $t$, the computation $a_t$ depends on the previous result $a_{t-1}$ through some associative operation $\otimes$. The set of all the prefix-sums for $N$ steps is therefore

$$
(a_1, a_1 \otimes a_2, \ldots ,a_1 \otimes \cdots \otimes a_N )
$$

Many common operations are associative like addition, subtraction, maximum, minimum, and so on. The parallel computation of the above generalized prefix-sum is called the *scan* operation [^1]. A prefix-scan algorithm taken in an array $a_1,a_2, \ldots, a_N$ and computes the array $a_1, (a_1 \otimes a_2), \ldots ,(a_1 \otimes \cdots \otimes a_N) $

```python
def prefix_scan(op, A: np.ndarray):
    """
    Pseudocode for the inplace parallel prefix scan.
    reference: GPU Gems 3 Chapter 39

    Args:
    op  = Associative binary operator
    A   = Sequence of elements

    Usage:
    prefix_scan(np.add, np.array([1,2,3,4,5,6,7]))
    """

    N = A.shape[0]
    res = A.copy()  # Inplace
    log_n = np.log2(N).astype(int)

    def _up_sweep(res, i, j):
        l = j + 2 ** i - 1
        r = j + 2 ** (i + 1) - 1
        res[r] = op(res[l], res[r]) 
        # Order matters, as the operator 
        # need not be commutative

    def _down_sweep(res, i, j):
        l = j + 2 ** i - 1
        r = j + 2 ** (i + 1) - 1
        res[l], res[r] = res[r], op(res[r], res[l])

    # Up sweep
    for i in range(log_n):
        # Do in parallel (O(log N))
        for j in range(0, N, 2 ** (i + 1)):
            _up_sweep(res, i, j)

    res[-1] = 0

    # Down sweep
    for i in range(log_n - 1, -1, -1):
        # Do in parallel (O(log N))
        for j in range(0, N, 2 ** (i + 1)):
            _down_sweep(res, i, j)
    
    # Do in parallel (O(log N))
    res = op(res, A)
    return res
```

For our purposes, by parallelization we really mean a SIMD implementation - where the same operation is carried over different data points in parallel. This is also called *vectorization* in practice. The parallel prefix-sum is, thus, a vectorized cumulative sum algorithm.

## Parallelizing Kalman Filter
The logic flow of parallelizing the Kalman filter involves the following steps - Kalman filtering is sequential *i.e.* it is $\fO(N)$;  Kalman filtering is associative; therefore, Kalman filter can be parallelized using the associative scan algorithm[^2].

### Sequential Kalman Filter

!!!
<img  style="width:60%;min-width:300px;" src="/media/post_images/Kalman_filter.svg" alt="Kalman Filter illustration.">
!!!


Kalman filtering is a special (Gaussian) case of more general class of *Bayesian filters*. Given a system with its internal(hidden) state as a set of variables $\vx_k$ and set of variables $\vy_k$ that can be observed/measured at time step $k$, we are interested in the following[^3] 
- Marginal distribution $p(\vx_{k}|\vy_{1:k-1})$ of a future state given the observations $\vy_k$ until the current time step $k$. This is called as the *prediction distribution*.
- Marginal distribution $p(\vx_k | \vy_{1:k})$ of the current state $\vx_k$ given the measurements $\vy_k$ till the time step $k$. This is called as the *filtering distribution*.

The Kalman filter assumes the following model for the system 
$$
\begin{aligned}
\vx_k &\sim p(\vx_k | \vx_{k-1}) &&= \fN(\vx_k; \vA_{k-1}\vx_{k-1}, \vQ_k) &&= \vA_{k-1}\vx_{k-1} + q_{k-1} &&& \color{OrangeRed} \text{State transition}\\
\vy_k &\sim p(\vy_k | \vx_k) &&= \fN(\vy_k; \vH_{k}\vx_k, \vR_k)  &&= \vH_{k}\vx_k + r_k &&& \color{Teal} \text{Measurement model}
\end{aligned}
$$
Where $\vA_k, \vH_k$ are the state transition and measurement model matrices respectively, and $q_k \sim \fN(\vzero, \vQ_k), r_k \sim \fN(\vzero, \vR_k)$ are the process noise and measurement noise respectively. For a sequential computation, Kalman filter assumes the *Markov property* where $\vx_k$ is independent of past $\vy_{1:k-1}$ given $\vy_k$. The Kalman filter then computes the above two distributions alternatively - called *predict* and *update* in practice. Since the assumed model is completely Gaussian, the marginal distributions are also Gaussians can be computed in closed form[^4].

Consider at time step $k$, we measure $\vy_k$. The corresponding filtering and predictive distributions at $k$ are $p(\vx_k | \vy_{1:k})$ and $p(\vx_k | \vy_{1:k-1})$. From Bayes' rule,

$$
\begin{aligned}
p(\vx_k|\vy_{1:k}) &= \frac{p(\vy_k | \vx_k, \vy_{1:k-1})p(\vx_k | \vy_{1:k-1})}{p(\vy_{1:k})} = \frac{p(\vy_k | \vx_k)p(\vx_k | \vy_{1:k-1})}{p(\vy_{1:k})} \\
p(\vx_k | \vy_{1:k-1}) &= \int p(\vx_k | \vx_{k-1}) p(\vx_{k-1} | \vy_{1:k-1}) d \vx_{k-1}
\end{aligned}
$$

From the above equations, it is clear that the predict and update steps can be done iteratively as they are dependent upon each other. Starting from a prior distribution $\vx_0 \sim \fN(\vm_0, \vP_0)$, predict step can be computed as 

$$
\begin{aligned}
\vm'_k &= \vA_{k-1}\vm_{k-1} \\
\vP'_k &= \vA_{k-1}\vP_{k-1}\vA_{k-1}^T + \vQ_{k-1}
\end{aligned}
$$

where $p(\vx_k|\vy_{1:k-1}) = \fN(\vx_k ; \vm'_k, \vP'_k)$, and the update step 

$$
\begin{aligned}
\vv_k &= \vy_k - \vH_k \vm'_k \\
\vS_k &= \vH_k \vP'_k \vH_k^T + \vR_k \\
\vK_k &= \vP'_k \vH^T_k \vS_k^{-1}\\
\vm_k &= \vm'_k + \vK_k \vv_k\\
\vP_k &= \vP'_k - \vK_k \vS_k \vK_k^T
\end{aligned}
$$
where $p(\vx_k|\vy_{1:k}) = \fN(\vx_k ; \vm_k, \vP_k)$. The above equations can be computed in closed form as all the distributions are Gaussian.

If there are $N$ observations, we need $\fO(N)$ steps of the predict-update procedure to get the final filtering distribution $p(\vx_N | \vy_{1:N})$. In case of batched data, the computational complexity can be amortized to $\fO(B)$ where $B$ is the batch size.

### Bayesian Update as an Associative Operation
Consider the filtering distribution $p(\vx_2|\vy_{1:2})$ at $k=2$. It can be rewritten as 

$$
\begin{aligned}
p(\vx_2 | \vy_{1:2}) &= p(\vx_2 | \vy_1, \vy_2)\frac{p(\vy_2 | \vy_1)}{p(\vy_2 | \vy_1)} \\
&= \frac{p(\vx_2, \vy_2 | \vy_{1})}{p(\vy_2 | \vy_1)}\\
&= \frac{\int p(\vx_2, \vy_2 | \vx_1, \vy_{1}) p(\vx_1 | \vy_1) d\vx_1}{\int p(\vy_2 | \vx_1, \vy_1) p(\vx_1 | \vy_1) d\vx_1} &&& \color{OrangeRed} \text{(marginalization)}\\
&= \frac{\int p(\vx_2 | \vy_2, \vy_1, \vx_1) p( \vy_2 | \vx_1, \vy_1)  p(\vx_1 | \vy_1) d\vx_1}{\int p(\vy_2 | \vx_1, \vy_1) p(\vx_1 | \vy_1) d\vx_1} \\
&= \frac{\int p(\vx_2 | \vy_2, \vx_1) p( \vy_2 | \vx_1)  p(\vx_1 | \vy_1) d\vx_1}{\int p(\vy_2 | \vx_1) p(\vx_1 | \vy_1) d\vx_1} &&& \color{OrangeRed} \text{(due to Markov property)} \\

&= \frac{\int  p( \vy_2 | \vx_1) p(\vx_2 | \vy_2, \vx_1) p(\vx_1 | \vy_1, \vx_0) d\vx_1}{\int p(\vy_2 | \vx_1) p(\vx_1 | \vy_1, \vx_0) d\vx_1} &&& \big (p(\vx_1 | \vy_1, \vx_0) = p(\vx_1 | \vy_1) \big ) 
\end{aligned}
$$\label{eq:filter-decomp}

The above equation can be expressed as the following by grouping terms
$$
p(\vx_2 | \vy_{1:2}) = \frac{\int \lambda_2 \phi_2 \phi_1 }{\int \lambda_2 \phi_1 }
$$
Where $\lambda_k = p(\vy_k | \vx_{k-1})$ and $\phi_k = p(\vx_k | \vy_k, \vx_{k-1})$. The marginal $p(\vy_{1:2})$ can be expressed as a marginalization over $\vx_1$ as
$$
\begin{aligned}
p(\vy_{1:2}) &= p(\vy_1, \vy_2) \\
&= \int p(\vy_1, \vy_2 | \vx_1) d \vx_1 \\
&= p(\vy_1) \int p(\vy_2 | \vx_1) p(\vx_1 | \vy_1) d \vx_1 \\
&= p(\vy_1 | \vx_0) \int p(\vy_2 | \vx_1) p(\vx_1 | \vy_1, \vx_0) d \vx_1 &&& \bigg (p(\vy_1) = p(\vy_1 | \vx_0); p(\vx_1 | \vy_1) = p(\vx_1 | \vy_1, \vx_0) \bigg )\\
&= \lambda_1 \int \lambda_2 \phi_1
\end{aligned}
$$\label{eq:marginal-decomp}

Equations \eqref{eq:filter-decomp} and \eqref{eq:marginal-decomp} can be combined to result 
$$
\begin{pmatrix} \phi_1 \\ \lambda_1 \end{pmatrix} \otimes \begin{pmatrix} \phi_2 \\ \lambda_2 \end{pmatrix} = \begin{pmatrix} p(\vx_2 | \vy_{1:2}) \\ p(\vy_{1:2}) \end{pmatrix}
$$\label{eq:operator-k2}

The point of equations \eqref{eq:filter-decomp} to \eqref{eq:operator-k2} is to sever the dependence of the filtering update on the previous hidden state $\vx$ as they depend only upon $\vx_1$. For instance,
$$
\begin{aligned}
p(\vx_2 | \vy_{1:k}) &= \frac{\int  p( \vy_{2:k} | \vx_1) p(\vx_k | \vy_{2:k}, \vx_1) p(\vx_1 | \vy_1) d\vx_1}{\int p(\vy_{2:k} | \vx_1) p(\vx_1 | \vy_1) d\vx_1} \\
p(\vy_{1:k}) &= p(\vy_1) \int p(\vy_{2:k} | \vx_1) p(\vx_1 | \vy_1) d\vx_1
\end{aligned}
$$

 In fact, this can be generalized to dependence upon any of the previous states $\vx_{k-l}$ for filtering at state $\vx_k$ [^5]. By induction, we can generalize equation \eqref{eq:operator-k2} to

$$
\begin{pmatrix} \phi_1 \\ \lambda_1 \end{pmatrix} \otimes \begin{pmatrix} \phi_2 \\ \lambda_2 \end{pmatrix} \otimes \cdots \otimes \begin{pmatrix} \phi_k \\ \lambda_k \end{pmatrix} = \begin{pmatrix} p(\vx_k | \vy_{1:k}) \\ p(\vy_{1:k}) \end{pmatrix}
$$

We now have an operator that can compute the filtering distribution from any given previous state and the set of observations. The $\otimes$ operator defined above can be shown to be associative [^6]. The associativity of the above Bayesian update (the filtering distribution is simply the posterior) shows that the order of the update does not matter. Note that, however, it is not commutative *i.e.* the conditionals cannot be swapped.

!!!
<img  style="width:90%;min-width:300px;" src="/media/post_images/kalman_associative.svg" alt="Associativity of Kalman filter.">
!!!

One interesting aspect of this technique is that it computes the marginal $p(\vy_{1:k})$, which can be used for parameter estimation.

### Parallel Scan Kalman Filtering
Parallelizing the Kalman filter now boils down to computing operands (the parameters for the  expressions for $\lambda_k$ and $\phi_k$) and the associative operator itself. The operands $(\phi_k, \lambda_k)$ can be expressed as the following Gaussians respectively.
$$
\begin{aligned}
\phi_k &= p(\vx_k | \vy_k, \vx_{k-1}) &&= \fN (\vx_k; \vF_k \vx_{k-1},\vC_k) \\
\lambda_k &= p(\vy_k | \vx_{k-1}) &&= \fN_I(\vx_{k-1}; \eta_k, \vJ_k)
\end{aligned}
$$
Where $\eta_k = \vP_k^{-1}\vm_k$ and $\vJ_k = \vP_k^{-1}$. $\fN_I$ is the *information form* of the Gaussian distribution where it is parameterized based on the inverse covariance matrix $\vP^{-1}$ for ease of computation - not requiring to invert matrices back and forth.

The equations for $\phi_k$ are
For $k > 1$
$$
\begin{aligned}
\vS_k &= \vH_k \vQ_{k-1} \vH_k^T + \vR_k \\
\vK_k &= \vQ_{k-1} \vH_k^T \vS_k^{-1} \\
\vF_k &= \big (\vI - \vK_k \vH_k \big )\vA_{k-1}\\
\vb_k &= \vK_k\vy_k \\
\vC_k &= \big (\vI - \vK_k \vH_k \big ) \vQ_{k-1} 
\end{aligned}
$$
with initial state $k=1$ as
$$
\begin{aligned}
\vm_1^- &= \vA_0 \vm_0 \\
\vP_1^- &= \vA_0 \vP_0 \vA_0^T + \vQ_0 \\
\vS_1 &= \vH_1\vP_1^-\vH_1^T + \vR_1 \\
\vK_1 &= \vP_1^- \vH_1^T \vS_1^{-1} \\
\vF_1 &= \vzero \\
\vb_1 &= \vm_1^- + \vK_1 \big (\vy_1 - \vH_1 \vm_1^- \big ) \\
\vC_1 &= \vP_1^- - \vK_1 \vS_1 \vK_1^T

\end{aligned}
$$
And the equations for $\lambda_k$ are
$$
\begin{aligned}
\eta_k &= \vA_{k-1}^T \vH_k^T \vS_k^{-1} \vy_k \\
\vJ_k &= \vA_{k-1}^T \vH_k^T \vS_k^{-1} \vH_k \vA_{k-1}
\end{aligned}
$$

In practice, operand for the associative operator $\otimes$ is the tuple $\va_k = \big ( \vF_k, \vb_k, \vC_k, \eta_k, \vJ_k \big )$, also called the filtering element. 

The operator $\otimes$ can be computed as
$$
\begin{pmatrix} \phi_i \\ \lambda_i \end{pmatrix} \otimes \begin{pmatrix} \phi_j \\ \lambda_j \end{pmatrix} = \va_i \otimes \va_j = \va_{ij}
$$
Where
$$
\begin{aligned}
\vF_{ij} &= \vF_j \big (\vI + \vC_i \vJ_j \big )^{-1} \vF_i \\
\vb_{ij} &= \vF_j \big (\vI + \vC_i \vJ_j \big )^{-1} \big ( \vb_i + \vC_i \eta_j \big ) + \vb_j \\
\vC_{ij} &= \vF_j (\vI + \vC_i \vJ_j \big )^{-1} \vC_j \vF_j^T + \vC_j \\
\eta_{ij} &= \vF_i^T (\vI +  \vJ_j \vC_i \big )^{-1} \big (\eta_j -  \vJ_j \vb_i \big) +  \eta_i \\
\vJ_{ij} &= \vF_i^T (\vI +\vJ_j  \vC_i  \big )^{-1} \vJ_j \vF_i + \vJ_i
\end{aligned}
$$
<!-- At the end of $k$  steps, $\vF_k$  -->

### Implementation
The JAX implementation is given below for both sequential and parallel Kalman filters using JAX's `associative_scan`. JAX has first class support for SIMD and SPMD programming through its `vmap` and `pmap` primitive respectively. The `associative_scan` is the primitive for the execution of any associative operation, and when used along with `vmap`, it yields the required parallelization.

```python
from jax import vmap, jit
import jax.numpy as jnp
import jax.scipy as jsc
from jax.lax import associative_scan, scan

from collections import namedtuple
from typing import NamedTuple, Tuple


# Reference -
# https://github.com/EEA-sensors/sequential-parallelization-examples

StateSpaceModel = namedtuple("StateSpaceModel", [
                             'A','H','Q','R',,'m0','P0','x_dim', 'y_dim'])

@jit
def sequential_kalman(model: NamedTuple, 
                      observations: jnp.array) -> Tuple:
    """
    Implements sequential Kalman filter in O(N).
    """

    def predict_update(carry, y) -> Tuple:
        m, P = carry

        # Predict - Equation (4)
        m = model.A @ m
        P = model.A @ P @ model.A.T + model.Q

        obs_mean = model.H @ m

        # Update - Equation (5)
        S = model.H @ P @ model.H.T + model.R
        # More efficient than jsc.lingalg.inv(S)
        K = jsc.linalg.solve(S, model.H @ P, sym_pos=True).T  
        m = m + K @ (y - model.H @ m)
        P = P - K @ S @ K.T

        return (m, P), (m, P)   # carry is basically the previous state
    
    # Perform predict and update alternatively from
    # the initial state (prior) and the observations.
    _, (fms, fPs) = scan(predict_update, 
                         (model.m0, model.P0), 
                         observations)
    return fms, fPs
    
@jit
def parallel_kalman(model: NamedTuple, y: jnp.array) -> Tuple:
    """
    Implements the parallel Kalman filter in O(log N).
    """
    # Filtering elements for k=1
    def first_filtering_element(model: NamedTuple, 
                                y_0: jnp.array) -> Tuple:
        """
        Computes the first filtering element (k = 1).
        """
        # Equation (14)
        m1 = model.A @ model.m0
        P1 = model.A @ model.P0 @ model.A.T + model.Q
        S1 = model.H @ model.P @ model.H.T + model.R
        K1 = jsc.linalg.solve(S1, model.H @ P1, sym_pos=True).T

        F = jnp.zeros_like(model.A)
        b = m1 + K1 @ (y - model.H @ m1)
        C = P1 - K1 @ S1 @ K1.T

        # Equation (15)
        S = model.H @ model.Q @ model.H.T + model.R
        CF, low = jsc.linalg.cho_factor(S)
        eta = model.A.T @ model.H.T @ jsc.linalg.cho_solve((CF, low), 
                                                            y_0)
        J = model.A.T @ model.H.T @ jsc.linalg.cho_solve((CF, low), 
                                                          model.H @ model.A)

        return (F, b, C, eta, J)

    def filter_elements(model: NamedTuple, y: jnp.array) -> Tuple:
        """
        Computes the generic filtering element
        for k > 1.
        """

        # Equation (13)
        S = model.H @ model.Q @ model.H.T + model.R
        CF, low = jsc.linalg.cho_factor(S)
        K = jsc.linalg.cho_solve((CF, low), model.H @ model.Q).T
        F = model.A - K @ model.H @ model.A
        b = K @ y
        C = model.Q - K @ model.H @ model.Q

        # Equation (15)
        eta = model.A.T @ model.H.T @ jsc.linalg.cho_solve((CF, low), y)
        J = model.A.T @ model.H.T @ jsc.linalg.cho_solve((CF, low), 
                                                         model.H @ model.A)

        return (F, b, C, eta, J)

    @vmap  # SIMD parallelization
    def operator(a_1: Tuple, a_2: Tuple) -> Tuple:
        """
        Associative operator that computes a_1 ⊗ a_2
        """
        # Equation (17)
        F1, b1, C1, eta1, J1 = a_1
        F2, b2, C2, eta2, J2 = a_2

        I = jnp.eye(F1.shape[0])

        I_C1J2 = I + C1 @ J2
        tmp = jsc.linalg.solve(I_C1J2.T, F2.T, sym_pos=True).T
        F = tmp @ F1
        b = tmp @ (b1 + C1 @ eta2) + b2
        C = tmp @ C1 @ F2.T + C2

        I_J2C1 = I + J2 @ C1
        tmp = jsc.linalg.solve(I_J2C1.T, F1, sym_pos=True).T

        eta = tmp @ (eta2 - J2 @ b1) + eta1
        J = tmp @ J2 @ F1 + J1

        return (F, b, C, eta, J)

    # ==================================
    a_1 = first_filtering_element(model, y[0])

    # Compute all the filtering elements in parallel
    a_k = vmap(lambda x: filter_elements(model, x))(y[1:])

    initial_elements = tuple(
        jnp.concatenate([jnp.expand_dims(a_i, 0), a_j]) for a_i, a_j in zip(a_1, a_k)
    )

    # Compute a_1 ⊗ a_2 ⊗ ... ⊗ a_k in parallel
    filtered_elements = associative_scan(operator, initial_elements)

    return filtered_elements[1], filter_elements[2]  # We only need b, C

```

The above parallelizing technique is applicable in a range of problems - wherever the Bayesian update is done over a sequence of measurements. The Gaussian version of the Bayesian smoother (Kalman filter being the Gaussian version of the Bayesian filter), called as the Rauch-Tung-Stribel (RTS) smoother, can similarly be parallelized. 

**Note:** A question needs to be addressed here - *Should you parallelize Kalman filter as discussed?* The honest answer is NO. There are some practical concerns with this method. The filtering operator and the computation of the elements themselves are computationally more intensive than the original Kalman filter. In parallel-programming parlance, it is not *work-efficient*. So, this computational overhead (a constant factor) needs to be considered. The above vectorization may not be suitable for all computer architectures and actual parallelization should depend on the architecture. Finally, the JAX's JIT compilation (or any other JIT compilation) poses a considerable overhead, although this is only a one-time overhead. The sequential implementation in $\fO(N)$ is already fast enough for most practical purposes.

That being said, the implications of this parallelization are quite significant. For problems of high computational complexity, this parallelization may be of great help. An example of such an application is to [speed up temporal Gaussian processes](https://arxiv.org/abs/2102.09964)  (they can be shown to be directly related to Kalman filters). 


----

[^1]: A detailed discussion of the parallel prefix-sum algorithm can be found  [here](https://www.cs.cmu.edu/~guyb/papers/Ble93.pdf).


[^2]: The technique discussed here was originally proposed in [this paper](https://arxiv.org/abs/1905.13002).

[^3]: The two distributions are actually a simplification. The more general solution would be the join posterior $p(\vx_{0:T}|\vy_{1:T})$ over a period of measurements $1, \cdots,T$. However, this is practically intractable and not scalable. So, the problem is reduced to computing only the marginals - filtering, prediction, and smoothing distributions. Kalman filter addresses the former two, while the Rauch-Tung-Striebel smoother addresses the latter.

[^4]: Highly recommend Simo Särkkä's book *Bayesian Filtering and Smoothing* for a detailed discussion of Kalman filter and other Bayesian filtering techniques. The book can be freely accessed [here](https://users.aalto.fi/~ssarkka/#publications). The derivation for the equations provided here can be found in the book in Chapter 4, section 4.3.

[^5]: This is possible mainly due to the Markov property. 

[^6]: The proof of the associativity can be found in the appendix of [this paper](https://arxiv.org/abs/1905.13002).