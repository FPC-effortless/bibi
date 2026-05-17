import { Link } from "wouter";
import { useQuery } from "convex/react";
import { api } from "../../../../lib/convex/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { hasConvexConfig } from "@/lib/runtime-config";

type InfoPageContent = {
  title: string;
  eyebrow: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
};

const fallbackPages: Record<string, InfoPageContent> = {
  returns: {
    eyebrow: "Customer care",
    title: "Returns & Exchanges",
    intro: "A clear support process for made-to-order pieces that need review, adjustment, or correction.",
    sections: [
      { title: "Made-to-order policy", body: "Personalized garments are not returnable unless they arrive damaged, incorrect, or materially different from the confirmed order details." },
      { title: "Fit support", body: "If there is a fit concern, contact customer care with your order reference, photos, and measurement notes for review." },
      { title: "Before production", body: "Changes are easiest before fabric is cut. Contact customer care quickly if you need to update measurements or styling notes." },
    ],
  },
  "track-order": {
    eyebrow: "Customer care",
    title: "Track Your Order",
    intro: "Sign in to view your latest orders, payment status, and fulfillment progress.",
    sections: [
      { title: "Account tracking", body: "Your account page lists current and past orders as soon as checkout is completed." },
      { title: "Production updates", body: "Order statuses show whether payment is pending, paid, processing, shipped, delivered, or cancelled." },
      { title: "Need help?", body: "If an order looks delayed or incomplete, contact customer care with your order reference." },
    ],
  },
  "size-guide": {
    eyebrow: "Fit guide",
    title: "Size Guide",
    intro: "Use these notes as a starting point, then add your measurements at checkout for made-to-order review.",
    sections: [
      { title: "Core measurements", body: "Include bust, waist, hips, shoulder, sleeve, preferred length, height, and usual size." },
      { title: "Fit preference", body: "Mention whether you prefer a close, relaxed, modest, or occasion-specific fit." },
      { title: "Event timing", body: "Add your needed-by date at checkout so the team can review timing before production." },
    ],
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    intro: "We collect only the information needed to operate the store, support orders, and improve the customer experience.",
    sections: [
      { title: "Account and order data", body: "We use account, cart, wishlist, and order information to provide shopping, checkout, and support services." },
      { title: "Payments", body: "Payment processing is handled through payment providers. Sensitive card details are not stored in the storefront database." },
      { title: "Choices", body: "You may contact customer care to request account support, marketing preferences, or data questions." },
    ],
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of Service",
    intro: "These terms describe the expectations for using the bibiere storefront and purchasing products.",
    sections: [
      { title: "Product information", body: "We aim to keep product descriptions, pricing, and order availability accurate. Availability may change before checkout is completed." },
      { title: "Orders", body: "Orders are accepted after payment confirmation and may be cancelled if fraud checks, production capacity, or order details cannot be resolved." },
      { title: "Site use", body: "Do not misuse the storefront, attempt unauthorized access, or interfere with customer and admin systems." },
    ],
  },
  heritage: {
    eyebrow: "Company",
    title: "Our Heritage",
    intro: "bibiere is shaped around timeless dressing, careful materials, and a restrained point of view.",
    sections: [
      { title: "Design language", body: "The collection favors enduring silhouettes, tactile fabrics, and details that feel considered rather than loud." },
      { title: "Customer promise", body: "Every product page, policy, and service touchpoint should feel clear, elegant, and trustworthy." },
    ],
  },
  sustainability: {
    eyebrow: "Company",
    title: "Sustainability",
    intro: "Our sustainability work focuses on responsible assortment decisions and longer product lifecycles.",
    sections: [
      { title: "Buy better", body: "We prioritize pieces that can be styled repeatedly across seasons rather than disposable trend cycles." },
      { title: "Operational care", body: "Made-to-order production helps reduce waste by creating pieces after a client places an order." },
    ],
  },
  careers: {
    eyebrow: "Company",
    title: "Careers",
    intro: "We are building a polished commerce experience for customers who value detail and service.",
    sections: [
      { title: "Current openings", body: "There are no open roles listed at the moment." },
      { title: "Future interest", body: "For future opportunities, contact the team with your background and area of interest." },
    ],
  },
  press: {
    eyebrow: "Company",
    title: "Press",
    intro: "For editorial, partnership, or media requests, reach out through customer care and include your deadline.",
    sections: [
      { title: "Brand assets", body: "Logo, product, and campaign assets are shared for approved editorial use." },
      { title: "Inquiries", body: "Please include publication, story angle, requested assets, and timing in your message." },
    ],
  },
};

function InfoPage({ slug }: { slug: string }) {
  if (hasConvexConfig) {
    return <BackendInfoPage slug={slug} />;
  }

  return <InfoPageContentView page={fallbackPages[slug]} />;
}

function BackendInfoPage({ slug }: { slug: string }) {
  const backendPage = useQuery(api.contentPages.get, { slug });
  const fallbackPage = fallbackPages[slug];
  const page = backendPage ?? fallbackPage;

  if (backendPage === undefined) {
    return (
      <main id="main-content" className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
          Loading page...
        </div>
      </main>
    );
  }

  return <InfoPageContentView page={page} />;
}

function InfoPageContentView({ page }: { page?: InfoPageContent | null }) {
  if (!page) {
    return (
      <main id="main-content" className="min-h-screen bg-background">
        <section className="container mx-auto px-4 py-16">
          <h1 className="font-serif text-4xl font-semibold">Page unavailable</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            This customer page has not been published yet.
          </p>
          <Button asChild className="mt-6"><Link href="/">Return home</Link></Button>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-bibiere-burgundy">{page.eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">{page.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{page.intro}</p>
        </div>
      </section>
      <section className="container mx-auto grid gap-6 px-4 py-14 md:grid-cols-3">
        {page.sections.map((section) => (
          <article key={section.title} className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-semibold">{section.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{section.body}</p>
          </article>
        ))}
      </section>
      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-serif text-2xl font-semibold">Still need help?</h2>
          <p className="mt-2 text-muted-foreground">Our customer care team can help with sizing, orders, policies, and product questions.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild><Link href="/contact">Contact us</Link></Button>
            <Button asChild variant="outline"><Link href="/faq">Read FAQ</Link></Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ReturnsPage() { return <InfoPage slug="returns" />; }
export function TrackOrderPage() { return <InfoPage slug="track-order" />; }
export function SizeGuidePage() { return <InfoPage slug="size-guide" />; }
export function PrivacyPage() { return <InfoPage slug="privacy" />; }
export function TermsPage() { return <InfoPage slug="terms" />; }
export function HeritagePage() { return <InfoPage slug="heritage" />; }
export function SustainabilityPage() { return <InfoPage slug="sustainability" />; }
export function CareersPage() { return <InfoPage slug="careers" />; }
export function PressPage() { return <InfoPage slug="press" />; }
