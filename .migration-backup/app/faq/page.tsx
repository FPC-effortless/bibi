import { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle, Phone, Mail } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | bibiere",
  description: "Find answers to common questions about bibiere luxury fashion, shipping, returns, sizing, and more.",
}

const faqCategories = [
  {
    title: "Orders & Shipping",
    questions: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 3-5 business days within the US. Express shipping (1-2 business days) and international shipping options are also available. Free shipping is offered on orders over $500."
      },
      {
        question: "Can I track my order?",
        answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the Order History section."
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. Customs duties and taxes may apply and are the responsibility of the customer."
      },
      {
        question: "Can I change or cancel my order?",
        answer: "Orders can be modified or cancelled within 1 hour of placement. After this window, orders enter processing and cannot be changed. Please contact customer service immediately if you need assistance."
      }
    ]
  },
  {
    title: "Returns & Exchanges",
    questions: [
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for unworn items in original condition with tags attached. Items must be returned in original packaging. Some exclusions apply to final sale items."
      },
      {
        question: "How do I return an item?",
        answer: "Log into your account, go to Order History, and select 'Return Items' next to your order. Print the prepaid return label and drop off at any UPS location. Returns are processed within 5-7 business days."
      },
      {
        question: "Can I exchange for a different size?",
        answer: "Yes! We offer free exchanges for different sizes within 30 days. Use our online exchange portal or contact customer service for assistance with size exchanges."
      },
      {
        question: "Are there any items that can't be returned?",
        answer: "Final sale items, personalized items, and intimate apparel cannot be returned for hygiene reasons. These items are clearly marked during checkout."
      }
    ]
  },
  {
    title: "Sizing & Fit",
    questions: [
      {
        question: "How do I find my size?",
        answer: "Use our detailed size guide available on each product page. We provide measurements in both US and international sizes. For personalized fit advice, contact our styling team."
      },
      {
        question: "What if I'm between sizes?",
        answer: "We generally recommend sizing up if you're between sizes, especially for tailored pieces. Each product page includes fit notes and model measurements for reference."
      },
      {
        question: "Do your clothes run true to size?",
        answer: "Our pieces are designed to fit true to size based on our size chart. However, fit can vary by style and personal preference. Check individual product reviews for fit feedback from other customers."
      },
      {
        question: "Can I get alterations?",
        answer: "While we don't offer in-house alterations, we can recommend trusted tailors in major cities. Many of our pieces are designed with alteration-friendly construction."
      }
    ]
  },
  {
    title: "Products & Care",
    questions: [
      {
        question: "How should I care for my bibiere pieces?",
        answer: "Each item comes with specific care instructions on the label. Generally, we recommend dry cleaning for silk and wool items, and gentle machine washing for cotton pieces. Detailed care guides are available on our website."
      },
      {
        question: "Are your products sustainable?",
        answer: "Sustainability is core to our brand. We use ethically sourced materials, work with certified suppliers, and focus on creating timeless pieces that last. Learn more on our Sustainability page."
      },
      {
        question: "Where are your products made?",
        answer: "Our pieces are crafted by skilled artisans in Italy, Portugal, and select facilities known for their expertise in luxury fashion manufacturing. We maintain strict quality and ethical standards."
      },
      {
        question: "Do you offer gift wrapping?",
        answer: "Yes! We offer complimentary luxury gift wrapping with ribbon and a personalized note. This option is available during checkout for an additional $15."
      }
    ]
  },
  {
    title: "Account & Payment",
    questions: [
      {
        question: "How do I create an account?",
        answer: "Click 'Sign Up' in the top right corner of our website. You can also create an account during checkout. Having an account allows you to track orders, save favorites, and access exclusive offers."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. We also offer Klarna for buy-now-pay-later options."
      },
      {
        question: "Is my payment information secure?",
        answer: "Yes, we use industry-standard SSL encryption to protect your payment information. We're PCI DSS compliant and never store your full credit card details on our servers."
      },
      {
        question: "Do you offer student or military discounts?",
        answer: "We offer a 10% student discount through SheerID verification and a 15% military discount for active duty and veterans. Contact customer service for assistance with verification."
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-serif font-bold">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about shopping with bibiere
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQ..."
                className="pl-10"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-bibiere-burgundy">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((faq, questionIndex) => (
                    <AccordionItem 
                      key={questionIndex} 
                      value={`${categoryIndex}-${questionIndex}`}
                      className="border border-border rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="border border-border rounded-lg p-8 text-center space-y-6">
            <h3 className="text-2xl font-serif font-semibold">Still Need Help?</h3>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our customer service team is here to help.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="w-6 h-6 text-bibiere-burgundy" />
                </div>
                <div>
                  <h4 className="font-semibold">Live Chat</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Available Mon-Fri 9AM-6PM EST
                  </p>
                  <Button size="sm">Start Chat</Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 text-bibiere-burgundy" />
                </div>
                <div>
                  <h4 className="font-semibold">Email Support</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Response within 24 hours
                  </p>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/contact">Send Email</Link>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-6 h-6 text-bibiere-burgundy" />
                </div>
                <div>
                  <h4 className="font-semibold">Phone Support</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    1-800-BIBIERE (1-800-242-4373)
                  </p>
                  <Button size="sm" variant="outline">Call Now</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <Button variant="outline" asChild>
              <Link href="/shipping-returns">Shipping Info</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/size-guide">Size Guide</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/care-instructions">Care Guide</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
