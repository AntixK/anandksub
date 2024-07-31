@def title = "Linearization is All You Need for an Autodiff Library"
@def published = "24 April 2022"
@def description = "A complete autodiff library can be written only with linearizing the computational graph."
@def tags = ["math","ml", "gradient","graph", "jax", "code","deep-learning"]
@def hasmath = true
@def draft = false

&emsp; Automatic differentiation (AD, autodiff), or the name I prefer - *Algorithmic differentiation*, has exploded in popularity mainly owing to the widespread understanding and availability of this technique. AD has been around since the 1950s and I wouldn't be surprised if someone has traced it back to Euler or Gauss. However, the explosion of Deep Learning and the standardized implementations of AD on modern hardware has sparked its wide-spread use. People have even written [minimal autograd libraries](https://github.com/karpathy/micrograd) for fun. However, almost all of them either implement both forward and reverse modes (more mainstream libraries) or only the reverse-mode (mostly fun projects), suited for neural network training.

Can we just write a *complete* autograd library with just forward-mode? Turns out, with some tiny bit of linear operators, we can!

### Forward and Reverse Modes - A Recap

At the core, autodiff is the systematic application of the chain rule of differentiation, directly on the numerical values rather than symbols. Compared to symbolic differentiation, where the complexity of the partial derivatives (algebraic expressions) grows rapidly, the complexity remains constant both in terms of speed and memory.

An autodiff system requires an *evaluation trace* or the *computation graph* for keeping track of the sequence of operations and the corresponding variables. These intermediate variables are what makes AD quite efficient - computing a function and its gradient have the same runtime upto some constant.

Consider a function $f: \R^N \to \R^M$ defined as $\vy = f(\vx)$. The function $f$ may be broken down into a series of elementary operations, whose differentials are known in closed form. This constitutes our computation graph. 

In forward mode, the derivatives are computed by jointly propagating the intermediate  gradients (with respect to the input) and the input variable across the graph. In one forward sweep, you get the gradient with respect to one of the input variables. Therefore, in case of $N$ input variables, the complete gradient matrix (aka *Jacobian* matrix) requires $N$ forward passes.

On the other hand, the reverse mode (aka *adjoint mode*), the gradient with respect to an output variable is propagated back across the graph to get the gradients for all the input variables. Therefore, we need a forward pass through the graph (which essentially constructs the graph) and then back propagate through it. This yields one row of the Jacobian matrix. Reverse mode requires $M$ backward passes to get the full Jacobian matrix, where $M$ is the number of output variables.

!!!
<img  style="width:60%;min-width:300px;" src="/media/post_images/jacobian.svg" alt="Jacobian in forward and reverse mode">
!!!

We can now see why reverse mode is more popular since in most applications, the input dimensions are greater than the output dimensions and hence reverse mode is more efficient. In modern implementations, these passes are highly vectorized.

<!-- - forward mode as jvp and reverse as vjp -->

In practice, we are more interested in the Jacobian multiplied by some vector. For instance, $\nabla f\cdot \vr$ gives the directional derivative along some vector $\vr$. Observe that in forward mode, the Jacobian computation is essentially $\nabla f \cdot \vone$ where $\vone$ is a vector of ones [^1]. Therefore, by initializing $\dot{\vx} = \vr$, forward mode can compute compute the *Jacobian-Vector product* (jvp) - $\nabla f \cdot \vr$ for some vector $\vr$. Similarly, in reverse mode, one can compute the *Vector-Jacobian product* (vjp) - $\vr^T \cdot \nabla f$ since in reverse mode $\dot{\vy} =\vone$. These two operations - jvp and vjp - form the core of all autodiff libraries. 

### Connecting Reverse Mode and Forward Mode
Autodiff libraries usually implement two rule sets - one each for jvp and vjp. This can lead to a large number of primitive operators in the library. But an interesting observation can be made relating jvp and vjp, enabling us to compute both vjp and jvp in a unified way.[^2].

The relation between vjp and jvp can be obtained by observing that for linear functions, jvp and vjp are simply the transpose of one another. This is not the say that they both compute the same thing. They don't. jvp operates in the tangent space, while vjp operates in the cotangent space. In literature, however, people treat them the same as they are canonically isometric [^3]. 

!!!
<img  style="width:80%;min-width:300px;" src="/media/post_images/jvp-vjp.svg" alt="Difference between jvp and vjp">
!!!

Without going into the intricacies of tangent and cotangent spaces, jvp computes the following - at an input $\vx$, if we perturb the input by a vector $\vv$, how does the output change upto first order. On the other hand, vjp computes the following - at an input $\vx$, if $\vv$ is the vector representing a linear function on the perturbations of the output $\vy$, then what is the corresponding vector representing a linear function on the perturbations of the input $\vx$. In jvp, the vector $\vv$ acts directly on the input space and it called as the *tangent vector*, while in vjp the vector $\vv$ operates on the perturbations of the output and therefore called as the *cotangent vector*.

To compute vjp, one can simply *linearize* the given function at the primal point $\vx$ and transpose the linear function. The linearization operation for a given function $f$ is defined as

$$
\fL(f)(\vx) = f(\vx_0) + \nabla_{\vx_0} f \cdot (\vx - \vx_0)
$$

