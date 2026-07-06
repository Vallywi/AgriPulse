import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center">
        <div className="mb-6 rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-800">
          🌱 The Heartbeat of Smarter Farming
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          From Farm to Market,
          <br />
          <span className="text-primary">Fair Prices for Every Farmer</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-gray-600">
          Connect directly with Filipino farmers for fresh, affordable produce.
          No middlemen. Just fair trade and fresh harvests delivered to your
          doorstep.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/marketplace">
            <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6">
              Browse Fresh Produce
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base px-8 py-6"
            >
              Start Selling
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon="🥬"
            title="Fresh from the Farm"
            description="Produce harvested and delivered within 24-48 hours. Know exactly where your food comes from."
          />
          <FeatureCard
            icon="💰"
            title="Fair Prices"
            description="Farmers earn 30-40% more by selling directly. Buyers pay less without middleman markups."
          />
          <FeatureCard
            icon="✅"
            title="Verified Farmers"
            description="Every farmer is verified. Quality guaranteed with our review and rating system."
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
