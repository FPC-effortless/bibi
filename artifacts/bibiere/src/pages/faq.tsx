import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "convex/react";
import { api } from "../../../../lib/convex/convex/_generated/api";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Phone, Mail } from "lucide-react";
import { hasConvexConfig } from "@/lib/runtime-config";

const faqCategories = [
  {
    title: "Orders & Shipping",
    questions: [
      { question: "When does production start?", answer: "Production starts after payment is confirmed and your measurements or fit notes have been reviewed by the bibiere team." },
      { question: "How long will my order take?", answer: "Each piece is made to order. Timing depends on the style, quantity, and delivery location. If you have an event date, add it at checkout so the team can review it before production." },
      { question: "Can I track my order?", answer: "Yes. Your account shows the current order status, and customer care can help with production or delivery updates using your order reference." },
      { question: "Can I change or cancel my order?", answer: "Contact customer care as soon as possible. Changes are easiest before fabric is cut; once production begins, changes may be limited." },
    ],
  },
  {
    title: "Returns & Exchanges",
    questions: [
      { question: "Can made-to-order pieces be returned?", answer: "Because each garment is made for the client, personalized or altered pieces are not returnable unless they arrive damaged, incorrect, or not aligned with the confirmed order details." },
      { question: "What if there is a fit issue?", answer: "Contact customer care with your order reference and clear photos. The team will review whether an adjustment, alteration, or remake support is appropriate." },
      { question: "Can I exchange for a different size?", answer: "Standard size exchanges are limited for made-to-order garments. Share accurate measurements at checkout so the team can review fit before production." },
    ],
  },
  {
    title: "Sizing & Fit",
    questions: [
      { question: "How do I submit my measurements?", answer: "Add your key measurements at checkout, including bust, waist, hips, shoulder, sleeve, length, height, and preferred fit." },
      { question: "What if I'm between sizes?", answer: "Choose the closest standard size and add measurement notes. The team reviews the notes before production begins." },
      { question: "Can I request style adjustments?", answer: "Yes. Use the style notes field at checkout for modesty preferences, sleeve changes, length changes, or occasion details." },
    ],
  },
  {
    title: "Products & Care",
    questions: [
      { question: "How should I care for my bibiere pieces?", answer: "Each item comes with specific care instructions on the label. Generally, we recommend dry cleaning for silk and wool items, and gentle machine washing for cotton pieces." },
      { question: "Are your products sustainable?", answer: "Sustainability is core to our brand. We use ethically sourced materials, work with certified suppliers, and focus on creating timeless pieces that last." },
      { question: "Where are your products made?", answer: "bibiere pieces are made after order by the production team and tailoring partners selected by the brand." },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const backendPage = hasConvexConfig ? <BackendFaqContent searchQuery={searchQuery} onClear={() => setSearchQuery("")} /> : null;
  const hasBackend = Boolean(backendPage);
  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          !searchQuery ||
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions about our luxury fashion, shipping, returns, and more.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {hasBackend ? backendPage : (
          <FaqFallbackContent
            filteredCategories={filteredCategories}
            searchQuery={searchQuery}
            onClear={() => setSearchQuery("")}
          />
        )}

        <div className="max-w-3xl mx-auto mt-16 border border-border rounded-xl p-8 text-center space-y-6">
          <h2 className="text-2xl font-serif font-semibold">Still need help?</h2>
          <p className="text-muted-foreground">Our customer service team is here for you</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/contact">
                <MessageCircle className="w-4 h-4" />
                Contact Us
              </Link>
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              hello@bibiere.com
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function BackendFaqContent({ searchQuery, onClear }: { searchQuery: string; onClear: () => void }) {
  const backendPage = useQuery(api.contentPages.get, { slug: "faq" });

  const backendQuestions = backendPage?.sections.map((section) => ({
    question: section.title,
    answer: section.body,
  })) ?? [];
  const backendFilteredQuestions = backendQuestions.filter(
    (q) =>
      !searchQuery ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (backendPage === undefined) {
    return <div className="py-12 text-center text-muted-foreground">Loading FAQ...</div>;
  }

  if (!backendPage) {
    return (
      <FaqFallbackContent
        filteredCategories={faqCategories}
        searchQuery={searchQuery}
        onClear={onClear}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
            <Accordion type="single" collapsible className="space-y-2">
              {backendFilteredQuestions.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-medium hover:text-bibiere-burgundy">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {backendFilteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <Button variant="outline" className="mt-4" onClick={onClear}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
  );
}

function FaqFallbackContent({
  filteredCategories,
  searchQuery,
  onClear,
}: {
  filteredCategories: typeof faqCategories;
  searchQuery: string;
  onClear: () => void;
}) {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              <Button variant="outline" className="mt-4" onClick={onClear}>
                Clear Search
              </Button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.title} className="space-y-4">
                <h2 className="text-xl font-serif font-semibold text-bibiere-burgundy">{category.title}</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((faq, i) => (
                    <AccordionItem key={i} value={`${category.title}-${i}`} className="border border-border rounded-lg px-4">
                      <AccordionTrigger className="text-left font-medium hover:text-bibiere-burgundy">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))
          )}
        </div>
  );
}
