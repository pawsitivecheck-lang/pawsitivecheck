import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserReview from "@/components/user-review";
import { useQuery } from "@tanstack/react-query";
import { User, Star, Crown, Eye, Calendar, Package, MessageCircle, Shield, TrendingUp } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const { data: userReviews } = useQuery({
    queryKey: ['/api/user/reviews'],
  });

  const { data: userScans } = useQuery({
    queryKey: ['/api/scans'],
  });

  const getRankIcon = (reviewCount: number) => {
    if (reviewCount >= 50) return <Crown className="text-starlight-500 h-5 w-5" />;
    if (reviewCount >= 20) return <Star className="text-mystical-purple h-5 w-5" />;
    if (reviewCount >= 5) return <Eye className="text-mystical-green h-5 w-5" />;
    return <User className="text-cosmic-400 h-5 w-5" />;
  };

  const getRankTitle = (reviewCount: number) => {
    if (reviewCount >= 50) return "Cosmic Oracle";
    if (reviewCount >= 20) return "Elder Member";
    if (reviewCount >= 5) return "Truth Seeker";
    return "New Initiate";
  };

  const getRankDescription = (reviewCount: number) => {
    if (reviewCount >= 50) return "Master of cosmic wisdom, trusted advisor to the Audit Syndicate";
    if (reviewCount >= 20) return "Experienced guardian of truth, respected by fellow seekers";
    if (reviewCount >= 5) return "Dedicated seeker of transparency and protection";
    return "Beginning the journey of mystical discovery";
  };

  const getNextRankProgress = (reviewCount: number) => {
    if (reviewCount >= 50) return { current: reviewCount, max: 50, nextRank: "Maximum Rank Achieved" };
    if (reviewCount >= 20) return { current: reviewCount, max: 50, nextRank: "Cosmic Oracle" };
    if (reviewCount >= 5) return { current: reviewCount, max: 20, nextRank: "Elder Member" };
    return { current: reviewCount, max: 5, nextRank: "Truth Seeker" };
  };

  const reviewCount = userReviews?.length || 0;
  const scanCount = userScans?.length || 0;
  const rankProgress = getNextRankProgress(reviewCount);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="mb-12">
            <Card className="cosmic-card border-starlight-500/50" data-testid="card-profile-header">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="text-center md:text-left">
                    <div className="w-24 h-24 mx-auto md:mx-0 bg-gradient-to-br from-starlight-500 to-mystical-purple rounded-full flex items-center justify-center mb-4">
                      {user?.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                          data-testid="img-profile-avatar"
                        />
                      ) : (
                        <User className="text-cosmic-900 text-3xl" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h1 className="font-mystical text-3xl font-bold text-starlight-500" data-testid="text-profile-name">
                        {user?.firstName || 'Anonymous'} {user?.lastName || 'Seeker'}
                      </h1>
                      {getRankIcon(reviewCount)}
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <Badge className="bg-mystical-purple/20 text-mystical-purple border-mystical-purple" data-testid="badge-user-rank">
                        {getRankTitle(reviewCount)}
                      </Badge>
                      {user?.isAdmin && (
                        <Badge className="bg-starlight-500/20 text-starlight-500 border-starlight-500" data-testid="badge-admin">
                          Audit Syndicate Member
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-cosmic-300 mb-4" data-testid="text-rank-description">
                      {getRankDescription(reviewCount)}
                    </p>
                    
                    <div className="flex items-center justify-center md:justify-start gap-1 text-cosmic-400 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span data-testid="text-join-date">
                        Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      variant="outline"
                      className="border-starlight-500 text-starlight-500 hover:bg-starlight-500/10"
                      data-testid="button-edit-profile"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="cosmic-card" data-testid="card-stat-reviews">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-mystical-purple/20 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="text-mystical-purple" />
                </div>
                <div className="text-3xl font-bold text-mystical-purple mb-2" data-testid="text-review-count">
                  {reviewCount}
                </div>
                <p className="text-cosmic-300">Mystical Insights</p>
              </CardContent>
            </Card>

            <Card className="cosmic-card" data-testid="card-stat-scans">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-mystical-green/20 rounded-full flex items-center justify-center mb-4">
                  <Package className="text-mystical-green" />
                </div>
                <div className="text-3xl font-bold text-mystical-green mb-2" data-testid="text-scan-count">
                  {scanCount}
                </div>
                <p className="text-cosmic-300">Products Scanned</p>
              </CardContent>
            </Card>

            <Card className="cosmic-card" data-testid="card-stat-helpfulness">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-starlight-500/20 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="text-starlight-500" />
                </div>
                <div className="text-3xl font-bold text-starlight-500 mb-2" data-testid="text-helpfulness-score">
                  {Math.round((reviewCount * 4.2) + (scanCount * 1.5))}
                </div>
                <p className="text-cosmic-300">Helpfulness Score</p>
              </CardContent>
            </Card>

            <Card className="cosmic-card" data-testid="card-stat-rank-progress">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-cosmic-600/20 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-cosmic-400" />
                </div>
                <div className="text-3xl font-bold text-cosmic-400 mb-2" data-testid="text-rank-progress">
                  {rankProgress.current}/{rankProgress.max}
                </div>
                <p className="text-cosmic-300">to {rankProgress.nextRank}</p>
              </CardContent>
            </Card>
          </div>

          {/* Rank Progress */}
          {rankProgress.current < rankProgress.max && (
            <Card className="cosmic-card mb-8" data-testid="card-rank-progress">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-starlight-400">
                  <TrendingUp className="h-5 w-5" />
                  Path to {rankProgress.nextRank}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="w-full bg-cosmic-800 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-starlight-500 to-mystical-purple h-4 rounded-full transition-all duration-500"
                      style={{ width: `${(rankProgress.current / rankProgress.max) * 100}%` }}
                      data-testid="progress-bar-rank"
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-cosmic-300">
                    <span data-testid="text-progress-current">
                      {rankProgress.current} reviews completed
                    </span>
                    <span data-testid="text-progress-remaining">
                      {rankProgress.max - rankProgress.current} more needed
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Tabs */}
          <Tabs defaultValue="reviews" className="w-full" data-testid="tabs-profile">
            <TabsList className="grid w-full grid-cols-3 bg-cosmic-800/50 border border-cosmic-600">
              <TabsTrigger value="reviews" className="data-[state=active]:bg-mystical-purple/20 data-[state=active]:text-mystical-purple" data-testid="tab-reviews">
                My Reviews
              </TabsTrigger>
              <TabsTrigger value="scans" className="data-[state=active]:bg-mystical-green/20 data-[state=active]:text-mystical-green" data-testid="tab-scans">
                Scan History
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-starlight-500/20 data-[state=active]:text-starlight-500" data-testid="tab-achievements">
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-6" data-testid="content-reviews">
              {userReviews?.length > 0 ? (
                <div className="space-y-6">
                  {userReviews.map((review: any) => (
                    <Card key={review.id} className="cosmic-card" data-testid={`review-card-${review.id}`}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-cosmic-100 mb-1" data-testid="text-review-title">
                              {review.title || 'Untitled Review'}
                            </h3>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className={i < review.rating ? 'text-mystical-green' : 'text-cosmic-600'}
                                  data-testid={`review-paw-${i}`}
                                >
                                  🐾
                                </span>
                              ))}
                              <span className="text-cosmic-400 text-sm ml-2">
                                {review.rating}/5 Paws
                              </span>
                            </div>
                          </div>
                          <span className="text-cosmic-500 text-sm" data-testid="text-review-date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-cosmic-300 mb-4" data-testid="text-review-content">
                          {review.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-cosmic-400 text-sm">
                            Product ID: {review.productId}
                          </span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-cosmic-600 text-cosmic-300" data-testid="button-edit-review">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="border-mystical-red text-mystical-red" data-testid="button-delete-review">
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="cosmic-card" data-testid="card-no-reviews">
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="mx-auto h-16 w-16 text-cosmic-500 mb-4" />
                    <h3 className="font-mystical text-xl text-cosmic-300 mb-4" data-testid="text-no-reviews-title">
                      No Reviews Yet
                    </h3>
                    <p className="text-cosmic-400 mb-6" data-testid="text-no-reviews-description">
                      Share your mystical insights about pet products to help fellow truth-seekers
                    </p>
                    <Button className="mystical-button" data-testid="button-write-first-review">
                      Write Your First Review
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="scans" className="mt-6" data-testid="content-scans">
              {userScans?.length > 0 ? (
                <div className="space-y-4">
                  {userScans.map((scan: any) => (
                    <Card key={scan.id} className="cosmic-card" data-testid={`scan-card-${scan.id}`}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-cosmic-100 mb-2" data-testid="text-scan-data">
                              {scan.scannedData || 'Unknown Product'}
                            </h3>
                            {scan.analysisResult && (
                              <Badge 
                                className={
                                  scan.analysisResult.cosmicClarity === 'blessed' 
                                    ? 'bg-mystical-green/20 text-mystical-green'
                                    : scan.analysisResult.cosmicClarity === 'cursed'
                                    ? 'bg-mystical-red/20 text-mystical-red'
                                    : 'bg-yellow-500/20 text-yellow-500'
                                }
                                data-testid="badge-scan-clarity"
                              >
                                {scan.analysisResult.cosmicClarity?.toUpperCase() || 'ANALYZED'}
                              </Badge>
                            )}
                          </div>
                          <span className="text-cosmic-500 text-sm" data-testid="text-scan-date">
                            {new Date(scan.scannedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="cosmic-card" data-testid="card-no-scans">
                  <CardContent className="p-12 text-center">
                    <Package className="mx-auto h-16 w-16 text-cosmic-500 mb-4" />
                    <h3 className="font-mystical text-xl text-cosmic-300 mb-4" data-testid="text-no-scans-title">
                      No Scans Yet
                    </h3>
                    <p className="text-cosmic-400 mb-6" data-testid="text-no-scans-description">
                      Begin your mystical journey by scanning your first pet product
                    </p>
                    <Button className="mystical-button" data-testid="button-start-scanning">
                      Start Scanning
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="achievements" className="mt-6" data-testid="content-achievements">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Achievement Cards */}
                <Card className={`cosmic-card ${reviewCount >= 1 ? 'border-mystical-green/50' : 'border-cosmic-600/50'}`} data-testid="achievement-first-review">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      reviewCount >= 1 ? 'bg-mystical-green/20' : 'bg-cosmic-700'
                    }`}>
                      <MessageCircle className={reviewCount >= 1 ? 'text-mystical-green' : 'text-cosmic-500'} />
                    </div>
                    <h3 className={`font-mystical text-lg mb-2 ${reviewCount >= 1 ? 'text-mystical-green' : 'text-cosmic-400'}`}>
                      First Insight
                    </h3>
                    <p className="text-cosmic-300 text-sm">
                      Share your first mystical review
                    </p>
                    {reviewCount >= 1 && (
                      <Badge className="mt-2 bg-mystical-green/20 text-mystical-green" data-testid="badge-achievement-unlocked">
                        Unlocked!
                      </Badge>
                    )}
                  </CardContent>
                </Card>

                <Card className={`cosmic-card ${scanCount >= 5 ? 'border-mystical-purple/50' : 'border-cosmic-600/50'}`} data-testid="achievement-scanner">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      scanCount >= 5 ? 'bg-mystical-purple/20' : 'bg-cosmic-700'
                    }`}>
                      <Package className={scanCount >= 5 ? 'text-mystical-purple' : 'text-cosmic-500'} />
                    </div>
                    <h3 className={`font-mystical text-lg mb-2 ${scanCount >= 5 ? 'text-mystical-purple' : 'text-cosmic-400'}`}>
                      Mystic Scanner
                    </h3>
                    <p className="text-cosmic-300 text-sm">
                      Scan 5 products with the cosmic scanner
                    </p>
                    {scanCount >= 5 ? (
                      <Badge className="mt-2 bg-mystical-purple/20 text-mystical-purple" data-testid="badge-scanner-unlocked">
                        Unlocked!
                      </Badge>
                    ) : (
                      <Badge className="mt-2 bg-cosmic-700 text-cosmic-400" data-testid="badge-scanner-progress">
                        {scanCount}/5
                      </Badge>
                    )}
                  </CardContent>
                </Card>

                <Card className={`cosmic-card ${reviewCount >= 5 ? 'border-starlight-500/50' : 'border-cosmic-600/50'}`} data-testid="achievement-truth-seeker">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      reviewCount >= 5 ? 'bg-starlight-500/20' : 'bg-cosmic-700'
                    }`}>
                      <Eye className={reviewCount >= 5 ? 'text-starlight-500' : 'text-cosmic-500'} />
                    </div>
                    <h3 className={`font-mystical text-lg mb-2 ${reviewCount >= 5 ? 'text-starlight-500' : 'text-cosmic-400'}`}>
                      Truth Seeker
                    </h3>
                    <p className="text-cosmic-300 text-sm">
                      Achieve Truth Seeker rank
                    </p>
                    {reviewCount >= 5 ? (
                      <Badge className="mt-2 bg-starlight-500/20 text-starlight-500" data-testid="badge-truth-seeker-unlocked">
                        Unlocked!
                      </Badge>
                    ) : (
                      <Badge className="mt-2 bg-cosmic-700 text-cosmic-400" data-testid="badge-truth-seeker-progress">
                        {reviewCount}/5
                      </Badge>
                    )}
                  </CardContent>
                </Card>

                <Card className={`cosmic-card ${user?.isAdmin ? 'border-mystical-red/50' : 'border-cosmic-600/50'}`} data-testid="achievement-syndicate">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      user?.isAdmin ? 'bg-mystical-red/20' : 'bg-cosmic-700'
                    }`}>
                      <Crown className={user?.isAdmin ? 'text-mystical-red' : 'text-cosmic-500'} />
                    </div>
                    <h3 className={`font-mystical text-lg mb-2 ${user?.isAdmin ? 'text-mystical-red' : 'text-cosmic-400'}`}>
                      Syndicate Member
                    </h3>
                    <p className="text-cosmic-300 text-sm">
                      Join the Audit Syndicate
                    </p>
                    {user?.isAdmin && (
                      <Badge className="mt-2 bg-mystical-red/20 text-mystical-red" data-testid="badge-syndicate-unlocked">
                        Unlocked!
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
