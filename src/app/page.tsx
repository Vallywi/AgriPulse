"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Coins, ShieldCheck, ArrowRight, Sparkles, TrendingUp, Users, MapPin, Star, ChevronDown } from "lucide-react";
import { Logo } from "@/components/logo";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50/50 to-white" />
        {/* Floating gradient blobs */}
        <div className="animate-pulse-slow absolute top-20 -left-20 h-72 w-72 rounded-full bg-green-200/30 blur-3xl" />
        <div className="animate-pulse-slow absolute top-40 right-0 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" style={{ animationDelay: "1s" }} />
        <div className="animate-pulse-slow absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-yellow-100/30 blur-3xl" style={{ animationDelay: "2s" }} />
      </div>

      {/* Sparkle particles — satellite star field style */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Large twinkling stars */}
        <div className="animate-sparkle absolute top-[5%] left-[8%] h-2.5 w-2.5 rounded-full bg-yellow-300/70" style={{ animationDelay: "0ms" }} />
        <div className="animate-sparkle absolute top-[12%] right-[12%] h-3 w-3 rounded-full bg-green-200/60" style={{ animationDelay: "400ms" }} />
        <div className="animate-sparkle absolute top-[22%] left-[65%] h-2 w-2 rounded-full bg-emerald-300/70" style={{ animationDelay: "800ms" }} />
        <div className="animate-sparkle absolute top-[8%] left-[45%] h-1.5 w-1.5 rounded-full bg-yellow-200/80" style={{ animationDelay: "1200ms" }} />
        {/* Medium stars */}
        <div className="animate-sparkle absolute top-[30%] left-[20%] h-1.5 w-1.5 rounded-full bg-green-300/60" style={{ animationDelay: "200ms" }} />
        <div className="animate-sparkle absolute top-[35%] right-[25%] h-2 w-2 rounded-full bg-yellow-300/50" style={{ animationDelay: "600ms" }} />
        <div className="animate-sparkle absolute top-[40%] left-[80%] h-1 w-1 rounded-full bg-emerald-200/70" style={{ animationDelay: "1000ms" }} />
        <div className="animate-sparkle absolute top-[28%] right-[45%] h-2.5 w-2.5 rounded-full bg-green-200/50" style={{ animationDelay: "300ms" }} />
        {/* Small twinkling dots */}
        <div className="animate-sparkle absolute top-[50%] left-[12%] h-1 w-1 rounded-full bg-yellow-400/60" style={{ animationDelay: "100ms" }} />
        <div className="animate-sparkle absolute top-[55%] right-[8%] h-1.5 w-1.5 rounded-full bg-green-400/50" style={{ animationDelay: "500ms" }} />
        <div className="animate-sparkle absolute top-[60%] left-[55%] h-1 w-1 rounded-full bg-emerald-300/60" style={{ animationDelay: "900ms" }} />
        <div className="animate-sparkle absolute top-[48%] left-[35%] h-2 w-2 rounded-full bg-yellow-200/70" style={{ animationDelay: "700ms" }} />
        {/* Deep field stars */}
        <div className="animate-sparkle absolute top-[70%] left-[25%] h-1.5 w-1.5 rounded-full bg-green-200/40" style={{ animationDelay: "150ms" }} />
        <div className="animate-sparkle absolute top-[75%] right-[30%] h-1 w-1 rounded-full bg-yellow-300/50" style={{ animationDelay: "550ms" }} />
        <div className="animate-sparkle absolute top-[80%] left-[70%] h-2 w-2 rounded-full bg-emerald-200/60" style={{ animationDelay: "950ms" }} />
        <div className="animate-sparkle absolute top-[85%] left-[10%] h-1.5 w-1.5 rounded-full bg-green-300/40" style={{ animationDelay: "350ms" }} />
        <div className="animate-sparkle absolute top-[90%] right-[15%] h-1 w-1 rounded-full bg-yellow-200/50" style={{ animationDelay: "750ms" }} />
        <div className="animate-sparkle absolute top-[65%] right-[50%] h-2.5 w-2.5 rounded-full bg-green-100/50" style={{ animationDelay: "1100ms" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 container flex items-center justify-between px-4 py-4">
        <Logo showText={true} iconSize="h-10 w-10" imageWidth={44} imageHeight={44} />
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container flex flex-col items-center justify-center px-4 pt-16 pb-20 text-center">
        <div className="animate-fade-in-up animate-bounce-slow mb-6 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-green-200 px-5 py-2.5 text-sm font-medium text-green-700 shadow-lg">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          The Heartbeat of Smarter Farming
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </div>
        <h1
          className="animate-fade-in-up mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: "100ms", opacity: 0 }}
        >
          From Farm to Market,
          <br />
          <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Fair Prices for Every Farmer
          </span>
        </h1>
        <p
          className="animate-fade-in-up mb-10 max-w-2xl text-lg text-gray-600 leading-relaxed"
          style={{ animationDelay: "200ms", opacity: 0 }}
        >
          Connect directly with Filipino farmers for fresh, affordable produce.
          No middlemen. Just fair trade and fresh harvests delivered to your
          doorstep.
        </p>
        <div
          className="animate-fade-in-up flex flex-col gap-4 sm:flex-row"
          style={{ animationDelay: "300ms", opacity: 0 }}
        >
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 gap-2 shadow-lg shadow-green-200">
              Browse Fresh Produce
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/register?role=farmer">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base px-8 py-6 gap-2 border-green-300 hover:bg-green-50 shadow-sm"
            >
              Start Selling
              <Leaf className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 container px-4 py-16">
        <h2 className="animate-fade-in-up mb-12 text-center text-2xl font-bold text-gray-900 sm:text-3xl" style={{ animationDelay: "350ms", opacity: 0 }}>
          How AgriPulse Works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <StepCard
            step={1}
            icon={Users}
            title="Farmers List Products"
            description="Verified farmers list their fresh harvest directly — vegetables, fruits, rice, seafood, and more."
            delay={400}
          />
          <StepCard
            step={2}
            icon={MapPin}
            title="Buyers Browse & Order"
            description="Shop from hundreds of local farms. Filter by category, location, and freshness. Add to cart and checkout."
            delay={500}
          />
          <StepCard
            step={3}
            icon={TrendingUp}
            title="Fresh Delivery"
            description="Produce delivered within 24-48 hours. Track your order in real-time from farm to your doorstep."
            delay={600}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={Leaf}
            title="Fresh from the Farm"
            description="Produce harvested and delivered within 24-48 hours. Know exactly where your food comes from."
            delay={700}
          />
          <FeatureCard
            icon={Coins}
            title="Fair Prices"
            description="Farmers earn 30-40% more by selling directly. Buyers pay less without middleman markups."
            delay={800}
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Verified Farmers"
            description="Every farmer is verified. Quality guaranteed with our review and rating system."
            delay={900}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container px-4 py-12">
        <div
          className="animate-fade-in-up rounded-3xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 p-10 text-white shadow-2xl shadow-green-200/50"
          style={{ animationDelay: "1000ms", opacity: 0 }}
        >
          <h2 className="mb-8 text-center text-2xl font-bold">Trusted by Thousands</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <StatItem value="500+" label="Verified Farmers" icon={Users} />
            <StatItem value="2,000+" label="Fresh Products" icon={Leaf} />
            <StatItem value="10,000+" label="Orders Delivered" icon={Star} />
            <StatItem value="50+" label="Provinces Served" icon={MapPin} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container px-4 py-20 text-center">
        <div className="animate-fade-in-up" style={{ animationDelay: "1100ms", opacity: 0 }}>
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Ready to Get Started?</h2>
          <p className="mb-8 text-gray-600">Join AgriPulse today and support Filipino farmers.</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="px-10 py-6 text-base shadow-lg shadow-green-200">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-10 py-6 text-base">
                Explore Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 container px-4 py-16">
        <h2 className="animate-fade-in-up mb-8 text-center text-2xl font-bold text-gray-900 sm:text-3xl" style={{ animationDelay: "1200ms", opacity: 0 }}>
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-2xl space-y-3">
          <FAQItem
            question="What is AgriPulse?"
            answer="AgriPulse is a farm-to-market platform that connects Filipino farmers directly with buyers. We eliminate middlemen so farmers earn more and buyers get fresher produce at better prices."
            delay={1300}
          />
          <FAQItem
            question="How do I buy fresh produce?"
            answer="Simply create an account, browse the marketplace, add products to your cart, and checkout. You can pay via GCash, Maya, bank transfer, or cash on delivery."
            delay={1400}
          />
          <FAQItem
            question="How do I start selling as a farmer?"
            answer="Register as a Farmer, complete your farm profile (farm name, location, crops), and start listing your products with photos, prices, and descriptions. Your products will appear in the marketplace immediately."
            delay={1500}
          />
          <FAQItem
            question="What areas do you deliver to?"
            answer="We currently serve 50+ provinces across the Philippines. Delivery times depend on your location, but most orders arrive within 24-48 hours from the farm."
            delay={1600}
          />
          <FAQItem
            question="How are farmers verified?"
            answer="All farmers go through a verification process where we check their farm details, location, and produce quality. Verified farmers display a green shield badge on their profiles."
            delay={1700}
          />
          <FAQItem
            question="What payment methods are accepted?"
            answer="We accept GCash, Maya (PayMaya), bank transfer, and cash on delivery (COD). All digital payments are processed securely through our payment partners."
            delay={1800}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t bg-white/80 backdrop-blur-sm">
        <div className="container px-4 py-8 text-center">
          <Logo showText={true} className="justify-center mb-4" />
          <p className="text-sm text-gray-500">© 2024 AgriPulse. Empowering Filipino Farmers.</p>
        </div>
      </footer>
    </main>
  );
}

function StepCard({
  step,
  icon: Icon,
  title,
  description,
  delay,
}: {
  step: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <div
      className="animate-fade-in-up relative rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-sm text-center"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 shadow-sm">
        <Icon className="h-7 w-7 text-green-600" />
      </div>
      <div className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white shadow-md">
        {step}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <div
      className="animate-fade-in-up group rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.03] hover:-translate-y-2"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-all duration-300 group-hover:bg-green-100 group-hover:scale-110">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StatItem({ value, label, icon: Icon }: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="text-center">
      <Icon className="mx-auto mb-2 h-6 w-6 text-white/80" />
      <p className="text-2xl font-bold md:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-white/80">{label}</p>
    </div>
  );
}

function FAQItem({ question, answer, delay }: { question: string; answer: string; delay: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="animate-fade-in-up rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden transition-all"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <span className="text-sm font-medium text-gray-900">{question}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? "max-h-40 pb-4" : "max-h-0"}`}
      >
        <p className="px-5 text-sm text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}
