import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";

const reviewFormSchema = z.object({
  productId: z.string().min(1, "Please select a product"),
  rating: z.number().min(1, "Please provide a rating").max(5),
  title: z.string().max(255, "Title too long").optional(),
  content: z.string().min(10, "Review must be at least 10 characters").max(5000, "Review too long"),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  productName?: string;
}

export function ReviewFormModal({ 
  isOpen, 
  onClose, 
  productId, 
  productName 
}: ReviewFormModalProps) {
  const { toast } = useToast();
  const [hoveredRating, setHoveredRating] = useState(0);

  // Fetch products for the dropdown (only if no productId provided)
  const { data: products } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=500');
      return await res.json();
    },
    enabled: !productId && isOpen,
  });

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      productId: productId || "",
      rating: 0,
      title: "",
      content: "",
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      return apiRequest(
        'POST',
        `/api/products/${data.productId}/reviews`,
        {
          rating: data.rating,
          title: data.title || "",
          content: data.content,
        }
      );
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your experience.",
      });
      // Invalidate queries to refresh reviews
      queryClient.invalidateQueries({ queryKey: ['/api/products', variables.productId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/community/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/reviews'] });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting review",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ReviewFormData) => {
    submitReviewMutation.mutate(data);
  };

  const renderStarRating = () => {
    const rating = form.watch("rating");
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => form.setValue("rating", star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none transition-colors"
            data-testid={`star-rating-${star}`}
          >
            <Star
              className={`h-6 w-6 ${
                star <= (hoveredRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating > 0 ? `${rating} out of 5` : "Click to rate"}
        </span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]" data-testid="review-form-modal">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with this product to help other pet owners make informed decisions.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Product Selection - only show if no productId provided */}
            {!productId && (
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Product</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        data-testid="select-product"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a product to review" />
                        </SelectTrigger>
                        <SelectContent>
                          {products?.map((product: any) => (
                            <SelectItem 
                              key={product.id} 
                              value={product.id.toString()}
                              data-testid={`product-option-${product.id}`}
                            >
                              {product.name} - {product.brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {/* Show product name if provided */}
            {productId && productName && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium">Reviewing:</p>
                <p className="text-base">{productName}</p>
              </div>
            )}

            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating *</FormLabel>
                  <FormControl>
                    <div>{renderStarRating()}</div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title (optional) */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Title (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Summarize your experience" 
                      {...field}
                      data-testid="input-review-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your experience with this product. What did your pet think? Any side effects? Would you recommend it?"
                      className="min-h-[120px]"
                      {...field}
                      data-testid="textarea-review-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitReviewMutation.isPending}
                data-testid="button-cancel-review"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitReviewMutation.isPending}
                data-testid="button-submit-review"
              >
                {submitReviewMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}