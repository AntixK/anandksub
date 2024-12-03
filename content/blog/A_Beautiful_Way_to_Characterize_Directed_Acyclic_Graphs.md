@def title = "A Beautiful Way to Characterize Directed Acyclic Graphs"
@def published = "27 June 2021"
@def description = "An interesting connection between the number of cycles in a digraph and its power adjacency matrix leads to a beautiful formulation for DAG constrains."
@def tags = ["graph","math","ml"]
@def has_math = true
@def is_draft = false
@def show_info = true
@def has_code = true
@def has_chart = false


&emsp; Directed Acyclic Graphs, or simply *DAGs*, are graphs in which the connections/edges are one way (directed) and does not contain cycles *i.e.* no vertex can be reached from itself through other edges.

DAGs themselves, are just a model to understand the given data or a process. It is common to construct a model from the observed data/process such that it is a DAG. The usual formulation for such a problem is

> *Given a set of variables of interest, we observe the outcomes of their interplay. Can we then figure out their relations?*

 Mathematically this is written as a constraint when building a model that closely follows our observations. Given a set of $n$ observations $X \in \R^{n \times d}$, each of $d$ dimensions ($d$ variables of interest), we wish to construct a model $M$ such that a discrepancy function $f(X,M)$ is minimized, while enforcing the model to be a DAG.

$$
\min f(M,X) \\
\text{subject to: } M \text{ must be a DAG}
$$\label{eq:1}

The latter line of equation \eqref{eq:1} is the focus of this article. To begin, *any* square matrix $A \in \R^{d \x d}$ can be considered as a *weight adjacency matrix* corresponding to some graph $\fG(A)$. Each element $A_{ij}$ is the edge weight between the adjacent nodes $i, j$ the graph. Therefore, given any square matrix $A$, we can say that it induces a graph $\fG(A)$ whose weight adjacency matrix is $A$. We can now replace few words by symbols in our constraint. Our model is essentially a square matrix $W \in R^{d \x d}$ whose induced graph must be a DAG.

$$
\min f(W,X) \\
\text{subject to: } \fG(W) \in \text{ DAG}
$$

### Magnitude of the problem

The usual next step is to come up with a proxy function $h$ that is indicative of the "DAG-ness" of the model $W$; higher the value of $h(W)$, lower is its DAG-ness, $h(W)=0$ if and only if $\fG(W)$ is DAG. Characterizing DAG-ness with such a proxy function is hard, really hard. This is mainly because the problem is combinatorial in nature.

A simple check for acyclicity on a given graph is to check if there are any cycles back to each of the vertices through a backtracking search algorithm (like DFS)[^1]. However, more sophisticated methods like topological sort also exist. Notwithstanding the acyclicity check, the number of acyclic graphs increases _superexponentially_ with the number of dimensions $d$. For example, in case of $d=4$ (4-vextex graph), there are 31 possible DAGs, for $d=18$, there are $\approx 15 \x 10^{42}$ possible DAGs[^2]. Therefore, it is impractical to check all the DAGs even for a relatively small data.

Secondly, the problem is nonconvex, as the _feasible set_ or the set of all $d-$vertex DAGs is a nonconvex set.  A quintessential property of convex problems is that we can define a neighborhood where the members within that neighborhood share similar properties as they are easily interpolatable. This cannot be done in a non-convex set, as its members cannot be interpolated. This means that it is impossible to use clever techniques to reduce problem complexity. This is still the case after moving from the discrete space of DAGs to the continuous space of square matrices. In all non-convex problems, only a local solution can be found (within a convex neighborhood within the larger non-convex set).

Therefore, most of the existing literature are on approximate methods and even then, they only scale up to a handful of dimensions.

### NOTEARS Characterization

