@def title = "Classification to Regression and Back"
@def published = "26 September 2024"
@def description = "A trick to convert classification labels to regression targets and back."
@def tags = ["math","ml", "code"]
@def has_math = true
@def is_draft = false
@def show_info = true
@def has_code = true
@def has_chart = false


&emsp; Don't ask me why, but what if you need to convert a simple multi-class classification problem into a regression problem? Usually, the other way is easier - converting continuous regression targets into classification is done using a simple binning. It is much more popular in Neural Networks (NNs) than classical ML models since NNs are generally better at classification than regression[^1]. 

But surely, it is an interesting problem to convert discrete classification labels to continuous regression targets and back, irrespective of the model. Let us try to formulate the problem.

> Given a dataset $\fD = \{(x_i, c_i)\}$ where $x_i$ is the input and $c_i$ is its corresponding class label, find a technique to convert it into a regression dataset $\{(x_i, y_i)\}$ with continuous target variable $y_i$.


Now, any given discrete class label can be mapped onto a simplex. A simplex is just an $N$-dimensional triangle. So, a class label of 1 in a three class label system of $\{1,2, 3\}$ can be mapped to a simplex as $[1,0, 0]$ and the label 2 as $[0, 1, 0]$ - as in 3D, a unit equilateral triangle is the simplex. Similarly we can extend this idea to $N$ dimensions, where given $N$ classes $\{1, 2, \ldots, N\}$, the $i^{th}$ label will be represented on the simplex as a $N$-d vector with 1 at the $(N-i+1)^{th}$ position. But why a simplex? Well, simplex is the smallest possible form (polytope) where each label is uniquely identifiable. You may recall this simplex-mapping in ML as one-hot encoding.
!!!
<img  style="width:50%;min-width:400px;"  src="/media/post_images/one-hot.svg" alt="One-Hot Encoding">
!!!

The above encoding can be thought as each label existing on the non-origin vertex of the $N$-d unit-simplex. Which implies that the sum of the coordinates sum up to 1. We can then re-imagine them as a probability vector for the $i^{th}$ class. In other words, the simplex can be recast as logits. 

Say, given a $N$-d one-hot encoding, how we map it to a $N$-d probability vector $\{[p_1, p_2, \ldots, p_N] \in \R^N | p_i \geq 0, \sum p_i = 1 \}$. Any procedure involving the conversion of discrete to continuous must have some relaxation or noise addition. In literature, it is sometimes called as *label smoothing*. Let us try to reuse the label smoothing used in say, the Inception V2 paper[^2].

$$
LS(\delta_i) = (1 - \gamma) \delta_i + \gamma \epsilon
$$

where $\delta_i$ is the one-hot vector of the $i^{th}$ class, $\epsilon \sim \fU$ is a uniform noise distribution over the $N$ classes, and $\gamma$ is the coefficient that controls the relaxation. Basically, given a uniform prior distribution over all classes, each label is jittered away from the vertex. This relaxed one-hot vector is now a point on the *probability simplex*. 


!!!
<img  style="width:30%;min-width:300px;"  src="/media/post_images/label-smooth.svg" alt="Label Smoothing">
!!!

So, that's it? We have now a real-valued vector from the discrete class labels. Note that these vectors, although continuous, exists on the simplex. In other words, they are constrained to be within the simplex. Even if we use a regression loss, the optimizer needs account for this constraint. This is not so straight-forward[^3]. 

&emsp; Here's the most interesting part of the problem - one that motivated me to write this article. One can transform the probability simplex vector such that the resultant follows a Multivariate Normal (MVN) Distribution. That is, given the relaxed simplex vector $\delta_i$

$$
\begin{aligned}
y_i = \big [\log(\delta_i^1 / \delta_i^M), \log(\delta_i^2 / \delta_i^M), \ldots, \log(\delta_i^N / \delta_i^M) \big ] \sim \fN
\end{aligned}
$$

Where $\delta_i^j$ is the $j^{th}$ component of the $\delta_i$ vector, and $\delta_i^M$ is the $M^{th}$ component of $\delta_i$ chosen to the normalizer. This result is due to Aichison and Shen (1980)[^4]. 

Based on the above idea, a general class of log-ratio transforms were introduced to reparameterize probability simplexes on to MVN. The one caveat being that no logit should be zero. A more recent such log-ratio transform is the *isometric log-ratio transform* (ILR). This is a more sophisticated transform but the crux is still the log-ratio of the individual components. IRL uses the geometric mean of the simplex vector to normalize the simplex vector and projects the resultant log vector unto an orthogonal space.

