"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const PURCHASE_STATUSES = ["PENDING", "PAID", "REFUNDED"] as const;

/**
 * Buy one invitation credit for a template. One credit = the right to publish
 * ONE invitation on that template; building another (any couple) needs another
 * credit. No payment gateway yet, so the credit is granted immediately (PAID);
 * an admin can revise the status later. Redirects into the wizard.
 */
export async function claimTemplateAction(slug: string): Promise<void> {
  const user = await requireUser();
  const theme = await prisma.theme.findUnique({ where: { slug } });
  if (!theme || !theme.isListed) throw new Error("Template not found");

  await prisma.templatePurchase.create({
    data: {
      userId: user.id,
      themeId: theme.id,
      status: "PAID",
      amountCents: theme.priceCents,
      currency: theme.currency,
    },
  });

  revalidatePath("/dashboard/templates");
  redirect(`/dashboard/projects/new?template=${theme.slug}`);
}

/** Admin-only: adjust a purchase's status (e.g. mark PAID after a manual transfer). */
export async function setPurchaseStatusAction(
  purchaseId: string,
  status: string,
): Promise<void> {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  if (!PURCHASE_STATUSES.includes(status as (typeof PURCHASE_STATUSES)[number])) {
    throw new Error("Invalid status");
  }

  await prisma.templatePurchase.update({
    where: { id: purchaseId },
    data: { status },
  });
  revalidatePath("/dashboard/templates");
}
