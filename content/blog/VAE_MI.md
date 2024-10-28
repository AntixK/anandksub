@def title = "VAEs, Diffusion, and Mutual Information"
@def published = "2 October 2024"
@def description = "Why did diffusion win over VAEs."
@def tags = ["math","ml", "code", "information-theory"]
@def draft = true
@def show_info = true
@def has_code = false
@def has_chart = false
@def has_math = true

&emsp; Consider the problem setup where we have a dataset $\vx \in \fX$ and and a latent variable $\vz \in \fZ$ and we want to learn the original data distribution $p_{\fX}(\vx)$ using the latent variable $\vz$. We assume a model distribution $p(\vx)$ such that

$$
p(\vx) = \int p(\vx|\vz)p(\vz)d\vz
$$\label{eq:ldm}

Where $p(\vx|\vz)$ is the likelihood of the data given the latent variable and $p(\vz)$ is the prior distribution of the latent variable. This is a general setup that allows for a flexible modelling of the data distribution with the ability to generate new samples. For instance, if $p(\vz)$ is a categorical distribution and $p(\vx | \vz)$ is a Gaussian, then the equation \eqref{eq:ldm} represents a Gaussian Mixture Model. The support of $p(\vz)$ determines whether it is a discrete latent model or a continuous latent model. In fact, the choice of $p(\vz)$ can be quite complex and there has been a lot of such proposals in the literature.

Whatever be the choice of $p(\vx|\vz)$ and $p(\vz)$, the goal is to match the model distribution $p(\vx)$ and the actual data distribution $p_{\fX}(\vx)$ as closely as possible. One common distance-like measure between two distributions is the Kullback-Leibler (KL) divergence. The KL divergence between $p(\vx)$ and $p_{\fX}(\vx)$ is given by

$$
\begin{aligned}
\KL \left (p_{\fX}(\vx) || p(\vx) \right ) &= \int p_{\fX}(\vx) \log \frac{p_{\fX}(\vx)}{p(\vx)}d\vx \\
&= \int p_{\fX}(\vx) \log p_{\fX}(\vx)d\vx - \int p_{\fX}(\vx) \log p(\vx)d\vx \\
&= -\H\left [p_{\fX}(\vx) \right ] - \E_{p_{\fX}(\vx)}[\log p(\vx)]
\end{aligned}
$$ \label{eq:kl_div}

Where $\H$ is the differential entropy of the data distribution. So, we can only control the second term in the above equation. In other words, minimizing the above KL divergence is equivalent to maximizing the likelihood of the given data samples under the model distribution $p(\vx)$. Therefore, every latent variable model inevitably involves maximizing the likelihood of the data samples under the model distribution.

## Two-Way Modelling in VAEs

&emsp; Observe that the likelihood $p(\vx|\vz)$ maps the latent space $\fZ$ to the data space $\fX$. The learning objective given in equation \eqref{eq:kl_div} is independent of the inverse mapping $p(\vz|\vx)$ from the data space to the latent space. Indeed, there have been approaches where only the likelihood (or the forward mapping from $\fZ \to \fX$) is optimized - GANs, for example.

Variational Autoencoders (VAEs), on the other hand, model both the forward and reverse mappings. Note that the reverse mapping $p(\vz|\vx)$ is the posterior distribution of the latent variable model. In other words, to model one, we need to model the other - a chicken and egg problem. Other techniques like the Expectation-Maximization (EM) algorithm alternates between computing the posterior (E-step) and using that to maximize the likelihood (M-step).

VAEs, quite beautifully, solve this problem by incorporating the posterior distribution in the above learning objective and in a most general way - using Variational Inference (VI). VAEs define a likelihood distribution (forward mapping) and a prior as these are straight-forward to model. The posterior distribution (reverse mapping) is approximated by a variational distribution $q(\vz|\vx)$. Now, second term in the equation \eqref{eq:kl_div} can be written as

