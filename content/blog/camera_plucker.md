@def title = "Camera Parameterization using Plücker Coordinates"
@def published = "27 February 2025"
@def description = "Plücker coordinates provide a smooth and convenient camera parameterization."
@def tags = ["computer-vision", "math", "torch", "code", "camera"]
@def is_draft = true
@def show_info = true
@def has_code = true
@def has_chart = false
@def has_math = true


&emsp; With the success of text-to-image models, the natural next step has been to generate videos - visually pleasing, temporally coherent, and geometrically consistent. As such, the past year or so has been abound with such video generation models with carefully crafted techniques and interestingly, a nice way of parameterizing the camera viewpoints. This parameterization[^ref], using Plücker coordinates has become quite popular among the recent learning-based methods for view and novel view synthesis tasks.

Plücker coordinates are essentially a way of parameterizing lines[^plu]. The Plücker coordinates of a given ray $l$ with unit direction $\vd \in \S^3$ through a point $\vp \in \R^3$ is given by

$$
l:= (\vp, \vn) \in \R^6; \qquad \vn = \vp \times \vd
$$

!!!
<img  style="width:40%;min-width:150px" src="/media/post_images/plucker.webp" alt="Plücker coordinates for camera">
<p class="caption-text">Plücker coordinates parameterizing the ray $l$.
</p>
!!!

The vector $\vn$, called the $moment$, is orthogonal to the plane containing the ray $l$ and the origin. If $\vn=0$, then the ray passes through the origin and is defined only its direction $\vd$.

Plücker coordinates are invariant to scaling *i.e.* $(\vp, \vn) = \lambda (\vp, \vn); \lambda > 0$ as the line itself does not change. Furthermore, the Plücker coordinate is independent of the choice of point $\vp$. Plücker coordinates also provide elegant ways of computing angles, signed distances between rays and more. With such convenient geometric calculations, Plücker coordinates were so far quite popular in robotics.

&emsp; The use of Plücker coordinates in camera projection and multi-view geometry is actually well-studied, described in Hartley and Zisserman's book *Multiple View Geometry in Computer Vision*. The idea there was to parameterize 3D lines in the world onto the image plane using Plücker coordinates.  However, camera parameterization _using_ Plücker coordinates is relatively new where the light rays incident on the image plane is parameterized. It is, therefore, a representation of the 3D scene, instead of a simple projective geometry.

!!!
<img  style="width:80%" src="/media/post_images/plucker_camera.webp" alt="Plücker coordinates for camera">
!!!

Consider the scenario where the image $\fI$ of size $H \times W$ and the camera parameters are known, including intrinsics $\vK \in \R^{3 \times 3}$ (mapping from camera coordinates to the pixel coordinates) and extrinsic pose $\vE=[\vR; \vt] \in \R^{3 \times 4}$ (mapping from the world coordinates to camera coordinates) where $\vR \in \R^{3 \times 3}$ is the rotation matrix and $\vt \in \R^{3 \times 1}$ is the translation vector. Then, the pixel value at $(u, v)$ on the image represents the intensity of the light ray incident at that position on the film as captured by the camera. Therefore, the unit direction $\vd$ of that light ray can be reconstructed as

$$
\begin{aligned}
\vd'&=\vR\vK^{-1} \begin{pmatrix}
u \\
v \\
1
\end{pmatrix} + \vt ; \qquad \; (\vR^{-1} = \vR^T) \\
\vd &= \frac{\vd'}{\|\vd'\|}
\end{aligned}
$$

Firstly, the above ray passes through the camera focal point (origin) as well the pixel coordinates $(u, v)$ in the world coordinate frame as shown by the figure above.

You may note that the above procedure is the inverse of the camera projection process.


The effectiveness of Plücker coordinates over traditional methods in robotics or computer graphics may be questionable[^rant], their use in deep learning is indeed effective.

TODO: Talk about the effectiveness of Plücker coordinates

The advantage of the above Plücker parameterization is that it can uniformly represent all oriented light rays in space without singular direction or special cases.

Why is the Plücker coordinates for camera inverse of the usual way ?
Advantage over homogeneous camera parameterization. Continuous? Differentiable?



```python
```

----

[^ref]: The use of Plücker coordinates to model camera viewpoints via parameterizing the incident light rays was first popularized in the context of deep learning by Sitzmann, et. al. in their 2021 NeurIPS paper - *Light field networks: Neural scene representations with single-evaluation rendering* [ArXiv Link](https://arxiv.org/abs/2106.02634).

[^plu]: The standard reference to all things Plücker coordinates is Yan-Bin Jia's notes - *Plücker Coordinates for Lines in the Space* [Link](https://faculty.sites.iastate.edu/jia/files/inline-files/plucker-coordinates.pdf)


[^rant]: Refer to Christer Ericson's great article against the use of Plücker coordinates - [Plücker coordinates considered harmful!](https://realtimecollisiondetection.net/blog/?p=13)
