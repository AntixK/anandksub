@def title = "Differentiating Straight-Through Combinatorial Solvers"
@def published = "2 August 2024"
@def description = "Naive zeroth-order gradient estimation for backpropagating through combinatorial solvers."
@def tags = ["math","ml", "code", "gradient", "deep-learning", "combinatorial-solver"]
@def is_draft = true
@def show_info = true
@def has_code = true
@def has_chart = false
@def has_math = true


&emsp; Many of the common real-world problems have been well-defined and have efficient solvers. For example, the bin packing problem, Travelling Salesman Problem (TSP), shortest path in a graph etc, have been well-studied. Some other problems may be reduced to one of these NP-complete problems and any of the many off-the-shelf solvers can be used to solve them. Tremendous effort have been put into building efficient solvers and many of them are publicly available.

&emsp; A curiosity may arise - to employ neural networks or any gradient-based learners with a combinatorial layer in their midst. For example, a simple path finding task may be given, but with unknown graph weights that must be inferred from the problem (say, a 2D image). These kind of obfuscations are far more common in real-world scenarios. In such cases, machine learning (gradient-based) models may be used to cast the problem suitable for the combinatorial solver.

!!!
<img  style="width:70%;min-width:300px;"  src="/media/post_images/blackbox_diff.webp" alt="Smoothing Shortest Path Loss Landscape">
<p class = "caption-text">Two ways of combining gradient-based models with combinatorial solvers.</p>
!!!


The issue with combinatorial solvers is that the input-output relationship is piecewise constant. Although the gradient exists *almost everywhere*, it is a constant zero almost everywhere and undefined at the discontinuities. It is thus, not sufficient to handle just the discontinuities, but also the piecewise constant nature of the solver.


Observe that the it is not necessary to relax the contraints of the solver to make it differentiable. The solver itself is discrete and can handle the discrete input. We only need to relax the output of the solver to get a gradient estimate. The combinatorial solver can be a black-box and the gradient estimate can be obtained by backpropagating through the relaxed output.

The perturbation essentially converts the piecewise constant input-output mapping to piecewise *affine*.

!!!
<img  style="width:100%;min-width:300px;"  src="/media/post_images/shortest_path_smoothing.webp" alt="Smoothing Shortest Path Loss Landscape">
<p class = "caption-text">The Input-Output mapping for the Shortest-Path solver can be made piecewise affine by perturbation.</p>
!!!


Take the case of shortest path problem. It is well known as we have efficient solutions given a graph with edge weights between its nodes. Dijkstra's algorithm is a popular one that is provably optimal for this class of problems (graph with non-negative weights). This, however, is a combinatorial solver and has the characteristic issues discussed above.


Say, we use some model $f$ to predict the edge weights of a graph as $\hat{w}$. This can be used to solve for the shortest path $y$ using the Dijkstra solver $\hat{y} = \texttt{Dijkstra}(\hat{w})$.

The gradient across the solver can be computed as a finite difference between the original output $\hat{y}$ and the perturbed output $y_\lambda$.

$$
\nabla_w f(\hat{w}) = -\frac{1}{\lambda} \left [\hat{y} - y_\lambda \right ]
$$

However, since the solver is piecewise constant, the perturbation $\lambda$ should be applied to the *input* of the solver rather than its output. Mathematically,

$$
\begin{aligned}
w_\lambda &= \hat{w} + \lambda \nabla_y L(\hat{y}) \\
y_\lambda &= \texttt{Dijkstra}(w_\lambda)
\end{aligned}
$$

The above technique is general enough to be used with any combinatorial solver , replacing the $\texttt{Dijkstra}$.


## Code
```python
import torch
from typing import Tuple

def solver_func(inputs):
    """
    Combinatorial solver function.
    """
    ...


class Solver(torch.autograd.Function):
    @staticmethod
    def forward(ctx, weights: torch.Tensor, lambda_val:float):
        """
        Forward pass of the combinatorial solver layer.

        Args:
            ctx: context for backpropagation
            weights (torch.Tensor): input for the solver
            lambda_val: perturbation parameter

        Returns:
            Result of the solver.
        """
        ctx.weights = weights.detach().cpu().numpy()
        ctx.lambda_val = lambda_val
        ctx.solver_result = np.asarray([solver_func(arg) for arg in list(ctx.weights)])
        return torch.from_numpy(ctx.solver_result).float().to(weights.device)

    @staticmethod
    def backward(ctx, grad_output: torch.Tensor) -> Tuple:
        assert grad_output.shape == ctx.solver_result.shape

        # Get the gradient output of the previous layer
        grad_output_numpy = grad_output.detach().cpu().numpy()

        # Get perturbed inputs for the combinatorial solver
        weights_pert = np.maximum(ctx.weights + ctx.lambda_val * grad_output_numpy, 0.0)

        # Pass the perturbed weights through the solver to get corresponding results
        solver_result_pert = np.asarray([solver_func(arg) for arg in  list(weights_pert)])

        # Compute the gradient estimate
        gradient = -(ctx.solver_result - solver_result_pert) / ctx.lambda_val
        return torch.from_numpy(gradient).to(grad_output.device), None
```
