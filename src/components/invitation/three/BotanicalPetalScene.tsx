"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface BotanicalPetalSceneProps {
  flowerCount?: number;
  petalCount?: number;
  goldDustCount?: number;
}

export function BotanicalPetalScene({
  flowerCount = 14,
  petalCount = 20,
  goldDustCount = 65,
}: BotanicalPetalSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Texture loader for authentic botanical flowers matching the invitation
    const textureLoader = new THREE.TextureLoader();
    const pinkFlowerTex = textureLoader.load("/templates/botanical-heirloom/flower-pink.png");
    const yellowFlowerTex = textureLoader.load("/templates/botanical-heirloom/flower-yellow.png");
    const pinkPetalTex = textureLoader.load("/templates/botanical-heirloom/petal-pink.png");
    const leafTex = textureLoader.load("/templates/botanical-heirloom/leaf-green.png");

    // Materials with transparency
    const pinkFlowerMat = new THREE.MeshBasicMaterial({
      map: pinkFlowerTex,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const yellowFlowerMat = new THREE.MeshBasicMaterial({
      map: yellowFlowerTex,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const pinkPetalMat = new THREE.MeshBasicMaterial({
      map: pinkPetalTex,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const leafMat = new THREE.MeshBasicMaterial({
      map: leafTex,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Geometries
    const flowerGeom = new THREE.PlaneGeometry(1.3, 1.3);
    const petalGeom = new THREE.PlaneGeometry(0.7, 0.6);
    const leafGeom = new THREE.PlaneGeometry(0.85, 0.85);

    const itemsGroup = new THREE.Group();
    scene.add(itemsGroup);

    type FloatingItem = {
      mesh: THREE.Mesh;
      speedY: number;
      speedX: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      swingAngle: number;
      swingSpeed: number;
      swingRadius: number;
    };

    const items: FloatingItem[] = [];

    // 1. Whole Blossoms (Pink Geranium & Yellow Buttercup)
    for (let i = 0; i < flowerCount; i++) {
      const isPink = i % 2 === 0;
      const mat = isPink ? pinkFlowerMat : yellowFlowerMat;
      const mesh = new THREE.Mesh(flowerGeom, mat);

      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 5;
      mesh.position.set(x, y, z);

      const scale = isPink ? 0.45 + Math.random() * 0.45 : 0.4 + Math.random() * 0.35;
      mesh.scale.setScalar(scale);

      mesh.rotation.set(
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8,
        Math.random() * Math.PI * 2
      );

      itemsGroup.add(mesh);

      items.push({
        mesh,
        speedY: 0.005 + Math.random() * 0.009,
        speedX: (Math.random() - 0.5) * 0.003,
        rotSpeedX: 0.003 + Math.random() * 0.006,
        rotSpeedY: 0.003 + Math.random() * 0.006,
        rotSpeedZ: (Math.random() - 0.5) * 0.008,
        swingAngle: Math.random() * Math.PI * 2,
        swingSpeed: 0.008 + Math.random() * 0.012,
        swingRadius: 0.005 + Math.random() * 0.01,
      });
    }

    // 2. Individual Drifting Petals & Leaves
    for (let i = 0; i < petalCount; i++) {
      const isLeaf = i % 4 === 0;
      const geom = isLeaf ? leafGeom : petalGeom;
      const mat = isLeaf ? leafMat : pinkPetalMat;
      const mesh = new THREE.Mesh(geom, mat);

      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 5;
      mesh.position.set(x, y, z);

      const scale = 0.4 + Math.random() * 0.5;
      mesh.scale.setScalar(scale);

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      itemsGroup.add(mesh);

      items.push({
        mesh,
        speedY: 0.008 + Math.random() * 0.012,
        speedX: (Math.random() - 0.5) * 0.004,
        rotSpeedX: 0.006 + Math.random() * 0.01,
        rotSpeedY: 0.006 + Math.random() * 0.012,
        rotSpeedZ: 0.004 + Math.random() * 0.008,
        swingAngle: Math.random() * Math.PI * 2,
        swingSpeed: 0.012 + Math.random() * 0.016,
        swingRadius: 0.008 + Math.random() * 0.014,
      });
    }

    // 3. Shimmering Golden Dust / Pollen
    const dustPositions = new Float32Array(goldDustCount * 3);
    for (let i = 0; i < dustPositions.length; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 18;
      dustPositions[i + 1] = (Math.random() - 0.5) * 14;
      dustPositions[i + 2] = (Math.random() - 0.5) * 6;
    }

    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xb88630,
      size: 0.05,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeom, dustMat);
    scene.add(dustPoints);

    // Resize handling
    const handleResize = () => {
      if (!mount) return;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // Cursor Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrameId: number;

    const animate = () => {
      // Smooth parallax on camera
      currentMouseX += (targetMouseX - currentMouseX) * 0.035;
      currentMouseY += (targetMouseY - currentMouseY) * 0.035;

      camera.position.x = currentMouseX * 0.7;
      camera.position.y = -currentMouseY * 0.7;
      camera.lookAt(0, 0, 0);

      // Animate authentic flowers & petals falling and tumbling
      for (const item of items) {
        item.swingAngle += item.swingSpeed;
        item.mesh.position.y -= item.speedY;
        item.mesh.position.x += Math.sin(item.swingAngle) * item.swingRadius + item.speedX;

        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.rotation.z += item.rotSpeedZ;

        // Loop back to top
        if (item.mesh.position.y < -8) {
          item.mesh.position.y = 8;
          item.mesh.position.x = (Math.random() - 0.5) * 16;
        }
      }

      // Golden pollen sparkle rotation
      dustPoints.rotation.y += 0.0003;
      dustPoints.rotation.x = Math.sin(Date.now() * 0.0004) * 0.04;

      renderer.render(scene, camera);

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);

      flowerGeom.dispose();
      petalGeom.dispose();
      leafGeom.dispose();
      pinkFlowerMat.dispose();
      yellowFlowerMat.dispose();
      pinkPetalMat.dispose();
      leafMat.dispose();
      pinkFlowerTex.dispose();
      yellowFlowerTex.dispose();
      pinkPetalTex.dispose();
      leafTex.dispose();
      dustGeom.dispose();
      dustMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [flowerCount, petalCount, goldDustCount]);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    />
  );
}
