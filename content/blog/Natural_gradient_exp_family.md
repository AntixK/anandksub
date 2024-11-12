@def title = "A Fascinating connection between Natural Gradients and the Exponential Family"
@def published = "08 August 2019"
@def description = "The Exponential family provides an elegant and easy method to compute Natural Gradients and thus can be used for Variational Inference."
@def tags = ["math","ml", "gradient", "natural-gradient", "deep-learning"]
@def has_math = true
@def has_code = false
@def is_draft = false
@def show_info = true
@def has_chart = false


### Gist of Natural Gradients
&emsp;  The main case of Natural Gradients is that the usual the gradient descent methods does not always guarantee the correct convergence to the local minima. This is because, the gradient-based methods are actually first-order (and second-order for Newton methods) approximations of the loss function $L(\boldsymbol \theta)$ of the model using the Taylor expansion.

$$
\begin{aligned}
L(\boldsymbol \theta) &\approx L(\boldsymbol \theta_0) + (\boldsymbol \theta - \boldsymbol \theta_0)^T\nabla_{\boldsymbol \theta}L(\boldsymbol \theta_0) + \frac{1}{2}(\boldsymbol \theta - \boldsymbol \theta_0)^T\mathbf{H}(\boldsymbol \theta - \boldsymbol \theta_0)
\end{aligned}
$$

The first-order method can be seen as a local *linear approximation* to the loss function; and the second-order methods like that of Newton's improve upon them, using the Hessian matrix as a *quadratic approximation to the local curvature*. The Natural Gradients alleviate this problem by considering the *actual* Riemannian curvature $\mathbf{G}$ of the loss landscape. Therefore, *natural gradient* $\mathbf{d}$ move along the steepest direction accounting for the local curvature of the loss function.

$$
\begin{aligned}
\mathbf{d} = -\mathbf{G}^{-1}(\boldsymbol \theta)\nabla_{\boldsymbol \theta}L(\boldsymbol \theta)
\end{aligned}
$$

### Exponential Family
The Exponential family is a family of probability distributions whose probability density is of the following form -

$$
\begin{aligned}
p(x|\boldsymbol \theta) = h(x)\exp \big [ \eta(\boldsymbol \theta)^T T(x) - A(\eta(\boldsymbol \theta))\big ]
\end{aligned}
$$

Where $\eta$ is called as the natural parameters, $T(x)$ is the *sufficient statistic* and $A$ is called as the *log-partition function*. The above form is called *Canonical* if $\eta(\boldsymbol \theta) = \boldsymbol \theta$. It turns out that most of the probability distributions that we deal with - such are Gaussian, Categorical, Poisson, Beta, Gamma, Bernoulli, Binomial and so on, all belong to this class. Apart from its direct real-world applications and being computationally simple, the above canonical family has an important feature - the derivatives of the log-partition function provides the various moments of the distribution as -

$$
\begin{aligned}
\nabla_{\boldsymbol \theta}A(\boldsymbol \theta) &= \mathbb{E}_{\boldsymbol \theta}[T(x)]\\
\nabla_{\boldsymbol \theta}^2 A(\boldsymbol \theta) &= \text{Cov}(T(x)) = \mathbf{F}(\boldsymbol \theta)
\end{aligned}
$$

where $\mathbf{F}$ is the Fisher Information matrix. (For proof of the above equalitiy, Refer to John Duchi's lecture notes[^3]).

### So what's the connection?
&emsp;  From a probabilistic perspective, the loss function of a *generative model* can be viewed as minimizing the KL divergence between the actual distribution from which the data was sampled and the  distribution that the model can represent. If the KL divergence between these two distributions is low enough, then the samples from the model will be as close as the original data. There are also some nice properties of this KL divergence relating to the MAP estimate, but it is beyond the scope of this quick post.

It turns out that the local **Fisher Information matrix** $\mathbf{F}$ provides the complete local Riemannian metric $\mathbf{G}$ for such a loss function between two distributions. This is a consequence of the fact that probability distributions are objects on a Riemannian manifold rather than Euclidean space. In a future post, we shall discuss the actual derivation of the above relation. Therefore, the natural gradients can be written as

$$
\begin{aligned}
\mathbf{d} = -\mathbf{F}^{-1}(\boldsymbol \theta)\nabla_{\boldsymbol \theta}L(\boldsymbol \theta)
\end{aligned}
$$

From the previous section, we know that for a canonical exponential family,

$$\mathbf{F}(\boldsymbol \theta) = \nabla_{\boldsymbol \theta}^2 A(\boldsymbol \theta)$$
and additionally the expectation $\boldsymbol \mu$ of the model distribution $q$ is given by

$$
\begin{aligned}
\boldsymbol \mu = \mathbb{E}_{q(\boldsymbol \theta)}[x] = \nabla_{\boldsymbol \theta}A(\boldsymbol \theta)
\end{aligned}
$$

Combining the above two equations, we get

$$
\begin{aligned}
\mathbf{F}(\boldsymbol \theta) = \nabla_{\boldsymbol \theta}\boldsymbol \mu
\end{aligned}
$$

Therefore, the natural gradient for this model distribution belonging to the exponential family can be rewritten as

$$
\begin{aligned}
\mathbf{d} &= -\mathbf{F}^{-1}(\boldsymbol \theta) \nabla_{\boldsymbol \theta} L\\
&= - \mathbf{F}^{-1}(\boldsymbol \theta) \nabla_{\boldsymbol \theta}\boldsymbol \mu \nabla_{\boldsymbol \mu} L \\
&= - \big (\nabla_{\boldsymbol \theta}\boldsymbol \mu \big )^{-1} \nabla_{\boldsymbol \theta}\boldsymbol \mu \nabla_{\boldsymbol \mu}L\\
&= - \nabla_{\boldsymbol \mu}L
\end{aligned}
$$

Therefore, the natural gradient in case of exponential families is simply the gradient of the loss function with respect to its mean parameters. This result, apart from avoiding the computation of the inverse, provides a way of computing the gradient with respect with the expectation parameters rather than the natural parameters, which may prove to be cumbersome to compute. For instance, if $q$ is a Gaussian, then the natural gradients are the gradients of the loss function with respect to its mean and variance. This idea has lead to fast efficient natural gradient descent algorithms [^2] with the modelling distribution being a member of the exponential family.


---- 


[^3]: Duchi, John, Lecture 9, *Fisher Information*, Statistics 311, Winter 2016, Stanford University - [Lecture Notes](https://web.stanford.edu/class/stats311/Lectures/lec-09.pdf)


[^2]: Khan, Mohammad Emtiyaz, et al. *Fast and Scalable Bayesian Deep Learning by Weight-Perturbation in Adam.* arXiv preprint arXiv:1806.04854 (2018).

<!-- [1] Hensman, James, Magnus Rattray, and Neil D. Lawrence. "Fast variational inference in the conjugate exponential family." Advances in neural information processing systems. 2012. -->