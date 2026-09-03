"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uBot;
  uniform vec3 uGlow;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.0, 289.0))) * 43758.5453); }

  void main() {
    vec2 uv = vUv;
    // gently drifting vertical position
    float y = uv.y + 0.06 * sin(uTime * 0.15 + uv.x * 2.0);
    vec3 col = mix(uBot, uMid, smoothstep(0.0, 0.55, y));
    col = mix(col, uTop, smoothstep(0.45, 1.0, y));

    // warm sun glow that slowly rises
    vec2 sun = vec2(0.5 + 0.12 * sin(uTime * 0.05), 0.16 + 0.05 * sin(uTime * 0.08));
    float d = distance(uv * vec2(uRes.x / uRes.y, 1.0), sun * vec2(uRes.x / uRes.y, 1.0));
    col += uGlow * smoothstep(0.5, 0.0, d) * 0.5;

    // film grain
    float g = hash(gl_FragCoord.xy + uTime) - 0.5;
    col += g * 0.03;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function rgb(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

/** Animated sunset gradient + sun glow + grain. Backdrop for Sunset Terracotta. */
export function SunsetHaze({
  top = "#241611",
  mid = "#7a3d24",
  bot = "#cc7a4e",
  glow = "#e6a97f",
  className = "fixed inset-0",
}: {
  top?: string;
  mid?: string;
  bot?: string;
  glow?: string;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uTop: { value: rgb(top) },
      uMid: { value: rgb(mid) },
      uBot: { value: rgb(bot) },
      uGlow: { value: rgb(glow) },
    };
    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
    const quad = new THREE.Mesh(geo, mat);
    scene.add(quad);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight, false);
      uniforms.uRes.value.set(clientWidth, Math.max(clientHeight, 1));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      uniforms.uTime.value = (now - start) * 0.001;
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    frame(start);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [top, mid, bot, glow]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
