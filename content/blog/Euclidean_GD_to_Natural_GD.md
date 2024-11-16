@def title = "Segue from Euclidean Gradient Descent to Natural Gradient Descent"
@def published = "18 August 2019"
@def description = "A slight change in SGD formulation, in terms of maximization of local approximation, leads to an interesting general connection to NGD via mirror descent."
@def tags = ["math","ml", "gradient", "natural-gradient", "deep-learning"]
@def has_math = true
@def has_code = false
@def is_draft = false
@def show_info = true
@def has_chart = false


&emsp;  Natural Gradient descent has recently been gaining quite a significant amount of attention (and rightly so!) since it was originally proposed by Shun-ichi Amari way back in the late 1990s. Especially the Approximate Bayesian Inference group at RIKEN-AIP, Tokyo, have successfully applied[^3] Natural gradients to a range of complex Bayesian models.

In this post, I shall discuss one simple yet interesting segue from gradient descent in Euclidean space to Natural gradient descent. In an [earlier blog post](https://antixk.github.io/blog/nat-grad-exp-fam/), we discussed the relationship between gradient descent and natural gradient descent for the exponential family of distributions. In this post, we shall see a more generic connection between them, leveraging the results of Raskutti et. al [^2].

Consider the standard SGD update with respect to the learning parameters $\boldsymbol{\theta}$ at time step $t+1$ in Euclidean space as follows

$$
\begin{aligned}
\boldsymbol \theta_{t+1} = \boldsymbol \theta_t + \beta_t \hat{\nabla}_{\boldsymbol{\theta}}L(\boldsymbol{\theta}_t)
\end{aligned}
$$

Where $\hat{\nabla}_{\boldsymbol{\theta}}L(\boldsymbol{\theta}_t)$ is the gradient of the loss function with respect to the parameters and $\beta_t$ is the current learning rate. The above SGD update can be reformulated as a local approximation maximization as follows -

$$
\begin{aligned}
\boldsymbol{\theta}_{t+1} = \underset{\boldsymbol{\theta}\in \Theta}{\mathsf{argmax}} \big\langle \boldsymbol \theta, \hat{\nabla}_{\boldsymbol{\theta}}L(\boldsymbol{\theta}_t) \big \rangle - \frac{1}{2\beta_t}
 \| \boldsymbol{\theta} - \boldsymbol{\theta}_t\|_2^2
 \end{aligned}
 $$

From a probabilistic perspective, $\boldsymbol \theta$ is the *natural parameter* of the modelling distribution. In other words, the model tries to learn the data using the distribution $q(\boldsymbol{\theta})$, whose natural parameters $\boldsymbol{\theta}$ are learned during training. Intuitively, the above equation is simply a constraint maximization problem with a constraint that $\|\boldsymbol{\theta} - \boldsymbol{\theta_t}\|_2$ is zero, and $-\frac{1}{\beta_t}$ is the Lagrange multiplier. SGD update given above, therefore, works in the natural parameter space. Note that the Euclidean norm in the second term, indicating that the descent happens in the Euclidean space.

Now, The natural gradient update is given by

$$
\begin{aligned}
\boldsymbol \theta_{t+1} = \boldsymbol \theta_t + \frac{1}{\beta_t} \mathbf{F}(\boldsymbol{\theta})^{-1}\hat{\nabla}_{\boldsymbol{\theta}}L(\boldsymbol{\theta}_t)
\end{aligned}
$$

Where $\mathbf{F}$ is the Fisher Information matrix. The gradient scaled by the corresponding Fisher information is called as the natural gradient.

#### Proximity Function
In equation (2), the Euclidean norm is actually a *proximity function* that measures the discrepancy of the loss function and its linear approximation with respect to the local geometry. This is quadratic term is exact for convex landscapes while provides a somewhat decent approximation for others.

From a different perspective, the proximity function can also be viewed as a prior belief about the loss landscape. Second order methods like that of Newton's, directly employ the Hessian to obtain the local quadratic curvature (which is still an approximation) and scale the gradients accordingly. Natural gradients, on the other hand, use the Riemannian curvature tensor (Represented here by the Fisher Information) to capture the exact local geometry of the landscape.

### The Connection
We rewrite the above maximization problem in terms of the expectation(mean) parameters of the distribution $q$, and use the KL divergence for the proximity function, to get the following mirror descent formulation.

$$
\begin{aligned}
\boldsymbol{\mu}_{t+1} = \underset{\boldsymbol{\mu}\in M}{\mathsf{argmax}} \big\langle \boldsymbol \mu, \hat{\nabla}_{\boldsymbol{\mu}}L(\boldsymbol{\theta}_t) \big \rangle - \frac{1}{\beta_t}
 KL(q_m(\boldsymbol{\theta})\|q_m(\boldsymbol \theta_t))
 \end{aligned}
 $$

Instead of performing the parameter update on the natural parameter space, we are updating its *dual* - the expectation parameters. The now, interesting the connection is that the above mirror descent update on the mean parameters, is equivalent to performing natural gradient update on the natural parameters.

#### Why Mirror Descent?
Mirror descent is a framework that accounts for the geometry of the optimization landscape. It is a generalized framework that incorporates almost all optimization algorithms and over high dimensions. For example, in high dimensions, the local linear or quadratic approximation of the loss surface usually fails. Therefore, it is desirable to employ the actual local geometry of the loss landscape, and mirror descent framework provides an elegant way to exactly that! The second term in the above two maximization formulations (a.k.a proximity function) $-$ the Euclidean norm and the KL divergence $-$ represents the movement of the parameters taking into account the geometry of the landscape.

<!-- For a more detailed description of the mirror descent method, refer [this document](http://www.princeton.edu/~yc5/ele538_optimization/lectures/mirror_descent.pdf). -->


#### Why does this work?
The main idea behind the above connection is that the Fisher information is the Hessian of the KL divergence between two distributions $q(\boldsymbol{\theta})$ and $q(\boldsymbol{\theta}')$. The proof is quite elaborate and I shall discuss in a subsequent post. Moreover, we can simply rewrite the natural gradient update in equation (3), as a maximization problem as follows -

$$
\begin{aligned}
\boldsymbol{\theta}_{t+1} = \underset{\boldsymbol{\theta}\in \Theta}{\mathsf{argmax}} \big\langle \boldsymbol \theta, \hat{\nabla}_{\boldsymbol{\theta}}L(\boldsymbol{\theta}_t) \big \rangle- \frac{1}{\beta_t}
 KL(q_m(\boldsymbol{\theta})\|q_m(\boldsymbol \theta_t))
 \end{aligned}
 $$

Now, it is clear that there is nothing special about the mirror descent in the mean parameter space. We could have as well said that it is a mirror descent in the natural parameter space. However, the connection is important as provides a much simpler way to perform natural gradient descent in the mean parameter space.

Recall the connection between the natural gradients and the Fisher information discussed in a [previous blog post](https://anandksub.dev/blog/Natural_gradient_exp_family).

$$
\begin{aligned}
\mathbf{F}(\boldsymbol{\theta})^{-1}\nabla_{\boldsymbol{\theta}}L(\boldsymbol{\theta}) = \nabla_{\boldsymbol{\mu}}L(\boldsymbol{\mu}_t)
\end{aligned}
$$

That is, the natural gradient with respect to $\boldsymbol{\theta}$ is simply the gradient of the loss function with respect to the mean parameters $\boldsymbol{\mu}$.  In other words, by combining with equation (4), the natural gradient descent is essentially gradient descent in mean parameter space. Now, with the help of the above equation, we can directly perform fast natural gradient descent by the following update

$$
\begin{aligned}
\boldsymbol \theta_{t+1} = \boldsymbol \theta_t + \beta_t \hat{\nabla}_{\boldsymbol{\mu}}L(\boldsymbol{\mu}_t)
\end{aligned}
$$


### Summing Up


!!!
<br>

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-0lax{text-align:left;vertical-align:top}
</style>
<table class="tg"><thead>
  <tr>
    <th class="tg-0lax"></th>
    <th class="tg-0lax">Gradient Descent</th>
    <th class="tg-0lax">Natural Gradient Descent</th>
  </tr></thead>
<tbody>
  <tr>
    <td class="tg-0lax"><b>Geometry</b></td>
    <td class="tg-0lax">Euclidean Geometry</td>
    <td class="tg-0lax">Statistical Manifold (Riemannian Geometry</td>
  </tr>
  <tr>
    <td class="tg-0lax"><b>Proximity Function</b></td>
    <td class="tg-0lax">Euclidean Norm</td>
    <td class="tg-0lax">Divergence (Ex. KL Divergence)</td>
  </tr>
  <tr>
    <td class="tg-0lax"><b>Gradient parameters</b></td>
    <td class="tg-0lax">Natural parameters $\boldsymbol{\theta}$ </td>
    <td class="tg-0lax">Mean parameters $\boldsymbol{\mu}$</td>
  </tr>
</tbody>
</table>

<br>

<br>
!!!


:::important
**Equivalence** : Natural Gradient in $\boldsymbol{\theta}$ $\Leftrightarrow$ Gradient in $\boldsymbol{\mu}$
:::

----

[^3]: Khan, Mohammad Emtiyaz, et al. "Fast and Scalable Bayesian Deep Learning by Weight-Perturbation in Adam." arXiv preprint arXiv:1806.04854 (2018).

[^2]: Raskutti, Garvesh, and Sayan Mukherjee. "The information geometry of mirror descent." IEEE Transactions on Information Theory 61.3 (2015): 1451-1457.


<!-- [1] Amari, Shun-ichi, and Scott C. Douglas. "Why natural gradient?." ICASSP. Vol. 98. No. 2. 1998. -->
