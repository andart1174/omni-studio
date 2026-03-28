import * as THREE from 'three';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Three Engine - Interactive 3D Model Viewer
 */

export function init3DPreview(container: HTMLElement, modelFile?: File) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070707);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Advanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
    backLight.position.set(-10, 10, -10);
    scene.add(backLight);

    camera.position.set(0, 0, 5);

    if (modelFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const contents = e.target?.result as string;
                const loader = new OBJLoader();
                const object = loader.parse(contents);

                // Add a default nice material to all meshes in the OBJ
                object.traverse((child: any) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0xcccccc,
                            metalness: 0.2,
                            roughness: 0.5,
                        });
                    }
                });

                scene.add(object);

                // Center and scale to fit view
                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                object.position.sub(center); // Move object to center
                
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                if (maxDim > 0) {
                    const scale = 3 / maxDim;
                    object.scale.set(scale, scale, scale);
                }
            } catch (err) {
                console.error("[3DEngine] Error parsing OBJ:", err);
            }
        };
        reader.readAsText(modelFile);
    } else {
        // Default interactive object if no file
        const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x007aff,
            metalness: 0.3,
            roughness: 0.4,
        });
        const knot = new THREE.Mesh(geometry, material);
        scene.add(knot);
    }

    // Resize handler
    const resizeObserver = new ResizeObserver(() => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    let animationId: number;
    const animate = () => {
        animationId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };

    animate();

    return () => {
        cancelAnimationFrame(animationId);
        resizeObserver.disconnect();
        controls.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
    };
}
