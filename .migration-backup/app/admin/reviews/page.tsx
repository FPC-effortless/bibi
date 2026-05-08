"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search, Filter, Download, ThumbsUp, ThumbsDown, Flag, Check, X, MessageSquare, Eye, Trash2 } from "lucide-react"

// Mock reviews data
const mockReviews = [
  {
    id: "rev-001",
    productName: "Silk Evening Gown",
    productId: "prod-001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    rating: 5,
    title: "Absolutely stunning!",
    comment: "This gown exceeded all my expectations. The quality is exceptional and the fit is perfect. I received so many compliments at the event.",
    status: "published",
    helpful: 12,
    notHelpful: 1,
    createdAt: "2024-01-24",
    verified: true
  },
  {
    id: "rev-002",
    productName: "Cashmere Coat",
    productId: "prod-002", 
    customerName: "Emma Wilson",
    customerEmail: "emma.w@email.com",
    rating: 4,
    title: "Great quality, runs small",
    comment: "Beautiful coat with excellent craftsmanship. However, it runs a bit small so I'd recommend sizing up. The cashmere is incredibly soft.",
    status: "published",
    helpful: 8,
    notHelpful: 2,
    createdAt: "2024-01-23",
    verified: true
  },
  {
    id: "rev-003",
    productName: "Leather Handbag",
    productId: "prod-003",
    customerName: "Anonymous",
    customerEmail: "customer@email.com",
    rating: 2,
    title: "Disappointed with quality",
    comment: "The bag looks nice but the leather feels cheap for the price. The stitching came loose after just a few uses.",
    status: "pending",
    helpful: 0,
    notHelpful: 0,
    createdAt: "2024-01-22",
    verified: false
  },
  {
    id: "rev-004",
    productName: "Wool Blazer",
    productId: "prod-004",
    customerName: "Lisa Anderson",
    customerEmail: "lisa.a@email.com",
    rating: 5,
    title: "Perfect for business meetings",
    comment: "This blazer is exactly what I was looking for. Professional, well-tailored, and the wool is high quality. Worth every penny.",
    status: "published",
    helpful: 15,
    notHelpful: 0,
    createdAt: "2024-01-21",
    verified: true
  },
  {
    id: "rev-005",
    productName: "Designer Heels",
    productId: "prod-005",
    customerName: "Maria Garcia",
    customerEmail: "maria.g@email.com",
    rating: 1,
    title: "Uncomfortable and overpriced",
    comment: "These shoes are extremely uncomfortable and not worth the high price. I couldn't wear them for more than an hour.",
    status: "flagged",
    helpful: 3,
    notHelpful: 8,
    createdAt: "2024-01-20",
    verified: true
  }
]

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedRating, setSelectedRating] = useState("All")

  const statuses = ["All", "published", "pending", "flagged", "rejected"]
  const ratings = ["All", "5", "4", "3", "2", "1"]

  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || review.status === selectedStatus
    const matchesRating = selectedRating === "All" || review.rating.toString() === selectedRating
    
    return matchesSearch && matchesStatus && matchesRating
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "flagged":
        return <Badge className="bg-red-100 text-red-800">Flagged</Badge>
      case "rejected":
        return <Badge className="bg-gray-100 text-gray-800">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length
  const totalReviews = mockReviews.length
  const pendingReviews = mockReviews.filter(r => r.status === "pending").length
  const flaggedReviews = mockReviews.filter(r => r.status === "flagged").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Reviews & Ratings</h1>
          <p className="text-muted-foreground">Manage customer feedback and reviews</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(Math.round(averageRating))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flagged Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{flaggedReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === "All" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                {ratings.map(rating => (
                  <SelectItem key={rating} value={rating}>
                    {rating === "All" ? "All Ratings" : `${rating} Stars`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews ({filteredReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="font-medium">{review.title}</span>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {review.customerName} • {review.productName} • {review.createdAt}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(review.status)}
                  </div>
                </div>

                <p className="text-sm leading-relaxed">{review.comment}</p>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {review.helpful}
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="w-3 h-3" />
                      {review.notHelpful}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {review.status === "pending" && (
                      <>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                          Approve
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          Reject
                        </Button>
                      </>
                    )}
                    {review.status === "flagged" && (
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        Review Flag
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = mockReviews.filter(r => r.rating === rating).length
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              
              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-bibiere-burgundy h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
