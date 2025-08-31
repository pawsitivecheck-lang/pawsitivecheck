import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import UserReview from "@/components/user-review";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, Crown, Eye, Star, MessageCircle, ThumbsUp, Search, Loader2 } from "lucide-react";

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviewFilter, setReviewFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: userReviews, isLoading: isLoadingUserReviews } = useQuery<any[]>({
    queryKey: ['/api/user/reviews'],
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=100');
      return await res.json();
    },
  });

  // Get all reviews by fetching product reviews
  const { data: allReviews, isLoading: isLoadingAllReviews } = useQuery({
    queryKey: ['/api/community/reviews'],
    queryFn: async () => {
      if (!products) return [];
      
      const reviewPromises = products.map(async (product: any) => {
        const res = await fetch(`/api/products/${product.id}/reviews`);
        const reviews = await res.json();
        return reviews.map((review: any) => ({
          ...review,
          productName: product.name,
          productBrand: product.brand,
        }));
      });
      
      const allProductReviews = await Promise.all(reviewPromises);
      return allProductReviews.flat().sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    enabled: !!products,
  });

  const isLoading = isLoadingUserReviews || isLoadingProducts || isLoadingAllReviews;

  const filteredReviews = allReviews?.filter((review: any) => {
    if (reviewFilter !== "all" && review.rating.toString() !== reviewFilter) return false;
    if (searchTerm && !review.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !review.productName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }) || [];

  const getRankIcon = (reviewCount: number) => {
    if (reviewCount >= 50) return <Crown className="text-yellow-500 h-4 w-4" />;
    if (reviewCount >= 20) return <Star className="text-purple-600 h-4 w-4" />;
    if (reviewCount >= 5) return <Eye className="text-green-600 h-4 w-4" />;
    return <Users className="text-blue-600 h-4 w-4" />;
  };

  const getRankTitle = (reviewCount: number) => {
    if (reviewCount >= 50) return "Expert Reviewer";
    if (reviewCount >= 20) return "Senior Member";
    if (reviewCount >= 5) return "Active Member";
    return "New Member";
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Top Ad */}
      <div className="bg-muted border-b border-border py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="community-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
              <Users className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-4" data-testid="text-community-title">
              Community Portal
            </h1>
            <p className="text-muted-foreground text-lg" data-testid="text-community-description">
              Pet owners sharing experiences and product reviews for safer pet care
            </p>
          </div>

          {/* Community Stats */}
          <Card className="mb-8" data-testid="card-community-stats">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Users className="h-5 w-5" />
                Community Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2" data-testid="text-total-reviews">
                    {allReviews?.length || 0}
                  </div>
                  <p className="text-gray-600">Total Reviews</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2" data-testid="text-blessed-reviews">
                    {allReviews?.filter((r: any) => r.rating >= 4).length || 0}
                  </div>
                  <p className="text-gray-600">Positive Reviews</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2" data-testid="text-cursed-reviews">
                    {allReviews?.filter((r: any) => r.rating <= 2).length || 0}
                  </div>
                  <p className="text-gray-600">Safety Alerts</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2" data-testid="text-active-members">
                    {allReviews ? new Set(allReviews.map((r: any) => r.userId)).size : 0}
                  </div>
                  <p className="text-gray-600">Active Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Profile Card */}
          {user && (
            <Card className="mb-8 border-blue-200" data-testid="card-user-profile">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    {user.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                        data-testid="img-user-avatar"
                      />
                    ) : (
                      <Users className="text-white text-xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold text-gray-900" data-testid="text-user-name">
                        {user.firstName || 'Anonymous Member'}
                      </h3>
                      {getRankIcon(userReviews ? userReviews.length : 0)}
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-purple-50 text-purple-600 border-purple-600" data-testid="badge-user-rank">
                        {getRankTitle(userReviews ? userReviews.length : 0)}
                      </Badge>
                      <span className="text-gray-600 text-sm" data-testid="text-user-reviews-count">
                        {userReviews ? userReviews.length : 0} reviews shared
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    data-testid="button-view-profile"
                  >
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters and Search */}
          <Card className="mb-8" data-testid="card-review-filters">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Search className="h-5 w-5" />
                Find Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Search reviews and products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                  data-testid="input-search-reviews"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", "5", "4", "3", "2", "1"].map((rating) => (
                  <Button
                    key={rating}
                    variant={reviewFilter === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReviewFilter(rating)}
                    className={reviewFilter === rating 
                      ? "bg-blue-600 text-white" 
                      : "border-blue-600 text-blue-600 hover:bg-blue-50"
                    }
                    data-testid={`button-filter-${rating}`}
                  >
                    {rating === "all" ? "All Reviews" : `${rating} Paws`}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse" data-testid={`skeleton-review-${i}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Community Reviews */}
          {!isLoading && (
          <div className="space-y-6">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review: any) => (
                <Card key={review.id} className="" data-testid={`card-community-review-${review.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Users className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100" data-testid="text-reviewer-name">
                            Member #{review.userId.slice(-4)}
                          </h4>
                          {getRankIcon(5)} {/* Default rank for community display */}
                          <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" data-testid="badge-reviewer-rank">
                            Community Member
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="text-blue-600 font-medium mb-1" data-testid="text-product-reviewed">
                            {review.productName} by {review.productBrand}
                          </h5>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={i < review.rating ? 'text-green-600' : 'text-gray-300 dark:text-gray-600'}
                                data-testid={`paw-rating-${i}`}
                              >
                                🐾
                              </span>
                            ))}
                            <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                              {review.rating}/5 Paws
                            </span>
                          </div>
                        </div>
                        
                        {review.title && (
                          <h6 className="font-medium text-gray-700 dark:text-gray-300 mb-2" data-testid="text-review-title">
                            {review.title}
                          </h6>
                        )}
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-3" data-testid="text-review-content">
                          {review.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span data-testid="text-review-date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 hover:text-green-600 transition-colors" data-testid="button-like-review">
                              <ThumbsUp className="h-3 w-3" />
                              <span>Helpful</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors" data-testid="button-reply-review">
                              <MessageCircle className="h-3 w-3" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="" data-testid="card-no-reviews">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <MessageCircle className="text-gray-400 dark:text-gray-600 text-2xl" />
                  </div>
                  <h3 className="text-xl text-gray-700 dark:text-gray-300 mb-4" data-testid="text-no-reviews-title">
                    No Reviews Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6" data-testid="text-no-reviews-description">
                    {searchTerm || reviewFilter !== "all" 
                      ? "No reviews match your current search criteria."
                      : "The community is just beginning. Be the first to share your experiences!"}
                  </p>
                  {(searchTerm || reviewFilter !== "all") && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setReviewFilter("all");
                      }}
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      data-testid="button-clear-filters"
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          )}

          {/* Call to Action */}
          {user && (
            <div className="mt-12">
              <Card className="border-blue-200" data-testid="card-cta">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-blue-600 mb-4" data-testid="text-cta-title">
                    Share Your Experience
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6" data-testid="text-cta-description">
                    Help fellow pet owners by sharing your experiences with pet products
                  </p>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700" data-testid="button-share-review">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Write a Review
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
