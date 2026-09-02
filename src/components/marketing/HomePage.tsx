"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const features = [
  { title: "Cinematic Invitation", text: "A full-screen animated wedding website that opens like a film — not a flat template." },
  { title: "RSVP & Guest Flow", text: "Collect attendance and guest count. Watch responses arrive in real time." },
  { title: "Guestbook Wishes", text: "Let loved ones leave heartfelt messages that appear beautifully on your page." },
  { title: "QR Code Sharing", text: "Generate an elegant QR code for physical cards, WhatsApp, and on-the-day displays." },
  { title: "Photo Gallery", text: "A romantic editorial gallery for your engagement and pre-wedding photographs." },
  { title: "Live Analytics", text: "Visitors, RSVP conversion, devices, and QR scans — all in your couple dashboard." },
];

const plans = [
  {
    name: "Free",
    price: "RM0",
    highlight: false,
    items: ["1 basic template", "50 RSVP limit", "InviteYou watermark"],
  },
  {
    name: "Premium",
    price: "RM49",
    highlight: true,
    items: ["Premium templates", "No watermark", "300 RSVP limit", "QR code", "Guestbook"],
  },
  {
    name: "Luxury",
    price: "RM99",
    highlight: false,
    items: ["All templates", "Custom domain", "Unlimited RSVP", "Advanced analytics", "Priority support"],
  },
];

export function HomePage({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="bg-night text-cream min-h-screen">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-night/60 border-b border-gold/10">
        <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-wide text-cream">
            Invite<span className="text-gold">You</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/templates" className="hidden sm:block text-cream/70 hover:text-gold transition-colors">
              Templates
            </Link>
            <Link href="/invite/zahir-nisa" className="hidden sm:block text-cream/70 hover:text-gold transition-colors">
              Live Demo
            </Link>
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="rounded-full border border-gold/50 px-5 py-2 text-gold hover:bg-gold hover:text-night transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-cream/70 hover:text-gold transition-colors">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-full border border-gold/50 px-5 py-2 text-gold hover:bg-gold hover:text-night transition-all"
                >
                  Create Invitation
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"
          alt="Wedding couple at golden hour"
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/40 to-night" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-24 pb-16">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-gold uppercase tracking-[0.35em] text-xs mb-8"
          >
            Premium Animated Wedding Invitations
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-serif text-5xl sm:text-7xl leading-tight text-cream"
          >
            A wedding invitation that feels{" "}
            <span className="italic text-gold-light">unforgettable</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-8 text-lg text-cream/70 max-w-2xl mx-auto leading-relaxed"
          >
            A cinematic wedding website with RSVP, guestbook, gallery, QR code, and
            beautiful storytelling — crafted in minutes, remembered forever.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/templates"
              className="rounded-full bg-gold text-night px-10 py-4 font-medium tracking-wide hover:bg-gold-light transition-colors"
            >
              Browse Templates
            </Link>
            <Link
              href="/invite/zahir-nisa"
              className="rounded-full border border-cream/25 px-10 py-4 text-cream/80 hover:border-gold hover:text-gold transition-all"
            >
              View Live Demo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <p className="text-gold uppercase tracking-[0.3em] text-xs mb-4">Everything you need</p>
            <h2 className="font-serif text-4xl sm:text-5xl">Crafted for your big day</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i % 3}
                className="rounded-2xl border border-gold/15 bg-white/[0.03] backdrop-blur-sm p-8 hover:border-gold/40 transition-colors"
              >
                <h3 className="font-serif text-2xl text-gold-light mb-3">{f.title}</h3>
                <p className="text-cream/60 leading-relaxed text-sm">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-28 px-6 bg-gradient-to-b from-night to-night-soft">
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <p className="text-gold uppercase tracking-[0.3em] text-xs mb-4">Simple pricing</p>
            <h2 className="font-serif text-4xl sm:text-5xl">Choose your plan</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                className={`rounded-2xl p-8 border ${
                  plan.highlight
                    ? "border-gold bg-gold/10 relative"
                    : "border-cream/10 bg-white/[0.03]"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold text-night text-xs px-4 py-1 tracking-wide">
                    Most popular
                  </span>
                )}
                <h3 className="font-serif text-2xl">{plan.name}</h3>
                <p className="mt-4 text-4xl font-serif text-gold-light">
                  {plan.price}
                  <span className="text-sm text-cream/50 font-sans"> / wedding</span>
                </p>
                <ul className="mt-6 space-y-3 text-sm text-cream/70">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">✦</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <footer className="py-24 px-6 text-center border-t border-gold/10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-4xl sm:text-5xl mb-6">
            Begin your <span className="italic text-gold-light">forever</span>
          </h2>
          <Link
            href={isLoggedIn ? "/dashboard/projects/new" : "/register"}
            className="inline-block rounded-full bg-gold text-night px-10 py-4 font-medium tracking-wide hover:bg-gold-light transition-colors"
          >
            Create Your Invitation
          </Link>
          <p className="mt-12 text-cream/40 text-sm">
            © {new Date().getFullYear()} InviteYou. Crafted with love in Malaysia.
          </p>
        </motion.div>
      </footer>
    </div>
  );
}
