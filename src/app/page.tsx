import { getCurrentUser } from "@/lib/auth";
import { HomePage } from "@/components/marketing/HomePage";

export default async function Home() {
  const user = await getCurrentUser();
  return <HomePage isLoggedIn={!!user} />;
}
