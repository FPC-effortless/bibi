import { useState } from "react";
import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Phone, Mail } from "lucide-react";

const faqCategories = [
  {
    title: "Orders & Shipping",
    questions: [
      { question: "How long does shipping take?", answer: "Standard shipping takes 3-5 business days within the US. Express shipping (1-2 business days) and international shipping options are also available. Free shipping is offered on orders over $500." },
      { question: "Can I track my order?", answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the Order History section." },
      { question: "Do you ship internationally?", answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. Customs duties and taxes may apply." },
      { question: "Can I change or cancel my order?", answer: "Orders can be modified or cancelled within 1 hour of placement. After this window, orders enter processing and cannot be changed. Please contact customer service immediately if you need assistance." },
    ],
  },
  {
    title: "Returns & Exchanges",
    questions: [
      { question: "What is your return policy?", answer: "We offer a 30-day return policy for unworn items in original condition with tags attached. Items must be returned in original packaging. Some exclusions apply to final sale items." },
      { question: "How do I return an item?", answer: "Log into your account, go to Order History, and select 'Return Items'. Print the prepaid return label and drop off at any UPS location. Returns are processed within 5-7 business days." },
      { question: "Can I exchange for a different size?", answer: "Yes! We offer free exchanges for different sizes within 30 days. Use our online exchange portal or contact customer service for assistance." },
    ],
  },
  {
    title: "Sizing & Fit",
    questions: [
      { question: "How do I find my size?", answer: "Use our detailed size guide available on each product page. We provide measurements in both US and international sizes. For personalized fit advice, contact our styling team." },
      { question: "What if I'm between sizes?", answer: "We generally recommend sizing up if you're between sizes, especially for tailored pieces. Each product page includes fit notes and model measurements for reference." },
      { question: "Do your clothes run true to size?", answer: "Our pieces are designed to fit true to size based on our size chart. However, fit can vary by style and personal preference. Check individual product reviews for fit feedback." },
    ],
  },
  {
    title: "Products & Care",
    questions: [
      { question: "How should I care for my bibiere pieces?", answer: "Each item comes with specific care instructions on the label. Generally, we recommend dry cleaning for silk and wool items, and gentle machine washing for cotton pieces." },
      { question: "Are your products sustainable?", answer: "Sustainability is core to our brand. We use ethically sourced materials, work with certified suppliers, and focus on creating timeless pieces that last." },
      { question: "Where are your products made?", answer: "Our pieces are crafted by skilled artisans in Italy, Portugal, and select facilities known for their expertise in luxury fashion manufacturing." },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

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

        <div className="max-w-3xl mx-auto space-y-10">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
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
