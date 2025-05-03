@def title = "Estimating Camera Parameters from Depth Maps"
@def published = "6 May 2025"
@def description = "Warping images based on depth and camera viewpoints for novel view synthesis"
@def tags = ["computer-vision", "geometric-projection", "image-processing", "math", "torch", "code", "camera"]
@def is_draft = true
@def show_info = true
@def has_code = true
@def has_chart = false
@def has_math = true


&emsp; When reading through the Dustr paper, I came across an interesting algorithm.

How do you estimate the camera intrinsic parameters? Can it be posed as an optimization problem?

Recall that the intrinsic camera parameters is the matrix $K \in \R^{3\x 3}$ given by

$$
K = \begin{pmatrix}
f_x & s & x_0 \\
0 & f_y & y_0 \\
0 & 0 & 1
\end{pmatrix}
$$

where $f_x, f_y$ are the focal lengths along the $x$ and $y$ axes of the image respectively, $s$ is the axis skew, and $x_0, y_0$ are the principal point offsets from the image plane's origin. The principal point is the point where the ray from the camera perpendicular to the image, intersects the image.

Usually, it is standard practice to assume that the camera is well positioned (without skew) and calibrated that the principal point is at the center of the image plane *i.e* $x_0 = \frac{W}{2}, y_0 = \frac{H}{2}, s = 0$. Furthermore, we assume that the pixel are almost squares $f_x =  f_y$. Thus, we only need to estimate the focal length to get the complete intrinsic matrix.

The point map $P \in \R^{W \x H \x 3}$ of the given image $I \in \R^{W \x H \x 3}$ and corresponding depth map $D \in \R^{W \x H}$ can be computed in a straightforward manner as
$$
P_{ij} = K^{-1}D_{ij}\begin{pmatrix}
i \\
j \\
1 \end{pmatrix}
$$

Given a point map $P$ (which is naturally expressed in the coordinate frame of its corresponding image $I$), the focal length $f$ can be expressed as the following minimization problem

$$
f^* = \argmin_f \sum_{i=0}^W \sum_{j=0}^H C_{ij} \bigg \|(i',j') - f \left ( \frac{P_{ijx}}{P_{ijz}}, \frac{P_{ijy}}{P_{ijz}} \right ) \bigg \|
$$\label{eq:weber}

Where $(i', j') = \left (i - \frac{W}{2}, j - \frac{H}{2} \right )$ are the pixel coordinates with respect to the image center (principal point), $\frac{P_{ijx}}{P_{ijz}}, \frac{P_{ijy}}{P_{ijz}}$ is the projection of the $x, y$-coordinates of the 3D point map onto the image plane at the index $(i, j)$, and $C_{ij}$ is the confidence map associated with the estimated depth map $D$. When the original (metric) depth map is known, $C_{ij} = 1; \quad \forall i,j$

The above equation \eqref{eq:weber} finds the focal length that minimizes the projection error.

!!!
<img  style="width:100%" src="/media/post_images/focal_proj.png" alt="point map projection">
<p class="caption-text">Projecting 3D point maps back to the image plane for estimating focal length.
</p>
!!!
