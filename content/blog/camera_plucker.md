@def title = "Camera Parameterization using Plücker Coordinates"
@def published = "27 February 2025"
@def description = "Plücker coordinates provide a smooth and convenient camera parameterization."
@def tags = ["computer-vision", "math", "torch", "code", "camera"]
@def is_draft = false
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

The vector $\vn$, called the $moment$, is orthogonal to the plane containing the ray $l$ and the origin. If $\vn=0$, then the ray passes through the origin and is defined only its direction $\vd$. A quick note: observe that the above  Plücker coordinates are 6 dimensional, while a line in 3D only requires 4 dimensions to completely represent it. But, we also have the constraint $\vn^T\vp = 0$. Reconciling these two, we note that the Plücker coordinates lie on a curved 4-dimensional manifold in $\R^6$.

Plücker coordinates are invariant to scaling *i.e.* $(\vp , \vn) = \lambda (\vp , \vn); \lambda > 0$ as the line itself does not change. Furthermore, the Plücker coordinate is independent of the choice of point $\vp$. Plücker coordinates also provide elegant ways of computing angles, signed distances between rays and more. With such convenient geometric calculations, Plücker coordinates were so far quite popular in robotics.

&emsp; The use of Plücker coordinates in camera projection and multi-view geometry is actually well-studied, described in Hartley and Zisserman's book *Multiple View Geometry in Computer Vision*. The idea there is to parameterize 3D lines in the world onto the image plane using Plücker coordinates. Such lines can then be used for camera calibration, and this technique has been used for in-the-wild camera calibration without the need for pre-calibrated markers. On the other hand, camera parameterization _using_ Plücker coordinates is relatively a recent development, where the light rays incident on the image plane are parameterized. In other words, the camera is parameterized by all the incident rays, and can be thought as a representation of the real 3D scene.

!!!
<img  style="width:80%" src="/media/post_images/plucker_camera.webp" alt="Plücker coordinates for camera">
!!!

Consider the scenario where the image $\fI$ of size $H \times W$ and the camera parameters are known, including intrinsics $\vK \in \R^{3 \times 3}$ (mapping from camera coordinates to the pixel coordinates) and extrinsic pose $\vE=[\vR; \vt] \in \R^{3 \times 4}$ (mapping from the world coordinates to camera coordinates) where $\vR \in \R^{3 \times 3}$ is the rotation matrix and $\vt \in \R^{3 \times 1}$ is the translation vector. Then, the pixel value at $(u, v)$ on the image represents the intensity of the light ray incident at that position on the film as captured by the camera. The unit direction vector $\vd$ of that light ray can be reconstructed in the world coordinates as

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

The above ray passes through the camera focal point (origin) as well the pixel coordinates $(u, v)$ in the world coordinate frame as shown by the figure above. Given this direction vector, the moment vector $\vn$ can can be computed as the cross product between the camera origin and the direction vector.

$$
\vn = \vo \x \vd
$$

The Plücker coordinates for the incident ray is a 6-tuple $(\vn, \vd)$. Based on this, the Plücker camera parameterization can be constructed as the set of Plücker coordinates of all the rays, *i.e.* $\R^{HW \x 6}$.