$$
\begin{aligned}
\E_{p_{\fX}(\vx)}\left [\log p(\vx) \right ] &= \E_{p_{\fX}(\vx)} \left [\log \int p(\vx|\vz)p(\vz)d\vz \right ] \\
&= \E_{p_{\fX}(\vx)}\left [\log \int q(\vz|\vx)\frac{p(\vx|\vz)p(\vz)}{q(\vz|\vx)}d\vz \right ] \\
&= \E_{p_{\fX}(\vx)} \log \left [ \E_{q(\vz|\vx)} \left [ \frac{p(\vx|\vz)p(\vz)}{q(\vz|\vx)} \right ] \right ]\\
&\geq \E_{p_{\fX}(\vx)}\E_{q(\vz|\vx)} \left [\log \frac{p(\vx|\vz)p(\vz)}{q(\vz|\vx)} \right ] \qquad {\color{OrangeRed} \text{(Jensen's Inequality)}} \\
\end{aligned}
$$

The above VI objective is generic enough to be applicable for any latent variable model - given the likelihood, prior, and the variational distributions. This objective is called the Evidence Lower Bound (ELBO). In practice, VAEs optimize the ELBO written as

$$
\begin{aligned}
\E_{p_{\fX}(\vx)}\E_{q(\vz|\vx)} \left [\log \frac{p(\vx|\vz)p(\vz)}{q(\vz|\vx)} \right ]
&= \E_{\vx, \vz \sim  p_{\fX}(\vx)q(\vz|\vx)} [\log p(\vx|\vz)] - \E_{q(\vz|\vx)} \log q(\vz|\vx) + \E_{q(\vz|\vx)} \log p(\vz) d\vz  \\
&= \E_{\vx, \vz \sim  p_{\fX}(\vx)q(\vz|\vx)} [\log p(\vx|\vz)] - \int q(\vz|\vx) \log \frac{q(\vz|\vx)}{p(\vz)} d\vz  \\
&= \E_{\vx, \vz \sim  p_{\fX}(\vx)q(\vz|\vx)} [\log p(\vx|\vz)] - \KL \left (q(\vz|\vx) || p(\vz)  \right ) \\
\end{aligned}
$$\label{eq:elbo_vae}

### ELBO and Mutual Information

$$
\begin{aligned}
\E_{p_{\fX}(\vx)}\left [\log p(\vx) \right ] &\geq  \E_{p_{\fX}(\vx)}\E_{q(\vz|\vx)} \left [\log \frac{p(\vx|\vz)p(\vz)}{q(\vz|\vx)} \right ]  \\
&= \E_{\vx, \vz \sim  p_{\fX}(\vx)q(\vz|\vx)} \left [\log p(\vx|\vz) + \log p(\vz) - \log q(\vz|\vx) \right ]  \\
&= \E_{\vx, \vz \sim  p_{\fX}(\vx)q(\vz|\vx)} [\log p(\vx|\vz)] + \E_{ \vz \sim q(\vz|\vx)} [\log p(\vz)] - \E_{\vx, \vz \sim  p_{\fX}(\vx)q(\vz|\vx)} [\log q(\vz|\vx) ]  \\
&=\E_{\vx, \vz \sim  p_{\fX}(\vx)q(\vz|\vx)} [\log p(\vx|\vz)] + \E_{ \vz \sim q(\vz|\vx)} [\log p(\vz)] - \int   q(\vz|\vx) p_{\fX}(\vx) \log q(\vz|\vx) d\vx d\vz    \\
&=\E_{\vx, \vz \sim  p_{\fX}(\vx)q(\vz|\vx)} [\log p(\vx|\vz)] + \E_{ \vz \sim q(\vz|\vx)} [\log p(\vz)] + \H [\vz|\vx]\\
&=\E_{\vx, \vz \sim  p_{\fX}(\vx)q(\vz|\vx)} [\log p(\vx|\vz)] + \E_{ \vz \sim q(\vz|\vx)} [\log p(\vz)] + \H [\vz] - \I[\vx ; \vz]\\
\end{aligned}
$$ \label{eq:elbo_mi}

From the above equation, note that the first term is the qualitry  of mapping from $\fX \to \fZ \to \fX$. However, the last term specifies that the mutual information (non-negative) between $\vx$ and $\vz$ must be reduced. This constrasts with the first term where a robust mapping between $\vx$ and $\vz$ is necessary for good reconstruction.

Alternatively, note that the variational posterior $q(\vz|\vx)$ maps each data sample to a corresponding latent variable $\vz$ (amortized VI). With this, we can view the KL divergence in equation \eqref{eq:elbo_vae} as a regularizer of sorts - one that minimizes the overlap between the variational posterior and the prior. One way to minimize this overlap is to reduce the mutual information between the data and the latent variables.

<!---
The ELBO objective is to maximize the first term and minimize the last term. This is the crux of the problem with VAEs - the ELBO objective is a trade-off between maximizing the likelihood and minimizing the mutual information. This trade-off is the reason for the posterior collapse problem in VAEs.
-->

!!!
<img  style="width:85%;min-width:400px;"  src="/media/post_images/vae_collapse.svg" alt="VAE Training Problems">
<p class = "caption-text ">Illustration of some training issues with VAEs - especially with the mapping from data (black dots) to the prior distribution (black ellipses) by the amortized variational posterior (purple circles). Either the posterior can overlap (right) or can be disentangled but without learning any stochastic dependencies (left). Both results in a low mutual information between data and the latent variables.</p>
!!!

Clearly, the ELBO contains two contrasting terms that work against each other. One often comes across the term *disentanglement* in VAE literature. This simply means that the latent variables are close to being independent of each other and that each latent variable generates a specific data sample. In simpler terms, the latent space, idealy, should be a compressed representation of the data.

There are many approaches that address this issue[^vaeprior], and one very popular and simple approach is to bias the KL term in equation \eqref{eq:elbo_vae}, and hence the mutual information, to limit the posterior collapse. This is called the $\beta$-VAE.
$$
\begin{aligned}
\beta\mathrm{-ELBO} &= \E_{\vx, \vz \sim  p_{\fX}(\vx)q(\vz|\vx)} [\log p(\vx|\vz)] - \beta \KL \left (q(\vz|\vx) || p(\vz)  \right ) \\
&=\E_{\vx, \vz \sim  p_{\fX}(\vx)q(\vz|\vx)} [\log p(\vx|\vz)] + \beta \E_{ \vz \sim q(\vz|\vx)} [\log p(\vz)] + \beta\H [\vz] - \beta\I[\vx ; \vz]\\
\end{aligned}
$$\label{eq:beta_vae}


## Diffusion Models
So, how do diffusion models address this problem?
Remember when we mentioned that the choice of $p(\vz)$ can be quite complex? Diffusion models take it to an extreme.


Thesis: VAE's ELBO minimizes the MI. There has been a lot of effort in addressing this problem. How about diffusion models? Diffusion models are very similar to VAEs, and yet they produce images with very high fidelity and less prone to posterior collapse.

Write about Variational lower bound on MI. (https://papers.nips.cc/paper_files/paper/2003/file/a6ea8471c120fe8cc35a2954c9b9c595-Paper.pdf0). InfoMax principle.

https://openreview.net/pdf?id=rkxoh24FPH

Explain VAE's ELBO and Mutual Information (https://jmtomczak.github.io/blog/13/13_trouble_in_paradise.html)


Representations, Disentanglement, and mutual information.

Does betaVAE improve? (https://arxiv.org/pdf/1612.00410)

How about Diffusion models?


Should you maximize MI or Minimize MI? (https://arxiv.org/pdf/2108.12734)


Diffusion Models and Mutual Information (https://openreview.net/pdf?id=UvmDCdSPDOW)


https://openreview.net/pdf?id=X6tNkN6ate


------

[^vaeprior]: One way to address this issue is to modify the ELBO objective. The other way is to use a more expressive prior distribution. Even if we let the posterior collapse to the prior, if the prior is expressive enough, we can still generate diverse samples. This [link](https://jmtomczak.github.io/blog/7/7_priors.html) provides a great overview of many of the popular prior used in VAE litetature.
