"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsEmailSent(true)
    }, 1000)
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold">Check Your Email</h1>
            <p className="text-muted-foreground">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <div className="border border-border rounded-lg p-8 space-y-6">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Click the link in the email to reset your password. If you don't see the email, check your spam folder.
              </p>
              <p>
                The link will expire in 24 hours for security reasons.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => setIsEmailSent(false)}
                variant="outline" 
                className="w-full"
              >
                Try Different Email
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/login">Back to Sign In</Link>
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Didn't receive the email?{" "}
            <button 
              onClick={handleSubmit}
              className="text-bibiere-burgundy hover:underline font-medium"
            >
              Resend
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/auth/login">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </Button>
          <div className="w-16 h-16 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-bibiere-burgundy" />
          </div>
          <h1 className="text-3xl font-serif font-bold">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <div className="border border-border rounded-lg p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !email}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-bibiere-burgundy hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          For security reasons, we'll only send reset instructions to email addresses associated with bibiere accounts.
        </div>
      </div>
    </div>
  )
}