!!!
       <div id="canvas-container"></div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>

        <script>
            function sliceWithSteps(
                arr,
                start = 0,
                end = arr.length,
                step = 1,
            ) {
                const result = [];

                // Handle negative indices
                if (start < 0) start = Math.max(0, arr.length + start);
                if (end < 0) end = Math.max(0, arr.length + end);

                for (let i = start; step > 0 ? i < end : i > end; i += step) {
                    if (i >= 0 && i < arr.length) {
                        result.push(arr[i]);
                    }
                }

                return result;
            }
            // Function to convert to Plucker coordinates
            function toPlucker(K, R, t, gridpoints) {
                // Inverse of intrinsic matrix
                const K_inv = new THREE.Matrix3()
                    .copy(new THREE.Matrix3().fromArray(K))
                    .invert();

                // Camera center in world coordinates
                const C = new THREE.Vector3().fromArray(t);
                C.applyMatrix3(
                    new THREE.Matrix3()
                        .copy(new THREE.Matrix3().fromArray(R))
                        .invert(),
                );

                // Function to get ray direction for a pixel
                function pixelToRay(u, v) {
                    // Homogeneous pixel coordinates
                    const pixel = new THREE.Vector3(u, v, 1);

                    // Convert to camera coordinates
                    const ray = pixel.applyMatrix3(K_inv);

                    // Convert to world coordinates
                    ray.applyMatrix3(new THREE.Matrix3().fromArray(R));

                    // Subtract the camera center from the ray
                    ray.sub(C);

                    ray.normalize();

                    return ray;
                }

                // Create rays using the provided gridpoints
                const rays = [];

                for (const point of gridpoints) {
                    const u = point.x;
                    const v = point.y;

                    const direction = pixelToRay(u, v);
                    const moment = new THREE.Vector3().crossVectors(
                        C,
                        direction,
                    );

                    // Sanity check for orthogonality between moment and direction
                    // var dotProduct = moment.dot(direction);
                    // dotProduct = moment.dot(C);

                    rays.push({
                        worldOrigin: new THREE.Vector3(),
                        uvOrigin: point.clone(),
                        camOrigin: C.clone(),
                        direction: direction,
                        moment: moment,
                    });
                }

                return rays;
            }

            // Example usage with default parameters
            const focal = 0.9;
            const cameraOrigin = new THREE.Vector3(5, 5, 5);
            const W = 100;
            const H = 100;
            // Scale factors to make grid fit in visible space
            const scaleX = 10 / W;
            const scaleY = 10 / H;
            const K = [focal, 0, focal / 4, 0, focal, focal / 4, 0, 0, 1];
            const R = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            const t = [cameraOrigin.x, cameraOrigin.y, cameraOrigin.z];

            // Set up the scene, camera, and renderer
            const scene = new THREE.Scene();

            // Get the container dimensions
            const container = document.getElementById("canvas-container");
            const width = container.clientWidth;
            const height = container.clientHeight;

            const camera = new THREE.PerspectiveCamera(
                45,
                width / height,
                1,
                1000,
            );

            const renderer = new THREE.WebGLRenderer({ antialias: true });

            renderer.setSize(width, height);
            renderer.setClearColor(0xffffff);
            container.appendChild(renderer.domElement);

            // Add OrbitControls for mouse interaction
            const controls = new THREE.OrbitControls(
                camera,
                renderer.domElement,
            );
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.screenSpacePanning = false;
            controls.maxPolarAngle = Math.PI;
            controls.enableZoom = false;
            controls.enablePan = false;
            controls.autoRotate = false;

            // Add axes helper
            const axesHelper = new THREE.AxesHelper(5);
            scene.add(axesHelper);

            // Create a grid helper
            const gridHelper = new THREE.GridHelper(30, 30);
            scene.add(gridHelper);

            // Function to create a line with custom color
            function createLine(points, color) {
                const material = new THREE.LineBasicMaterial({ color: color });
                const geometry = new THREE.BufferGeometry().setFromPoints(
                    points,
                );
                return new THREE.Line(geometry, material);
            }
            // =====================================================
            // =====================================================
            // Create a grid of points
            const uvCoords = [];
            const skip = 8;
            for (let i = 0; i < W; i += skip) {
                for (let j = 0; j < H; j += skip) {
                    // Normalize coordinates to be centered and scaled
                    const x = i * scaleX;
                    const y = j * scaleY;
                    const z = 0; // Fixed z value of 1

                    uvCoords.push(new THREE.Vector3(x, y, z));
                }
            }

            // Create points material
            const pointsMaterial = new THREE.PointsMaterial({
                color: 0x00aaff,
                size: 0.5,
                sizeAttenuation: true,
            });

            // Create points geometry
            const pointsGeometry = new THREE.BufferGeometry().setFromPoints(
                sliceWithSteps(uvCoords.slice(), 0, uvCoords.length, 1),
            );

            // Create points object and add to scene
            const pointsObject = new THREE.Points(
                pointsGeometry,
                pointsMaterial,
            );
            // scene.add(pointsObject);
            // =====================================================
            const pluckerRays = toPlucker(K, R, t, uvCoords);
            //
            // Plot the Plucker rays
            const momentRayLength = 1; // Length of the moment ray
            const dirRayLength = 10; // Length of the direction ray
            const rayColor = 0xee7733; // Orange
            const momentColor = 0x44bb99; // Green color for moments

            // Plot the Plucker directions as arrows
            const arrowHelperLength = 5;
            const arrowHelperHeadLength = 0.5; // Size of the arrow head
            const arrowHelperHeadWidth = 0.3; // Width of the arrow head

            pluckerRays.forEach((ray) => {
                // Create an arrow to represent the direction
                const arrowHelper = new THREE.ArrowHelper(
                    ray.direction,
                    ray.camOrigin,
                    arrowHelperLength,
                    rayColor,
                    arrowHelperHeadLength,
                    arrowHelperHeadWidth,
                );
                scene.add(arrowHelper);
            });

            pluckerRays.forEach((ray) => {
                // Create an arrow to represent the direction
                const arrowHelper = new THREE.ArrowHelper(
                    ray.moment,
                    ray.camOrigin,
                    arrowHelperLength,
                    momentColor,
                    arrowHelperHeadLength,
                    arrowHelperHeadWidth,
                );
                scene.add(arrowHelper);
            });

            // Add a sphere at the camera origin point
            const camOriginSphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.2, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0xff0000 }),
            );
            camOriginSphere.position.set(
                cameraOrigin.x,
                cameraOrigin.y,
                cameraOrigin.z,
            );
            scene.add(camOriginSphere);

            // =====================================================
            // Add a sphere at the world origin point
            const originSphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.2, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0x000000 }),
            );
            originSphere.position.set(0, 0, 0);
            scene.add(originSphere);
            // =====================================================

            // Position camera
            camera.position.set(11, 17, -19);
            // camera.lookAt(0, 0, 0);

            // Handle window resize
            window.addEventListener("resize", () => {
                const newWidth = container.clientWidth;
                const newHeight = container.clientHeight;
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight);
            });

            // Add legend
            const legendItems = [
                { color: rayColor, label: "Direction Vector" },
                { color: momentColor, label: "Moment" },
                { color: 0xff0000, label: "Camera Origin" },
            ];

            // Create legend container
            const legendContainer = document.createElement("div");
            legendContainer.style.position = "absolute";
            legendContainer.style.bottom = "20px";
            legendContainer.style.left = "20px";
            legendContainer.style.border = "1px solid black";
            legendContainer.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
            legendContainer.style.padding = "10px";
            legendContainer.style.borderRadius = "5px";
            legendContainer.style.fontFamily = "Fira Mono, sans-serif";
            legendContainer.style.fontSize = "14px";
            legendContainer.style.zIndex = "100";
            legendContainer.style.pointerEvents = "none"; // Allow click-through

            // Add legend items
            legendItems.forEach((item) => {
                const legendItem = document.createElement("div");
                legendItem.style.display = "flex";
                legendItem.style.alignItems = "center";
                legendItem.style.marginBottom = "5px";

                const colorBox = document.createElement("div");
                colorBox.style.width = "20px";
                colorBox.style.height = "20px";
                colorBox.style.backgroundColor =
                    "#" + item.color.toString(16).padStart(6, "0");
                colorBox.style.marginRight = "10px";

                const label = document.createElement("span");
                label.textContent = item.label;

                legendItem.appendChild(colorBox);
                legendItem.appendChild(label);
                legendContainer.appendChild(legendItem);
            });

            // Append legend to container
            container.style.position = "relative";
            container.appendChild(legendContainer);

            // Animation loop
            function animate() {
                requestAnimationFrame(animate);
                controls.update(); // Required if controls.enableDamping = true
                renderer.render(scene, camera);
            }

            animate();
        </script>
