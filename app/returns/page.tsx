import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Package, Clock, Shield, ArrowRight, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Returns & Exchanges | bibiere",
  description: "Easy returns and exchanges for bibiere luxury fashion. 30-day return policy with free return shipping.",
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif font-bold">Returns & Exchanges</h1>
            <p className="text-xl text-muted-foreground">
              We want you to love your bibiere pieces. If something isn't perfect, we're here to help.
            </p>
          </div>

          {/* Quick Return Form */}
          <div className="border border-border rounded-lg p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-serif font-semibold">Start a Return</h2>
              <p className="text-muted-foreground">
                Enter your order information to begin the return process
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Label htmlFor="order-number">Order Number</Label>
                <Input
                  id="order-number"
                  placeholder="ORD-2024-001234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                />
              </div>
              <Button className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Return Process
              </Button>
            </div>
          </div>

          {/* Return Policy Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold">30-Day Returns</h3>
                <p className="text-sm text-muted-foreground">
                  Return unworn items within 30 days of delivery for a full refund
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold">Free Return Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  We provide prepaid return labels for all domestic returns
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold">Quality Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  If there's a quality issue, we'll make it right with a full refund or exchange
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Return Policy */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-center">Return Policy Details</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-semibold mb-4">What Can Be Returned</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Unworn Items</p>
                        <p className="text-sm text-muted-foreground">Items in original condition with tags attached</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Original Packaging</p>
                        <p className="text-sm text-muted-foreground">Items returned in original packaging and dust bags</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Within 30 Days</p>
                        <p className="text-sm text-muted-foreground">Returns initiated within 30 days of delivery</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-semibold mb-4">Return Process</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-bibiere-burgundy rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Initiate Return</p>
                        <p className="text-sm text-muted-foreground">Use the form above or log into your account</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-bibiere-burgundy rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Print Return Label</p>
                        <p className="text-sm text-muted-foreground">We'll email you a prepaid return shipping label</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-bibiere-burgundy rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Package & Ship</p>
                        <p className="text-sm text-muted-foreground">Pack items securely and drop off at UPS</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-bibiere-burgundy rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        4
                      </div>
                      <div>
                        <p className="font-medium">Receive Refund</p>
                        <p className="text-sm text-muted-foreground">Refund processed within 5-7 business days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-semibold mb-4">Exchanges</h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      Need a different size or color? We offer free exchanges within 30 days.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">Exchange Benefits:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Free shipping both ways</li>
                        <li>• Hold your original item until exchange arrives</li>
                        <li>• Priority processing (2-3 business days)</li>
                      </ul>
                    </div>
                    <Button variant="outline" className="w-full">
                      Start Exchange Process
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-semibold mb-4">Final Sale Items</h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-sm">
                      The following items cannot be returned:
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Final Sale</Badge>
                        <span>Items marked as final sale</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Personalized</Badge>
                        <span>Customized or monogrammed items</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Intimate</Badge>
                        <span>Undergarments and swimwear</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-semibold mb-4">International Returns</h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-sm">
                      International customers are responsible for return shipping costs. 
                      Customs duties and taxes are non-refundable.
                    </p>
                    <Button variant="outline" size="sm">
                      International Return Guide
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border border-border rounded-lg p-8 space-y-6">
            <h3 className="text-2xl font-serif font-semibold text-center">Common Questions</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How long do refunds take?</h4>
                  <p className="text-sm text-muted-foreground">
                    Refunds are processed within 5-7 business days after we receive your return. 
                    It may take an additional 3-5 business days to appear on your statement.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I return sale items?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, sale items can be returned unless marked as "Final Sale." 
                    Final sale items are clearly marked during checkout.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What if my item is damaged?</h4>
                  <p className="text-sm text-muted-foreground">
                    If you receive a damaged item, contact us immediately. We'll provide a 
                    prepaid return label and expedite your replacement or refund.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I return a gift?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, gifts can be returned for store credit or exchanged. The original 
                    purchaser will be notified of the return for their records.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-serif font-semibold">Need Help?</h3>
            <p className="text-muted-foreground">
              Our customer service team is here to make your return experience seamless.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/contact">
                  Contact Support
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/faq">View FAQ</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