Linearization is essentially the Taylor series up to the first order. Notice that the linearization implicitly computes the jacobian $\nabla f$. However, $\fL(f)$ is not always a linear function - notice the additional constant term $f(\vx_0) \nabla_{\vx_0} f \cdot \vx_0$. Therefore in practice, linearization usually omits the constant to result in a proper linear function. In other words, linearizing a function is akin to forward-mode AD or computing jvp. In fact, jvp can be implemented using the linearize operator. 

### Example
Consider the simple nonlinear function $f(\vx) = 2x_1 x_2 + \sin(5x_1 + 7x_2)$. The jacobian is given by

$$
\nabla f = \begin{bmatrix} \frac{d f}{d x_1}  & \frac{d f}{d x_2} \end{bmatrix} = [2x_2 + 5 \cos(5x_1 + 7x_2) \quad 2x_1 + 7 \cos(5x_1 + 7x_2)]
$$

Linearizing $f$ at say, $\vx_0 = [0.5, 0.3]$, and along a columnet vector $\vv$ gives

$$
\fL(f)|_\vx (\vv) = \begin{bmatrix} \frac{d f}{d x_1}  & \frac{d f}{d x_2} \end{bmatrix} \vv  = \frac{d f}{d x_1} * v_1 + \frac{d f}{d x_2} * v_2 = -0.0272 v_1 - 0.1491 v_2
$$
Note that from the above definition, linearization is the same as forward mode AD and is equivalent to the jvp operation. However, the linearize function can often be more useful in practice as a *partial function*, whose forward-mode can be evaluated repeatedly over multiple vectors ($\vv$), as opposed to jvp, which can be expensive when done repeatedly. These input vectors $\vv$, called *tangents* in literature, defines the direction along which the linearization happens. The linearzation can be done along any direction as quickly as evaluating the function itself (with a constant multiplier like 3). 
$$

\texttt{jvp}(f, \vx, \vv) := \fL(f)|_\vx(\vv)
$$

To get the reverse mode, we need only to transpose the linearized function $\fL(f)$ and evaluate function at the cotangents. This essentially means that the $\nabla f$ matrix is transposed. Recall that vjp operates in the cotangent space, ans such, we provide a cotangent vector $\vv$ to the transposed linear function,

$$
\texttt{vjp}(f, \vx, \vv) := \vv (\fL(f)|_{\vx})^T
$$

#### Code

```python

def fun(x, y):
    return 2 * x * y + jnp.sin(5 * x + 7 * y)


def jvp_(fun: Callable, 
         primals: Sequence, 
         tangents: Sequence) -> Tuple:
    """
    Forward mode implementation using linearize.

    fun: Function
    primals: Points of concern. 
             Jacobians will be evaluated here.
    """
    # Get gradients at the primal points through
    # forward mode. Do a linear approximation of the function
    # at these primal points from the gradients.

    y, f_lin = jax.linearize(fun, *primals)

    # Evaluate the tangents 
    out_tangent = f_lin(*tangents)
    return y, out_tangent

def vjp_(fun: Callable, 
         primals: Sequence, 
         cotangents: Sequence) -> Tuple:
    """
    Reverse mode implementation using linearize.

    fun: Function
    primals: Points of concern. 
             Jacobians will be evaluated here.
    """

    # Get gradients at the primal points through
    # forward mode. Do a linear approximation of the function
    # at these primal points from the gradients.
    y_, f_ = jax.linearize(fun, *primals)

    # Transpose the linear approximation and evaluate
    f_t = jax.linear_transpose(f_, *primals)

    return (y_, f_t(cotangents))
```
**Note**: The above implementation is quite slow compared to JAX's `jvp` and `vjp` functions, and only serves as a proof of concept that only linearization is required for both forward and reverse AD.

The above method of linearization is also more memory intensive than jvp since we have to store the intermediates. The only scenario in which linearization is useful is when we have to evaluate jvp across multiple tangent vectors, with the linearized computational graph acting as a cache, in which case it becomes much faster than called `jvp` every time. This idea was used in a [recent paper](https://arxiv.org/abs/2202.08587) where they show that monte-carlo estimate of the gradient can be computed using jvp across multiple tangents and hence can be used to train a network without backprop.


----


[^1]: In forward mode, $\dot{\vx} = \vone$. For a detailed explanation, check out [Baydin et. al's paper](https://arxiv.org/abs/1502.05767).


[^2]: The point here is not about optimizing for the minimal rules sets for a complete autodiff library, but rather the interesting connection between jvp and vjp. Different libraries optimize for minimizing their rules sets in different ways - Pytorch, for instance, implements mostly vjp rule sets and uses [another interesting link between vjp and jvp](https://j-towns.github.io/2017/06/12/A-new-trick.html), to [compute jvp from vjp](https://github.com/pytorch/pytorch/blob/5456d8c8f30e9347d0dbb81b27c8cd2fe5aa931e/torch/autograd/functional.py#L296). 


[^3]: For JAX, checkout [this answer](https://github.com/google/jax/discussions/10271#discussioncomment-2568196) by one of the authors of JAX, Mathew Johnson and [Frostig et. al's paper](https://arxiv.org/pdf/2105.09469.pdf).