"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { InvitationGalleryImage } from "../types";
import { SectionHeading, easeLuxe } from "../shared";

export function GallerySection({ gallery }: { gallery: InvitationGalleryImage[] }) {
  if (gallery.length === 0) return null;

  return (
    <section className="py-28 px-6 bg-gradient-to-b from-night-soft to-night">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Captured moments" title="Our Gallery" />
        <div className="columns-2 sm:columns-3 gap-4 space-y-4">
          {gallery.map((image, i) => (
            <motion.figure
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: easeLuxe }}
              className="group relative break-inside-avoid overflow-hidden rounded-2xl"
            >
              <Image
                src={image.imageUrl}
                alt={image.caption ?? "Wedding gallery photo"}
                width={640}
                height={800}
                sizes="(max-width: 640px) 50vw, 33vw"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {image.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 text-cream/90 text-xs font-serif italic opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {image.caption}
                </figcaption>
              )}
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
