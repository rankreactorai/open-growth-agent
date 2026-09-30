import { ReactorApp } from "@/components/ReactorApp";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const hasEnvKey = Boolean(process.env.RANKREACTOR_API_KEY?.trim());
  return <ReactorApp hasEnvKey={hasEnvKey} />;
}