The NOTEARS characterization, first proposed by [Zheng et.al](https://arxiv.org/abs/1803.01422) in 2018, is an elegant way of characterizing DAG constraints with some quite desirable properties. The crucial insight behind their formulation goes back to [1971 in a paper](https://dml.cz/handle/10338.dmlcz/126802) by Frank Harary and Bennet Manvel and I shall discuss the idea in a chronological manner.

Harary and Manvel noted that the number of closed walks in a directed graph is related to the elements in the powers of its adjacency matrix. This *digraph lemma* is at the foundation of the NOTEARS characterization.

:::important
**Digraph Lemma:**
Given a directed graph $\fG$ of $d$ vertices and its binary adjacency matrix $A \in \R^{d \x d}$, the number of $k-$closed walks from vertex $i$ is given by $A^k_{ii}$, where $A^k$ is the $k^{th}$ power of $A$. The total number of $k-$closed walks is given by

$$
\sum_{i} A_{ii} = tr(A^k)
$$
:::

Note that a _cycle_ is a special case of a _closed walk_ whose the vertices are distinct, except the initial vertex. However, this difference is irrelevant to us as we care only about the case $tr(A^k) = 0$ for DAGs. For a DAG, $tr(A^k) = 0$ for all $k=1,2,...\infty$. Or simply
$$
\begin{aligned}
\sum_{k=1}^\infty tr(A^k) &= 0 \\
\sum_{k=1}^\infty tr(A^k) + d &= d \\
tr  \sum_{k=1}^\infty A^k + tr(I) &= d \\
tr \big (\sum_{k=0}^\infty A^k \big) &= d
\end{aligned}
$$\label{eq:2}

#### Intuition behind the Digraph Lemma
Consider the following directed graph $\fG$ -

!!!
<img  style="width:50%;min-width:400px;" src="/media/post_images/dag_ex.svg" alt="Directed graph">
!!!

Clearly, it has 3 cycles as follows: $1 \to 3 \to 2$, $3 \to 4$ and $1 \to 3 \to 4$. The corresponding binary adjacency matrix $A$ and its powers are given by

$$
\begin{aligned}
A &=
\begin{bmatrix}
0 & 0 & 1 & 0 \\
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 1 \\
1 & 0 & 1 & 0
\end{bmatrix}
A^2 &=
\begin{bmatrix}
0 & 1 & 0 & 1 \\
0 & 0 & 1 & 1 \\
2 & 0 & 1 & 0 \\
0 & 1 & 1 & 1
\end{bmatrix}\\
A^3 &=
\begin{bmatrix}
2 & 0 & 1 & 0 \\
0 & 1 & 0 & 1 \\
0 & 1 & 2 & 1 \\
2 & 1 & 1 & 1
\end{bmatrix}
\end{aligned}
$$
Here, we computed only till $A^3$ since we know the longest cycle in the graph is of length 3. The trace here is nonzero since there are closed paths of length 3. Let's look closely at these matrices and understand what their terms mean.

By definition, the terms in $A_{ij}$ indicate whether there is a link from $i \to j$. If a vertex has a self loop *i.e.* loops to itself without connecting to any other node, then $A_{ii}$ would be greater than zero. Therefore, $A_{ii} > 0$ if and _only_ if there are self loops.

For $A^2$, from the definition of matrix multiplication, we have $A^2_{ii} = \sum_{k=1}^4 A_{ik}A_{ki}$. If there are any closed paths of length 2, it will be captured here because then $A_{ik} = A_{ki} = 1$. Therefore, $A^2_{ii} > 0$ if and _only_ if there are $2-$closed paths. We can extrapolate this reasoning to higher powers and validate the digraph lemma.

A slight caveat - we have only considered cycles here and indeed, in the above graph, there is a 4-closed path route - $3 \to 2 \to 1 \to 3 \to 4$. This is again reflected in $A^4$ if you compute it. in fact, as there is a loop between nodes 3 and 4, we can find infinitely many closed paths. Since our concern is only about cycles, which is a special case of closed paths, we only care about non-existence of any closed path.

#### Generalizing the Insight
Zheng et. al. improved upon this insight to present a computable and a simpler formulation over a general _weighted_ adjacency matrix. They observed that in the above equation, the terms inside the trace is similar to the matrix exponential, given by
$$
e^A = \sum_{k=0}^\infty \frac{1}{k!} A^k
$$
Computing the $k^{th}$ power of a matrix can be done at $\fO(\log_2 k)$ matrix multiplications, each of which has $\fO(d^3)$ complexity and we have an infinite series to compute. The matrix exponential $e^A$, on the other hand, can be computed in $\fO(d^3)$ directly without numerical issues. Therefore, we can simply replace this in equation \eqref{eq:2} as
$$
\begin{aligned}
tr \big (\sum_{k=0}^\infty A^k \big) &= d \\
tr (e^A) &= d
\end{aligned}
$$
Note that the factors $1/k!$ do not matter here. In fact, the authors mention that these reweighting factors help in conditioning the matrix exponential as the number of dimensions grows.

To extend this idea to any weighted adjacency matrix, rather than any binary adjacency matrix, note that the above arguments follow only as long as the matrix is non-negative. A simple way to make any given matrix into a non-negative matrix is to take its *Hadamard* product $A \circ A$, which is just an element-wise matrix multiplication.

Wrapping up everything, we can characterize the DAG constraint elegantly as
$$
\min f(W,X) \\
\text{subject to: } h(W) -d = 0
$$
Where $h(W) = tr(e^{W \circ W})$. Now, this constraint is smooth, computable (converges for all matrices), and most importantly, **differentiable**. This differentiablity is important to address the non-convexity of the problem, leveraging the slew of performant gradient-based optimization algorithms available today.

----

[^1]: Another simple idea is to remove or "peel" off the lead nodes until we have either peeled off all nodes (acyclic) or no leaf nodes left (cyclic). [Link](https://www.cs.hmc.edu/~keller/courses/cs60/s98/examples/acyclic/)

[^2]: Robinson R.W. (1977) Counting unlabeled acyclic digraphs. In: Little C.H.C. (eds) Combinatorial Mathematics V. Lecture Notes in Mathematics, vol 622. Springer, Berlin, Heidelberg. https://doi.org/10.1007/BFb0069178
