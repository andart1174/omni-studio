import * as THREE from 'three';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

/**
 * Three Engine - Basic 3D Model Viewer
 */

export function init3DPreview(container: HTMLElement, modelFile?: File) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

    if (modelFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const contents = e.target?.result as string;
            const loader = new OBJLoader();
            const object = loader.parse(contents);
            scene.add(object);

            // Center and scale
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            if (maxDim > 0) object.scale.multiplyScalar(3 / maxDim);
        };
        reader.readAsText(modelFile);
    } else {
        // Default cube if no file
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({ color: 0x007aff });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
    }

    const animate = () => {
        requestAnimationFrame(animate);
        scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                obj.rotation.x += 0.01;
                obj.rotation.y += 0.01;
            }
        });
        renderer.render(scene, camera);
    };

    animate();

    return () => {
        renderer.dispose();
        container.removeChild(renderer.domElement);
    };
}
