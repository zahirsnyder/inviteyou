import "server-only";
import { prisma } from "@/lib/prisma";
import type { Theme } from "@prisma/client";

/** Shape of the JSON stored in Theme.config (all fields optional). */
export type ThemeConfig = {
  fontHeading?: string;
  fontBody?: string;
  fontSignature?: string;
  primaryColor?: string;
  secondaryColor?: string;
  background?: string;
  animationStyle?: string;
};

export type TemplateView = Theme & { parsedConfig: ThemeConfig };

function parseConfig(config: string): ThemeConfig {
  try {
    const value = JSON.parse(config);
    return value && typeof value === "object" ? (value as ThemeConfig) : {};
  } catch {
    return {};
  }
}

function withConfig(theme: Theme): TemplateView {
  return { ...theme, parsedConfig: parseConfig(theme.config) };
}

/** Human-readable price, e.g. "Free" or "RM 59". */
export function formatPrice(priceCents: number, currency = "MYR"): string {
  if (priceCents <= 0) return "Free";
  const amount = priceCents / 100;
  const pretty = Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  return currency === "MYR" ? `RM ${pretty}` : `${currency} ${pretty}`;
}

/** All templates shown in the marketplace, cheapest first. */
export async function listTemplates(): Promise<TemplateView[]> {
  const themes = await prisma.theme.findMany({
    where: { isListed: true },
    orderBy: [{ priceCents: "asc" }, { name: "asc" }],
  });
  return themes.map(withConfig);
}

export async function getTemplate(slug: string): Promise<TemplateView | null> {
  const theme = await prisma.theme.findUnique({ where: { slug } });
  return theme ? withConfig(theme) : null;
}

/**
 * One purchase = one invitation. A purchase is "unused" while its `projectId`
 * is null. Building an invitation consumes one; building another needs another
 * purchase — this is what stops a single payment being reused for many weddings.
 */
export async function countUnusedCredits(userId: string, themeId: string): Promise<number> {
  return prisma.templatePurchase.count({
    where: { userId, themeId, status: "PAID", projectId: null },
  });
}

/** The oldest unused credit for this user + template, or null. */
export async function getUnusedCredit(userId: string, themeId: string) {
  return prisma.templatePurchase.findFirst({
    where: { userId, themeId, status: "PAID", projectId: null },
    orderBy: { createdAt: "asc" },
  });
}

/** Templates the user has at least one unused credit for, with the count. */
export async function listStartableTemplates(
  userId: string,
): Promise<Array<TemplateView & { credits: number }>> {
  const purchases = await prisma.templatePurchase.findMany({
    where: { userId, status: "PAID", projectId: null },
    include: { theme: true },
  });

  const counts = new Map<string, { theme: Theme; credits: number }>();
  for (const p of purchases) {
    const entry = counts.get(p.themeId);
    if (entry) entry.credits += 1;
    else counts.set(p.themeId, { theme: p.theme, credits: 1 });
  }

  return [...counts.values()]
    .filter((e) => e.theme.isListed)
    .sort((a, b) => a.theme.priceCents - b.theme.priceCents || a.theme.name.localeCompare(b.theme.name))
    .map((e) => ({ ...withConfig(e.theme), credits: e.credits }));
}
