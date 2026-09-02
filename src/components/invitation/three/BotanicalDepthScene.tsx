"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const LEAVES = [
  [-5.4, 3.2, -1.2, -0.7, 0.7], [-4.8, 2.5, 0.2, -1.05, 0.55],
  [-5.6, 1.7, -0.6, -0.55, 0.75], [-4.9, -2.7, -0.3, -2.1, 0.65],
  [-5.5, -3.4, -1.1, -2.35, 0.8], [5.4, 3.1, -0.8, 0.8, 0.7],
  [4.8, 2.4, 0.1, 1.05, 0.55], [5.6, 1.6, -0.7, 0.55, 0.75],
  [4.9, -2.7, -0.2, 2.1, 0.65], [5.5, -3.4, -1, 2.35, 0.8],
] as const;

export function BotanicalDepthScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 11;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const botanicals = new THREE.Group();
    scene.add(botanicals);
    const leafGeometry = new THREE.SphereGeometry(0.5, 16, 10);
    leafGeometry.scale(0.38, 1.05, 0.1);
    const green = new THREE.MeshBasicMaterial({ color: 0x426a55, transparent: true, opacity: 0.48 });
    const sage = new THREE.MeshBasicMaterial({ color: 0x81947a, transparent: true, opacity: 0.3 });
    const leaves: THREE.Mesh[] = [];
    LEAVES.forEach(([x, y, z, rotation, scale], index) => {
      const leaf = new THREE.Mesh(leafGeometry, index % 3 === 0 ? sage : green);
      leaf.position.set(x, y, z);
      leaf.rotation.set(0.25, index * 0.35, rotation);
      leaf.scale.setScalar(scale);
      botanicals.add(leaf);
      leaves.push(leaf);
    });

    const petalGeometry = new THREE.SphereGeometry(0.34, 14, 8);
    petalGeometry.scale(0.48, 1, 0.12);
    const rose = new THREE.MeshBasicMaterial({ color: 0xb96d67, transparent: true, opacity: 0.48 });
    const blush = new THREE.MeshBasicMaterial({ color: 0xd6a28b, transparent: true, opacity: 0.38 });
    [[-5.15, 2.2], [5.1, -2.45]].forEach(([cx, cy], flowerIndex) => {
      for (let p = 0; p < 6; p += 1) {
        const angle = (p / 6) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeometry, flowerIndex ? blush : rose);
        petal.position.set(cx + Math.cos(angle) * 0.32, cy + Math.sin(angle) * 0.32, 0.4);
        petal.rotation.z = angle - Math.PI / 2;
        botanicals.add(petal);
      }
    });

    const haloGeometry = new THREE.TorusGeometry(2.9, 0.008, 6, 120);
    const haloMaterial = new THREE.MeshBasicMaterial({ color: 0xc9a24b, transparent: true, opacity: 0.16 });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.position.z = -1.5;
    scene.add(halo);

    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 13;
      positions[i + 1] = (Math.random() - 0.5) * 9;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: 0xe3c887, size: 0.018, transparent: true, opacity: 0.4 });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    let pointerX = 0, pointerY = 0;
    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const render = (time = 0) => {
      botanicals.rotation.z = Math.sin(time * 0.00015) * 0.012;
      botanicals.rotation.y += (pointerX * 0.035 - botanicals.rotation.y) * 0.025;
      botanicals.rotation.x += (-pointerY * 0.025 - botanicals.rotation.x) * 0.025;
      leaves.forEach((leaf, index) => { leaf.rotation.y += 0.00035 + index * 0.000015; });
      particles.rotation.z = time * 0.000008;
      renderer.render(scene, camera);
      if (!reduced) frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      leafGeometry.dispose(); petalGeometry.dispose(); green.dispose(); sage.dispose(); rose.dispose(); blush.dispose();
      haloGeometry.dispose(); haloMaterial.dispose(); particleGeometry.dispose(); particleMaterial.dispose(); renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
