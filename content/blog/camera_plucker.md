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

!!!
       <div id="canvas-container"></div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.min.js"></script>
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

                console.log("Camera center in world coordinates:", C);

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
                    var dotProduct = moment.dot(direction);
                    if (Math.abs(dotProduct) > 1e-10) {
                        console.warn(
                            `Moment and direction vectors are not orthogonal. Dot product: ${dotProduct}`,
                        );
                    }

                    dotProduct = moment.dot(C);
                    if (Math.abs(dotProduct) > 1e-10) {
                        console.warn(
                            `Moment and camera origin vectors are not orthogonal. Dot product: ${dotProduct}`,
                        );
                    }

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
            console.log(camOriginSphere.position);
            scene.add(camOriginSphere);

            // =====================================================
            // Add a sphere at the world origin point
            const originSphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.2, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0x000000 }),
            );
            originSphere.position.set(0, 0, 0);
            console.log(originSphere.position);
            scene.add(originSphere);
            // =====================================================

            // Position camera
            camera.position.set(17, 17, -7);
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

TODO: Talk about the effectiveness of Plücker coordinates

The advantage of the above Plücker parameterization is that it can uniformly represent all oriented light rays in space without singular direction or special cases.

Why is the Plücker coordinates for camera inverse of the usual way ?
Advantage over homogeneous camera parameterization. Continuous? Differentiable?



```python
import torch

def convert_to_plucker(K_inv: torch.Tensor, M_inv: torch.Tensor, H: int, W: int) -> torch.Tensor:
    """
    Function to compute the  Plucker coordinates for the camera based on the
    rays incident on the image plane, using the camera's intrinsic and extrinsic parameters.

    Args:
        K_inv: torch.Tensor
            Inverse of the camera intrinsic matrix. Shape (3, 3).
        M_inv: torch.Tensor
            Inverse of the camera extrinsic matrix (camera-to-world transform). Shape (4, 4).
        H: int
            Height of the image in pixels.
        W: int
            Width of the image in pixels.

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

    d =  Rot[None, None,] @ (K_inv[None, None, ...] @ uv.unsqueeze(-1)) + trans[None, None]

    # Normalize the ray direction to get a unit direction vector
    d = d / torch.linalg.norm(d, dim=-2, keepdim=True)
    d_ = d.clone()

    # Camera origin in world coordinates
    o_world = M_inv[...,:3, 3]  # This is also the translation vector. So what happens when you do cross product?

    # uv in world coordinates
    uv_world = uv @ Rot + o_world

    # convert d to world coordinates
    d_world = (M_inv[:3, :3] @ d + trans).squeeze(-1)

    # compute the moment
    n = torch.cross(o_world.expand_as(d_world), d_world, dim=-1)

    # Sanity check if the moment is perpendicular to the direction
    assert (torch.sum(n * d_world, dim=-1) < 1e-6).all(), f"The moment is not perpendicular to the direction {torch.sum(n * o_world.expand_as(d_world), dim=-1).max()}"
    assert (torch.sum(n * o_world.expand_as(d_world), dim=-1) < 1e-4).all(), f"The moment is not perpendicular to the Origin point {torch.sum(n * o_world.expand_as(d_world), dim=-1).max()}"

    plucker_coords = torch.cat([n, d_world], dim=-1)

    return plucker_coords
```

----

[^ref]: The use of Plücker coordinates to model camera viewpoints via parameterizing the incident light rays was first popularized in the context of deep learning by Sitzmann, et. al. in their 2021 NeurIPS paper - *Light field networks: Neural scene representations with single-evaluation rendering* [ArXiv Link](https://arxiv.org/abs/2106.02634).

[^plu]: The standard reference to all things Plücker coordinates is Yan-Bin Jia's notes - *Plücker Coordinates for Lines in the Space* [Link](https://faculty.sites.iastate.edu/jia/files/inline-files/plucker-coordinates.pdf)


[^rant]: Refer to Christer Ericson's great article against the use of Plücker coordinates - [Plücker coordinates considered harmful!](https://realtimecollisiondetection.net/blog/?p=13)
