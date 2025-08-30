import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentFlagButton } from "@/components/content-flag-button";
import { ReactNode } from "react";

interface UserReviewProps {
  id?: number; // Review ID for flagging functionality
  username: string;
  userType: string;
  content: string;
  rating: number;
  timeAgo: string;
  icon: ReactNode;
  productName?: string;
  productBrand?: string;
  verified?: boolean;
  showFlagButton?: boolean; // Allow disabling flag button for certain contexts
}

export default function UserReview({ 
  id,
  username, 
  userType, 
  content, 
  rating, 
  timeAgo, 
  icon,
  productName,
  productBrand,
  verified = false,
  showFlagButton = true
}: UserReviewProps) {
  return (
    <Card className="cosmic-card hover:border-starlight-500/40 transition-all" data-testid={`user-review-${username}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-mystical-purple to-cosmic-600 rounded-full flex items-center justify-center border-2 border-starlight-500 flex-shrink-0">
            <div className="text-starlight-500 text-xl">🐱</div>
          </div>
          
          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-cosmic-100 truncate" data-testid="text-username">
                {username}
              </h4>
              <div className="flex items-center gap-1">
                {icon}
                <Badge 
                  className={`text-xs ${
                    userType === 'Elder Member' ? 'bg-starlight-500/20 text-starlight-500 border-starlight-500' :
                    userType === 'Cosmic Oracle' ? 'bg-mystical-purple/20 text-mystical-purple border-mystical-purple' :
                    userType === 'Truth Seeker' ? 'bg-mystical-green/20 text-mystical-green border-mystical-green' :
                    'bg-cosmic-600/20 text-cosmic-400 border-cosmic-600'
                  }`}
                  data-testid="badge-user-type"
                >
                  {userType}
                </Badge>
              </div>
              {verified && (
                <Badge className="bg-mystical-green/20 text-mystical-green border-mystical-green text-xs" data-testid="badge-verified">
                  Verified
                </Badge>
              )}
            </div>

            {/* Product Info (if available) */}
            {productName && (
              <div className="mb-2">
                <span className="text-starlight-400 font-medium text-sm" data-testid="text-product-name">
                  {productName}
                </span>
                {productBrand && (
                  <span className="text-cosmic-400 text-sm" data-testid="text-product-brand">
                    {' '}by {productBrand}
                  </span>
                )}
              </div>
            )}
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={i < rating ? 'text-mystical-green' : 'text-cosmic-600'}
                  data-testid={`paw-rating-${i}`}
                >
                  🐾
                </span>
              ))}
              <span className="text-cosmic-400 text-sm ml-2" data-testid="text-rating-value">
                {rating}/5 Paws
              </span>
            </div>
            
            {/* Review Content */}
            <p className="text-cosmic-200 mb-4 leading-relaxed" data-testid="text-review-content">
              {content}
            </p>
            
            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-cosmic-500">
              <span data-testid="text-time-ago">{timeAgo}</span>
              
              {/* Content Flagging Button */}
              {showFlagButton && id && (
                <ContentFlagButton
                  contentType="review"
                  contentId={id}
                  variant="ghost"
                  size="sm"
                  className="text-cosmic-400 hover:text-red-400"
                  showIcon={false}
                />
              )}
              <div className="flex items-center gap-3">
                <button className="hover:text-mystical-green transition-colors" data-testid="button-helpful">
                  ✨ Helpful
                </button>
                <button className="hover:text-starlight-400 transition-colors" data-testid="button-reply">
                  💬 Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