$$
\begin{aligned}
p_i &= \big [ \log(\delta_i^1 / g(\delta_i)), \ldots,  \log(\delta_i^N / g(\delta_i)) \big ]\\
y_i &= V^T p_i  && \color{OrangeRed} \text{(ILR)}
\end{aligned}
$$
Where $g(\delta_i)$ is the geometric mean of the vector $\delta_i$, and $V$ is some orthonormal basis matrix of size $N \times (N-1)$. The resultant $y_i$ is a real-valued continuous, unconstrained, normal-distributed variable (of $N-1$ dimensions), which can be directly used for regression problems.

&emsp; Even more fascinating is that the procedure is completely reversible. The reverse operation is to directly map the variables back to the simplex space (inverse  orthogonal transformation) and undo the log-ratio transformation via a simple softmax. This yields the relaxed logits from which the labels can be determined losslessly. Note that even the binning operation to convert regression to classification is lossy as we cannot completely recover the value from the predicted bin.


### Code

```python
import numpy as np
from scipy.stats import gmean    # geometric mean
from scipy.linalg import helmert # For orthogonal matrix
from scipy.special import softmax 

def label_to_continuous(labels, num_classes:int, gamma:float = 0.3):
    """
    Transforms the given labels into a set of 
    continuous, unconstrained normal-distributed variables
    of dimension num_classes-1.
    """
    # One hot encoding
    delta = np.eye(num_classes)[labels]

    # Relaxation (epsilon = 1 / num_classes)
    delta = (1.0 - gamma) * delta +  gamma * np.ones_like(delta) / num_classes

    # Compute log ratios
    log_ratios = np.log(delta / gmean(delta, axis=-1).reshape(-1,1))

    # orthogonal basis
    V = helmert(num_classes, full=True)[1:]
    # Sanity check
    assert np.allclose(V @ V.T, np.eye(N-1))

    return log_ratios @ V.T

def continuous_to_label(y, num_classes:int):
    """
    Inverts the given set of continuous variables back
    to discrete labels.
    """
    V = helmert(num_classes, full=True)[1:]
    # Get log ratios
    lr = y @ V

    # Invert log ratios
    delta = softmax(lr)

    # Compute labels
    return np.argmax(delta, -1)  

```

## But Why Tho?
&emsp; Well, the paper[^5] that proposed this idea, applied it to instances where the labels are noisy. Since, regression problems have a much more robust techniques for dealing with such issues (like separating noise form the signal), many noisy-label classification problems can be improved using this technique.

Another idea, again proposed by the first author Erik Englesson in a talk, is to apply to Gaussian Process classification. GP classification is intractable, and relies on Laplace approximation. This could also be a potential idea to map the classes to regression targets, perform GP regression, and map it back to discrete labels.

In any case, the idea of a simple log-ratio reparameterization to yield normal-distributed variables was quite fascinating. And that is enough for me!

----

[^1]: Pose estimation, and object detection models (both using regression losses) do work well in practice, but generally for lower dimensional regression problems, NNs do not work well. They are better at classification. NNs using regression losses (say, MSE or NLL) work well when the dimensionality is high (MSE between images / large tensors). In fact, there's some research trying to understand why this is the case - based on the distribution of regression targets. See [A step towards understanding why classification helps regression](https://arxiv.org/abs/2308.10603) and [Balanced MSE for Imbalanced Visual Regression](https://arxiv.org/abs/2203.16427).

[^2]: ArXiv Link: [Rethinking the Inception Architecture for Computer Vision](https://arxiv.org/abs/1512.00567).

[^3]: The above relaxed vectors may be assumed to follow the Dirichlet distribution, as it is tractable. But there is an easier way.

[^4]: More formally, Aitchison introduced a family of distributions over the probability simplex - Logistic Normal distribution - that is easier to work with than conventional Dirichlet distribution. Furthermore, he also showed that these Logistic-Normal distributions are closer to the Dirichlet distribution in terms of KL divergence. Further reference: Aitchison J and Shen SM (1980) *Logistic-normal distributions. Some properties and uses*. Biometrika 67(2), 261–272.

[^5]: Englesson, Erik, and Hossein Azizpour. *Robust classification via regression for learning with noisy labels.* ICLR 2024, Vienna, 2024. [OpenReview Link](https://openreview.net/forum?id=wfgZc3IMqo)