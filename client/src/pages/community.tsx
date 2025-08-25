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
import { Users, Crown, Eye, Star, MessageCircle, ThumbsUp, Search } from "lucide-react";

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviewFilter, setReviewFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: userReviews } = useQuery<any[]>({
    queryKey: ['/api/user/reviews'],
  });

  const { data: products } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=100');
      return await res.json();
    },
  });

  // Get all reviews by fetching product reviews
  const { data: allReviews } = useQuery({
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

  const filteredReviews = allReviews?.filter((review: any) => {
    if (reviewFilter !== "all" && review.rating.toString() !== reviewFilter) return false;
    if (searchTerm && !review.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !review.productName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }) || [];

  const getRankIcon = (reviewCount: number) => {
    if (reviewCount >= 50) return <Crown className="text-starlight-500 h-4 w-4" />;
    if (reviewCount >= 20) return <Star className="text-mystical-purple h-4 w-4" />;
    if (reviewCount >= 5) return <Eye className="text-mystical-green h-4 w-4" />;
    return <Users className="text-cosmic-400 h-4 w-4" />;
  };

  const getRankTitle = (reviewCount: number) => {
    if (reviewCount >= 50) return "Cosmic Oracle";
    if (reviewCount >= 20) return "Elder Member";
    if (reviewCount >= 5) return "Truth Seeker";
    return "New Initiate";
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Top Ad */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="community-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-starlight-500 to-mystical-purple rounded-full flex items-center justify-center mb-6 animate-glow">
              <Users className="text-3xl text-cosmic-900" />
            </div>
            <h1 className="font-mystical text-4xl md:text-6xl font-bold text-starlight-500 mb-4" data-testid="text-community-title">
              The Resistance Community
            </h1>
            <p className="text-cosmic-300 text-lg" data-testid="text-community-description">
              United truth-seekers sharing mystical discoveries and cosmic wisdom
            </p>
          </div>

          {/* Community Stats */}
          <Card className="cosmic-card mb-8" data-testid="card-community-stats">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-starlight-400">
                <Users className="h-5 w-5" />
                Resistance Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-starlight-500 mb-2" data-testid="text-total-reviews">
                    {allReviews?.length || 0}
                  </div>
                  <p className="text-cosmic-300">Mystical Insights</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-mystical-green mb-2" data-testid="text-blessed-reviews">
                    {allReviews?.filter((r: any) => r.rating >= 4).length || 0}
                  </div>
                  <p className="text-cosmic-300">Blessed Products</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-mystical-red mb-2" data-testid="text-cursed-reviews">
                    {allReviews?.filter((r: any) => r.rating <= 2).length || 0}
                  </div>
                  <p className="text-cosmic-300">Cursed Warnings</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-mystical-purple mb-2" data-testid="text-active-members">
                    {allReviews ? new Set(allReviews.map((r: any) => r.userId)).size : 0}
                  </div>
                  <p className="text-cosmic-300">Active Seekers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Profile Card */}
          {user && (
            <Card className="cosmic-card mb-8 border-starlight-500/30" data-testid="card-user-profile">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-starlight-500 to-mystical-purple rounded-full flex items-center justify-center">
                    {user.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                        data-testid="img-user-avatar"
                      />
                    ) : (
                      <Users className="text-cosmic-900 text-xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold text-cosmic-100" data-testid="text-user-name">
                        {user.firstName || 'Anonymous Seeker'}
                      </h3>
                      {getRankIcon(userReviews ? userReviews.length : 0)}
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-mystical-purple/20 text-mystical-purple border-mystical-purple" data-testid="badge-user-rank">
                        {getRankTitle(userReviews ? userReviews.length : 0)}
                      </Badge>
                      <span className="text-cosmic-400 text-sm" data-testid="text-user-reviews-count">
                        {userReviews ? userReviews.length : 0} mystical insights shared
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    className="border-starlight-500 text-starlight-500 hover:bg-starlight-500/10"
                    data-testid="button-view-profile"
                  >
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters and Search */}
          <Card className="cosmic-card mb-8" data-testid="card-review-filters">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-starlight-400">
                <Search className="h-5 w-5" />
                Explore Community Wisdom
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Search reviews and products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-cosmic-900/50 border border-cosmic-600 text-cosmic-100 placeholder-cosmic-400"
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
                      ? "mystical-button" 
                      : "border-cosmic-600 text-cosmic-300 hover:bg-cosmic-600/10"
                    }
                    data-testid={`button-filter-${rating}`}
                  >
                    {rating === "all" ? "All Reviews" : `${rating} Paws`}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Reviews */}
          <div className="space-y-6">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review: any) => (
                <Card key={review.id} className="cosmic-card" data-testid={`card-community-review-${review.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-mystical-purple to-cosmic-600 rounded-full flex items-center justify-center">
                        <Users className="text-starlight-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-cosmic-100" data-testid="text-reviewer-name">
                            Truth Seeker #{review.userId.slice(-4)}
                          </h4>
                          {getRankIcon(5)} {/* Default rank for community display */}
                          <Badge className="bg-cosmic-700 text-cosmic-300" data-testid="badge-reviewer-rank">
                            Community Member
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="text-starlight-400 font-medium mb-1" data-testid="text-product-reviewed">
                            {review.productName} by {review.productBrand}
                          </h5>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={i < review.rating ? 'text-mystical-green' : 'text-cosmic-600'}
                                data-testid={`paw-rating-${i}`}
                              >
                                🐾
                              </span>
                            ))}
                            <span className="text-cosmic-400 text-sm ml-2">
                              {review.rating}/5 Paws
                            </span>
                          </div>
                        </div>
                        
                        {review.title && (
                          <h6 className="font-medium text-cosmic-200 mb-2" data-testid="text-review-title">
                            {review.title}
                          </h6>
                        )}
                        
                        <p className="text-cosmic-300 mb-3" data-testid="text-review-content">
                          {review.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-cosmic-500">
                          <span data-testid="text-review-date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 hover:text-mystical-green transition-colors" data-testid="button-like-review">
                              <ThumbsUp className="h-3 w-3" />
                              <span>Helpful</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-starlight-400 transition-colors" data-testid="button-reply-review">
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
              <Card className="cosmic-card" data-testid="card-no-reviews">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto bg-cosmic-700 rounded-full flex items-center justify-center mb-6">
                    <MessageCircle className="text-cosmic-500 text-2xl" />
                  </div>
                  <h3 className="font-mystical text-xl text-cosmic-300 mb-4" data-testid="text-no-reviews-title">
                    No Reviews Found
                  </h3>
                  <p className="text-cosmic-400 mb-6" data-testid="text-no-reviews-description">
                    {searchTerm || reviewFilter !== "all" 
                      ? "No reviews match your current search criteria."
                      : "The community is just beginning. Be the first to share your mystical insights!"}
                  </p>
                  {(searchTerm || reviewFilter !== "all") && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setReviewFilter("all");
                      }}
                      className="border-cosmic-600 text-cosmic-300"
                      data-testid="button-clear-filters"
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Call to Action */}
          {user && (
            <div className="mt-12">
              <Card className="cosmic-card border-starlight-500/50" data-testid="card-cta">
                <CardContent className="p-8 text-center">
                  <h3 className="font-mystical text-2xl text-starlight-500 mb-4" data-testid="text-cta-title">
                    Share Your Mystical Wisdom
                  </h3>
                  <p className="text-cosmic-300 mb-6" data-testid="text-cta-description">
                    Help fellow truth-seekers by sharing your experiences with pet products
                  </p>
                  <Button className="mystical-button" data-testid="button-share-review">
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
