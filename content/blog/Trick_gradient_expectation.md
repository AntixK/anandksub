@def title = "A Trick for Computing the gradient of Expectation"
@def published = "08 June 2020"
@def description = "A trick for interchanging the gradient and Expectation of a function under the Gaussian distribution."
@def tags = ["math","ml", "gradient", "deep-learning"]
@def has_math = true
@def has_code = false
@def is_draft = false
@def show_info = true
@def has_chart = false


&emsp;  I recently came across this elegant trick for computing the gradient of any function written as an expectation with respect to a Multivariate Gaussian distribution, when I was reading about Natural Gradients.

Consider any function $f$ whose expectation is written as a $\mathbb{E}_q[f(\mathbf{x})]$, where $q = N(\mu, \Sigma)$ is a multivariate Gaussian distribution. Firstly, why this peculiar form and when do I need it? The above form is widely used in Machine Learning - especially in variational methods where $f(x)$ is usually the log-likelihood of your model and the standard method to maximize it is by pushing its lower bound(ELBO) using the another distribution $q$ (usually Gaussian).

The core idea behind this trick is to write the expectation in terms of the *characteristic function* $G(\mathbf{k})$ of the Gaussian $q$ as

$$
\begin{aligned}
\mathbb{E}_q[f(\mathbf{x})] &= \frac{1}{(2\pi)^n}\int  G(\mathbf{k}) \int e^{-i\mathbf{k}^T\mathbf{y}}f(\mathbf{y})d\mathbf{y} d\mathbf{k} \\
&= \frac{1}{(2\pi)^n}\int \int G(\mathbf{k})e^{-i\mathbf{k}^T\mathbf{y}}f(\mathbf{y})d\mathbf{y} d\mathbf{k}\\
&= \frac{1}{(2\pi)^n}\int \int e^{-0.5\mathbf{k}^T\Sigma\mathbf{k}+i\mathbf{k}^T\mu}e^{-i\mathbf{k}^T\mathbf{y}}f(\mathbf{y})d\mathbf{y} d\mathbf{k}
\end{aligned}
$$

Note that the above formula is simply the area under the curve defined by the product of $G(\mathbf{k})$ (Fourier Transform of the Gaussian density function) and the Fourier Transform of $f(\mathbf{x})$. In the above equation, observe that taking the gradient with respect to $\mu$ is equivalent to taking the gradient with respect to $\mathbf{y}$ but with a negative sign. as $\nabla_{\mu}e^{i\mathbf{k}^T(\mu - \mathbf{y})} = - \nabla_{\mathbf{y}}e^{i\mathbf{k}^T(\mu - \mathbf{y})}$. Then, using integration by parts with respect to $\mathbf{y}$, the following equations can be obtained -

$$
\begin{align}
\nabla_\mu \mathbb{E}_q[f(\mathbf{x})] &= \mathbb{E}_q[\nabla_\mathbf{x}f(\mathbf{x})]\\
\nabla_{\Sigma} \mathbb{E}_q[f(\mathbf{x})] &= \frac{1}{2}\mathbb{E}_q [\nabla_\mathbf{x}^2f(\mathbf{x})]
\end{align}
$$

The second formula can be derived though similar arguments.

**Note:** The above two formulae are called as *Bonnet's Theorem* and *Price's Theorem* respectively and they can also be derived without using the Characteristic functions or Fourier Transforms. For a gist of the derivation, Refer to Danilo Rezende et.al's paper[^2].

&emsp;  *So, exactly what is that which makes the above formula a trick?* **Monte-Carlo methods**. Recall that Monte-Carlo methods essentially compute the expectation through sampling.
However, sampling is a discrete process and hence, gradients cannot be computed. This problem can be circumvented by interchanging the gradient and the expectation such that sampling can be done over the gradient. The famous Gaussian re-parameterization trick (using in VAEs) is one solution to overcome the problem. The above trick is a more general solution to compute the gradients for *any* function expressed as an expectation with respect to a Gaussian.

----


[^2]:  Rezende, Danilo Jimenez, Shakir Mohamed, and Daan Wierstra. *Stochastic backpropagation and approximate inference in deep generative models.* arXiv preprint arXiv:1401.4082 (2014). [Link](https://arxiv.org/abs/1401.4082). **Additional Reference:** Opper, Manfred, and Cédric Archambeau. *The variational Gaussian approximation revisited.* Neural computation 21.3 (2009): 786-792 [Link](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=b3d7d50f527ab3e7bb31aa8bdd5d110d23ab1ca4).