!!!

Although the Plücker camera parameterization has too many parameters compared to the usual intrinsic-extrinsic matrices, there are quite a few advantages &mdash; 1) it is complete *i.e* can uniformly represent all incident light rays in the scene uniformly; 2) The invariance to scaling, and the invariance to the selection of point on the ray, means that these coordinates are indeed _homogeneous_; 3) It is smooth and differentiable.

The above characteristics make Plücker camera parameterization quite suitable for learning-based methods.


## Code

```python
import torch

def convert_to_plucker(K_inv: torch.Tensor,
                       M_inv: torch.Tensor,
                       H: int,
                       W: int) -> torch.Tensor:
    """
    Function to compute the  Plucker coordinates for the camera based on the
    rays incident on the image plane, using the camera's
    intrinsic and extrinsic parameters.

    Args:
        K_inv: (torch.Tensor) Inverse of the c3x3 amera intrinsic matrix.
        M_inv: (torch.Tensor) Inverse of the 4x4 camera extrinsic matrix
               (camera-to-world transform).
        H: (int) Height of the image in pixels.
        W: (int) Width of the image in pixels.

    Returns:
        Tuple containing:
            plucker_coords: torch.Tensor
                Plucker coordinates for each ray. Shape (H, W, 6).
            uv_world: torch.Tensor
                Image grid points in world coordinates. Shape (H, W, 3).
            d: torch.Tensor
                Normalized ray directions in camera space. Shape (H, W, 3).
            o_world: torch.Tensor
                Camera origin in world coordinates. Shape (3,).
    """

    Rot, trans = M_inv[:3, :3], M_inv[:3, 3:]
    # create image grid
    u, v = torch.meshgrid(
        torch.arange(W, dtype=torch.float32),
        torch.arange(H, dtype=torch.float32),
        indexing='xy',
    )

    uv = torch.dstack([u, v, torch.ones_like(u)]) # (H, W, 2)

    d =  Rot[None, None,] @ (K_inv[None, None, ...] @ uv.unsqueeze(-1)) \
         + trans[None, None]

    # Normalize the ray direction to get a unit direction vector
    d = d / torch.linalg.norm(d, dim=-2, keepdim=True)

    # Camera origin in world coordinates
    o_world = M_inv[...,:3, 3]
    # uv in world coordinates
    uv_world = uv @ Rot + o_world

    # convert d to world coordinates
    d_world = (M_inv[:3, :3] @ d + trans).squeeze(-1)

    # compute the moment
    n = torch.cross(o_world.expand_as(d_world), d_world, dim=-1)

    plucker_coords = torch.cat([n, d_world], dim=-1)

    return plucker_coords
```

----

[^ref]: The use of Plücker coordinates to model camera viewpoints via parameterizing the incident light rays was first popularized in the context of deep learning by Sitzmann, et. al. in their 2021 NeurIPS paper - *Light field networks: Neural scene representations with single-evaluation rendering* [ArXiv Link](https://arxiv.org/abs/2106.02634).

[^plu]: The standard reference to all things Plücker coordinates is Yan-Bin Jia's notes - *Plücker Coordinates for Lines in the Space* [Link](https://faculty.sites.iastate.edu/jia/files/inline-files/plucker-coordinates.pdf)
