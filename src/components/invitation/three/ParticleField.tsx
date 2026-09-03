"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type ParticleMode = "drift" | "rise" | "fall" | "stars";

function softSprite(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * One lightweight WebGL particle layer, reused by every bespoke template as a
 * fixed background. `mode` picks the motion: gold dust that drifts, pollen that
 * rises, petals/bokeh that fall, or a parallax star field with the odd shooting
 * star. Respects `prefers-reduced-motion` (renders a single static frame).
 */
export function ParticleField({
  mode = "drift",
  color = "#c9a24b",
  color2,
  count = 130,
  size = 0.035,
  speed = 1,
  opacity = 0.55,
  blend,
  className = "fixed inset-0",
}: {
  mode?: ParticleMode;
  color?: string;
  color2?: string;
  count?: number;
  size?: number;
  speed?: number;
  opacity?: number;
  blend?: "add" | "normal";
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const SPREAD_X = 22;
    const SPREAD_Y = 16;
    const DEPTH = mode === "stars" ? 26 : 8;
    const n = mode === "stars" ? Math.round(count * 1.6) : count;

    const positions = new Float32Array(n * 3);
    const phases = new Float32Array(n);
    const vels = new Float32Array(n);
    for (let i = 0; i < n; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD_X;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_Y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * DEPTH - (mode === "stars" ? 6 : 0);
      phases[i] = Math.random() * Math.PI * 2;
      vels[i] = 0.4 + Math.random() * 0.8;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    if (color2) {
      const c1 = new THREE.Color(color);
      const c2 = new THREE.Color(color2);
      const cols = new Float32Array(n * 3);
      for (let i = 0; i < n; i += 1) {
        const c = c1.clone().lerp(c2, Math.random());
        cols[i * 3] = c.r;
        cols[i * 3 + 1] = c.g;
        cols[i * 3 + 2] = c.b;
      }
      geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    }

    const sprite = softSprite();
    const mat = new THREE.PointsMaterial({
      map: sprite,
      color: color2 ? 0xffffff : new THREE.Color(color).getHex(),
      vertexColors: !!color2,
      size,
      sizeAttenuation: true,
      transparent: true,
      opacity,
      depthWrite: false,
      blending:
        (blend ?? (mode === "stars" || mode === "drift" ? "add" : "normal")) === "add"
          ? THREE.AdditiveBlending
          : THREE.NormalBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Shooting star (stars mode only)
    let shooter: THREE.Mesh | null = null;
    let shooterMat: THREE.MeshBasicMaterial | null = null;
    let shooterGeo: THREE.PlaneGeometry | null = null;
    let nextShot = 4 + Math.random() * 6;
    if (mode === "stars") {
      shooterGeo = new THREE.PlaneGeometry(3.2, 0.03);
      shooterMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color2 ?? color),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      shooter = new THREE.Mesh(shooterGeo, shooterMat);
      shooter.rotation.z = -0.5;
      scene.add(shooter);
    }

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let px = 0;
    let py = 0;
    const onPointer = (e: PointerEvent) => {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now * 0.001;

      if (mode === "stars") {
        points.rotation.z = t * 0.006;
        camera.position.x += (px * 2.2 - camera.position.x) * 0.03;
        camera.position.y += (-py * 1.6 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);
        if (shooter && shooterMat) {
          nextShot -= dt;
          if (nextShot <= 0 && shooterMat.opacity <= 0) {
            shooter.position.set(-12 + Math.random() * 4, 4 + Math.random() * 4, -4);
            shooterMat.opacity = 0.9;
            nextShot = 6 + Math.random() * 8;
          }
          if (shooterMat.opacity > 0) {
            shooter.position.x += 22 * dt;
            shooter.position.y -= 12 * dt;
            shooterMat.opacity = Math.max(0, shooterMat.opacity - dt * 0.55);
          }
        }
      } else {
        for (let i = 0; i < n; i += 1) {
          const iy = i * 3 + 1;
          const ix = i * 3;
          phases[i] += dt * 0.6;
          if (mode === "rise") {
            positions[iy] += vels[i] * speed * dt;
            positions[ix] += Math.sin(phases[i]) * 0.006;
            if (positions[iy] > SPREAD_Y / 2) positions[iy] = -SPREAD_Y / 2;
          } else if (mode === "fall") {
            positions[iy] -= vels[i] * speed * dt;
            positions[ix] += Math.sin(phases[i]) * 0.012;
            if (positions[iy] < -SPREAD_Y / 2) positions[iy] = SPREAD_Y / 2;
          } else {
            // drift
            positions[ix] += Math.sin(phases[i]) * 0.004 * speed;
            positions[iy] += Math.cos(phases[i] * 0.8) * 0.004 * speed;
          }
        }
        pos.needsUpdate = true;
        points.rotation.z += dt * 0.01 * speed;
        points.position.x += (px * 1.2 - points.position.x) * 0.02;
        points.position.y += (-py * 0.9 - points.position.y) * 0.02;
      }

      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      geo.dispose();
      mat.dispose();
      sprite.dispose();
      shooterGeo?.dispose();
      shooterMat?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [mode, color, color2, count, size, speed, opacity, blend]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
