"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";

const FRAME = 260; // on-screen crop window (square)
const OUT = 420; // exported image size (square)

/**
 * Upload → square-crop (pan + zoom) → the result is stored inline as a data URL.
 * Works two ways:
 *  - uncontrolled: pass `name` and it renders a hidden input for a plain <form>
 *  - controlled: pass `value` + `onChange` (used inside the wizard)
 */
export function QrImageInput({
  name,
  value: controlledValue,
  onChange,
  defaultValue = "",
}: {
  name?: string;
  value?: string;
  onChange?: (v: string) => void;
  defaultValue?: string;
}) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlledValue ?? internal;
  const setValue = (v: string) => {
    if (onChange) onChange(v);
    else setInternal(v);
  };

  // crop editor state
  const [src, setSrc] = useState<string | null>(null);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const imgElRef = useRef<HTMLImageElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const base = natural.w && natural.h ? Math.max(FRAME / natural.w, FRAME / natural.h) : 1;
  const scale = base * zoom;

  const clampAt = (p: { x: number; y: number }, z: number) => {
    const w = natural.w * base * z;
    const h = natural.h * base * z;
    return {
      x: Math.min(0, Math.max(FRAME - w, p.x)),
      y: Math.min(0, Math.max(FRAME - h, p.y)),
    };
  };
  const clamp = (p: { x: number; y: number }) => clampAt(p, zoom);

  function pickFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      setZoom(1);
      setPos({ x: 0, y: 0 });
      setSrc(url);
    };
    img.src = url;
  }

  function applyCrop() {
    const img = imgElRef.current;
    if (!img) return;
    const sx = -pos.x / scale;
    const sy = -pos.y / scale;
    const sSize = FRAME / scale;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = OUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, OUT, OUT);
    ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, OUT, OUT);
    setValue(canvas.toDataURL("image/jpeg", 0.86));
    if (src) URL.revokeObjectURL(src);
    setSrc(null);
  }

  function cancelCrop() {
    if (src) URL.revokeObjectURL(src);
    setSrc(null);
  }

  const btn =
    "text-xs rounded-full border border-ink/20 px-4 py-1.5 hover:border-ink/50 transition-colors";

  return (
    <div>
      {name && <input type="hidden" name={name} value={value} />}

      {src ? (
        <div className="rounded-xl border border-ink/15 bg-white p-4">
          <div
            className="relative mx-auto touch-none overflow-hidden rounded-lg border border-ink/20 bg-ink/5"
            style={{ width: FRAME, height: FRAME }}
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              setPos(
                clamp({
                  x: drag.current.px + (e.clientX - drag.current.x),
                  y: drag.current.py + (e.clientY - drag.current.y),
                }),
              );
            }}
            onPointerUp={() => (drag.current = null)}
          >
            <img
              ref={imgElRef}
              src={src}
              alt=""
              draggable={false}
              className="absolute left-0 top-0 max-w-none select-none"
              style={{
                width: natural.w * scale,
                height: natural.h * scale,
                transform: `translate(${pos.x}px, ${pos.y}px)`,
              }}
            />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]" />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-ink/50">Zoom</span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => {
                const z = Number(e.target.value);
                setZoom(z);
                setPos((p) => clampAt(p, z));
              }}
              className="flex-1 accent-gold-dark"
            />
          </div>
          <p className="mt-1 text-xs text-ink/40">Drag to reposition · the square area is what gets saved</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={applyCrop} className="text-xs rounded-full bg-ink text-cream px-5 py-1.5 hover:bg-ink/80">
              Use this crop
            </button>
            <button type="button" onClick={cancelCrop} className={btn}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          {value ? (
            <img src={value} alt="QR preview" className="h-20 w-20 rounded-lg border border-ink/15 object-cover" />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-lg border border-dashed border-ink/25 text-[0.6rem] text-ink/40">
              No image
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) pickFile(f);
              e.target.value = "";
            }}
          />
          <button type="button" onClick={() => fileRef.current?.click()} className={btn}>
            {value ? "Replace image" : "Upload image"}
          </button>
          {value && (
            <button type="button" onClick={() => setValue("")} className={`${btn} text-red-500 hover:border-red-400`}>
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}
