import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
          <h2 className="text-2xl font-serif font-bold">Message Sent!</h2>
          <p className="text-muted-foreground">
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're here to help with any questions about our collections, sizing, orders, or anything else. Reach out to our dedicated team.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-4">Send us a message</h2>
              <p className="text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">First Name *</label>
                  <Input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    placeholder="Jane"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">Last Name *</label>
                  <Input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address *</label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject *</label>
                <Input
                  id="subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="What can we help you with?"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message *</label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us more about your inquiry..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-bibiere-burgundy hover:bg-bibiere-burgundy-dark text-white">
                Send Message
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-4">Get in touch</h2>
              <p className="text-muted-foreground">Prefer to reach out directly? Here are all the ways you can contact us.</p>
            </div>

            <div className="space-y-6">
              {[
                { Icon: Mail, title: "Email", line1: "hello@bibiere.com", line2: "We typically respond within 24 hours" },
                { Icon: Phone, title: "Phone", line1: "+1 (888) 424-7437", line2: "Monday–Friday, 9am–6pm EST" },
                { Icon: MapPin, title: "Address", line1: "123 Luxury Avenue", line2: "New York, NY 10001" },
                { Icon: Clock, title: "Business Hours", line1: "Monday–Friday: 9am–6pm EST", line2: "Saturday: 10am–4pm EST" },
              ].map(({ Icon, title, line1, line2 }) => (
                <div key={title} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-bibiere-burgundy" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{title}</h3>
                    <p className="text-muted-foreground">{line1}</p>
                    <p className="text-sm text-muted-foreground">{line2}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
