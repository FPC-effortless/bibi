import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Heart, Briefcase, GraduationCap } from "lucide-react"

export const metadata: Metadata = {
  title: "Careers - Join Our Team | bibiere",
  description: "Join the bibiere team and help shape the future of sustainable luxury fashion. Explore career opportunities and company culture.",
}

const openPositions = [
  {
    title: "Senior Fashion Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    experience: "5+ years",
    featured: true,
    description: "Lead the design of our seasonal collections, working closely with our creative director to bring innovative and timeless pieces to life."
  },
  {
    title: "Sustainability Manager",
    department: "Operations",
    location: "Los Angeles, CA",
    type: "Full-time",
    experience: "3+ years",
    featured: true,
    description: "Drive our sustainability initiatives and ensure our environmental commitments are met across all aspects of the business."
  },
  {
    title: "E-commerce Manager",
    department: "Digital",
    location: "Remote",
    type: "Full-time",
    experience: "4+ years",
    featured: false,
    description: "Oversee our online presence and digital customer experience, optimizing conversion and customer satisfaction."
  },
  {
    title: "Production Coordinator",
    department: "Operations",
    location: "Milan, Italy",
    type: "Full-time",
    experience: "2+ years",
    featured: false,
    description: "Coordinate with our manufacturing partners to ensure quality standards and timely delivery of our collections."
  },
  {
    title: "Customer Experience Specialist",
    department: "Customer Service",
    location: "Beverly Hills, CA",
    type: "Full-time",
    experience: "1+ years",
    featured: false,
    description: "Provide exceptional customer service and support, embodying our brand values in every interaction."
  },
  {
    title: "Marketing Coordinator",
    department: "Marketing",
    location: "New York, NY",
    type: "Full-time",
    experience: "2+ years",
    featured: false,
    description: "Support marketing campaigns and brand initiatives, helping to tell the bibiere story across all channels."
  }
]

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance, mental health support, and wellness programs"
  },
  {
    icon: GraduationCap,
    title: "Learning & Development",
    description: "Professional development budget, conference attendance, and skill-building opportunities"
  },
  {
    icon: Clock,
    title: "Work-Life Balance",
    description: "Flexible working hours, remote work options, and generous paid time off"
  },
  {
    icon: Users,
    title: "Inclusive Culture",
    description: "Diverse, inclusive workplace with employee resource groups and mentorship programs"
  },
  {
    icon: Briefcase,
    title: "Career Growth",
    description: "Clear career progression paths and internal promotion opportunities"
  },
  {
    icon: Heart,
    title: "Employee Perks",
    description: "Product discounts, team events, and access to exclusive brand experiences"
  }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Join Our Team</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Be part of a team that's redefining luxury fashion through sustainability, craftsmanship, and innovation.
            </p>
          </div>

          {/* Company Culture */}
          <div className="bg-muted/30 rounded-lg p-8 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold">Why bibiere?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're more than a fashion brand—we're a community of passionate individuals committed to creating positive change in the industry.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-bibiere-burgundy" />
                </div>
                <h3 className="text-xl font-serif font-semibold">Purpose-Driven</h3>
                <p className="text-muted-foreground text-sm">
                  Every role contributes to our mission of creating sustainable luxury fashion that makes a positive impact.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-bibiere-gold/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-bibiere-gold" />
                </div>
                <h3 className="text-xl font-serif font-semibold">Collaborative</h3>
                <p className="text-muted-foreground text-sm">
                  We believe in the power of diverse perspectives and collaborative innovation to drive our success.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <GraduationCap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-serif font-semibold">Growth-Focused</h3>
                <p className="text-muted-foreground text-sm">
                  We invest in our people's growth and provide opportunities to develop skills and advance careers.
                </p>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold">Open Positions</h2>
              <p className="text-muted-foreground">
                Discover opportunities to make your mark in luxury fashion
              </p>
            </div>

            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <div key={index} className={`border border-border rounded-lg p-6 hover:shadow-lg transition-shadow ${
                  position.featured ? 'bg-bibiere-burgundy/5 border-bibiere-burgundy/20' : ''
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-serif font-semibold">{position.title}</h3>
                        {position.featured && (
                          <Badge className="bg-bibiere-burgundy">Featured</Badge>
                        )}
                        <Badge variant="outline">{position.department}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {position.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {position.experience}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground">{position.description}</p>
                    </div>
                    
                    <div className="flex gap-3 lg:flex-col lg:w-32">
                      <Button size="sm" className="flex-1 lg:flex-none">
                        Apply Now
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Don't see the perfect role? We're always looking for exceptional talent.
              </p>
              <Button variant="outline">Submit General Application</Button>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold">Benefits & Perks</h2>
              <p className="text-muted-foreground">
                We believe in taking care of our team members
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="border border-border rounded-lg p-6 space-y-4">
                  <div className="w-12 h-12 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-bibiere-burgundy" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internship Program */}
          <div className="bg-muted/30 rounded-lg p-8 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-serif font-semibold">Internship Program</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Launch your career in luxury fashion with our comprehensive internship program, 
                designed to provide hands-on experience and mentorship.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-semibold">Program Highlights</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-bibiere-burgundy rounded-full mt-2 flex-shrink-0"></div>
                    <p>12-week immersive program across design, marketing, and operations</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-bibiere-burgundy rounded-full mt-2 flex-shrink-0"></div>
                    <p>Mentorship from senior team members and industry professionals</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-bibiere-burgundy rounded-full mt-2 flex-shrink-0"></div>
                    <p>Real projects with measurable impact on the business</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-bibiere-burgundy rounded-full mt-2 flex-shrink-0"></div>
                    <p>Networking opportunities and industry insights</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-serif font-semibold">Application Deadlines</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Summer 2025 Program</span>
                    <span className="font-medium">March 1, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fall 2025 Program</span>
                    <span className="font-medium">July 1, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spring 2026 Program</span>
                    <span className="font-medium">November 1, 2025</span>
                  </div>
                </div>
                <Button className="w-full mt-4">Apply for Internship</Button>
              </div>
            </div>
          </div>

          {/* Diversity & Inclusion */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold">Diversity & Inclusion</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                We believe that diversity drives innovation. We're committed to creating an inclusive 
                environment where everyone can thrive and contribute their unique perspectives.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="text-3xl font-bold text-bibiere-burgundy">50%</div>
                <p className="text-sm text-muted-foreground">Women in leadership positions</p>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-bibiere-burgundy">40+</div>
                <p className="text-sm text-muted-foreground">Countries represented in our team</p>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-bibiere-burgundy">5</div>
                <p className="text-sm text-muted-foreground">Employee resource groups</p>
              </div>
            </div>
          </div>

          {/* Application Process */}
          <div className="border border-border rounded-lg p-8 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-serif font-semibold">Application Process</h2>
              <p className="text-muted-foreground">
                Our hiring process is designed to be transparent and give you the best opportunity to showcase your talents.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-bibiere-burgundy rounded-full flex items-center justify-center mx-auto text-white font-bold">
                  1
                </div>
                <h3 className="font-semibold">Application</h3>
                <p className="text-sm text-muted-foreground">Submit your resume and cover letter through our careers portal</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-bibiere-burgundy rounded-full flex items-center justify-center mx-auto text-white font-bold">
                  2
                </div>
                <h3 className="font-semibold">Phone Screen</h3>
                <p className="text-sm text-muted-foreground">Initial conversation with our recruiting team to discuss your background</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-bibiere-burgundy rounded-full flex items-center justify-center mx-auto text-white font-bold">
                  3
                </div>
                <h3 className="font-semibold">Interviews</h3>
                <p className="text-sm text-muted-foreground">Meet with team members and hiring managers to discuss the role in detail</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-bibiere-burgundy rounded-full flex items-center justify-center mx-auto text-white font-bold">
                  4
                </div>
                <h3 className="font-semibold">Decision</h3>
                <p className="text-sm text-muted-foreground">We'll make our decision and extend an offer to the selected candidate</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center space-y-6 py-12 border-t border-border">
            <h2 className="text-3xl font-serif font-bold">Ready to Join Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take the next step in your career and become part of the bibiere story. 
              We're excited to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg">View Open Positions</Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact HR Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
