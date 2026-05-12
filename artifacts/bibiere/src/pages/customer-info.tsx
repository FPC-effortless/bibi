import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type InfoPageContent = {
  title: string;
  eyebrow: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
};

const pages: Record<string, InfoPageContent> = {
  returns: {
    eyebrow: "Customer care",
    title: "Returns & Exchanges",
    intro: "A calm, clear returns process for luxury pieces that need a different fit or finish.",
    sections: [
      { title: "Return window", body: "Eligible unworn items may be returned within 14 days of delivery with original tags and packaging." },
      { title: "Exchange support", body: "Size and color exchanges are supported when inventory is available. Contact customer care with your order number to begin." },
      { title: "Final sale", body: "Personalized, altered, and final-sale items cannot be returned unless they arrive damaged or incorrect." },
    ],
  },
  trackOrder: {
    eyebrow: "Customer care",
    title: "Track Your Order",
    intro: "Sign in to view your latest orders, payment status, and fulfillment progress.",
    sections: [
      { title: "Account tracking", body: "Your account page lists current and past orders as soon as checkout is completed." },
      { title: "Dispatch updates", body: "Shipping updates are sent to the email used at checkout once an order moves into fulfillment." },
      { title: "Need help?", body: "If an order looks delayed or incomplete, contact customer care with your order reference." },
    ],
  },
  sizeGuide: {
    eyebrow: "Fit guide",
    title: "Size Guide",
    intro: "Use these notes as a starting point for selecting refined, comfortable silhouettes.",
    sections: [
      { title: "Dresses and tailoring", body: "Choose your usual size for a close fit, or size up if you prefer an easier drape through the waist and shoulders." },
      { title: "Outerwear", body: "Coats and blazers are cut to layer over light knitwear. Size up for heavier layering." },
      { title: "Accessories", body: "Accessory sizing and dimensions are listed on each product detail page when available." },
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
      { title: "Product information", body: "We aim to keep product descriptions, pricing, and availability accurate. Availability may change before checkout is completed." },
      { title: "Orders", body: "Orders are accepted after payment authorization and may be cancelled if fraud checks, inventory, or payment confirmation fail." },
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
      { title: "Operational care", body: "Inventory visibility and order accuracy help reduce waste from overselling and unnecessary returns." },
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

function InfoPage({ page }: { page: InfoPageContent }) {
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

export function ReturnsPage() { return <InfoPage page={pages.returns} />; }
export function TrackOrderPage() { return <InfoPage page={pages.trackOrder} />; }
export function SizeGuidePage() { return <InfoPage page={pages.sizeGuide} />; }
export function PrivacyPage() { return <InfoPage page={pages.privacy} />; }
export function TermsPage() { return <InfoPage page={pages.terms} />; }
export function HeritagePage() { return <InfoPage page={pages.heritage} />; }
export function SustainabilityPage() { return <InfoPage page={pages.sustainability} />; }
export function CareersPage() { return <InfoPage page={pages.careers} />; }
export function PressPage() { return <InfoPage page={pages.press} />; }
