import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Flag, AlertTriangle } from "lucide-react";

interface ContentFlagButtonProps {
  contentType: string; // 'review', 'comment', 'product_submission', etc.
  contentId: number;
  className?: string;
  variant?: "ghost" | "outline" | "destructive" | "secondary" | "default";
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
}

export function ContentFlagButton({
  contentType,
  contentId,
  className = "",
  variant = "ghost",
  size = "sm",
  showIcon = true
}: ContentFlagButtonProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const flagContentMutation = useMutation({
    mutationFn: async (data: { contentType: string; contentId: number; reason: string; description?: string }) => {
      return await apiRequest("/api/moderation/report", "POST", data);
    },
    onSuccess: () => {
      setIsOpen(false);
      setReason("");
      setDescription("");
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/dashboard'] });
      
      toast({
        title: "Content Reported",
        description: "Thank you for helping keep our community safe. We'll review this content promptly.",
      });
    },
    onError: (error) => {
      console.error("Error flagging content:", error);
      toast({
        title: "Error",
        description: "Failed to report content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      toast({
        title: "Missing Information",
        description: "Please select a reason for reporting this content.",
        variant: "destructive",
      });
      return;
    }

    flagContentMutation.mutate({
      contentType,
      contentId,
      reason,
      description: description.trim() || undefined,
    });
  };

  const reasons = [
    { value: "spam", label: "Spam or Promotional Content" },
    { value: "inappropriate", label: "Inappropriate or Offensive" },
    { value: "safety_concern", label: "Safety Concern or Misinformation" },
    { value: "fake", label: "Fake or Misleading Review" },
    { value: "harassment", label: "Harassment or Abuse" },
    { value: "other", label: "Other (Please Describe)" },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`text-muted-foreground hover:text-red-600 ${className}`}
          data-testid={`button-flag-${contentType}-${contentId}`}
        >
          {showIcon && <Flag className="h-3 w-3 mr-1" />}
          Flag
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md" data-testid="modal-flag-content">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Report Content
          </DialogTitle>
          <DialogDescription>
            Help us maintain a safe and helpful community by reporting content that violates our guidelines.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Reporting</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger data-testid="select-report-reason">
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {reasons.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Additional Details (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide any additional context that might help our moderators understand the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
              data-testid="textarea-report-description"
            />
            <div className="text-xs text-muted-foreground text-right">
              {description.length}/500 characters
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              data-testid="button-cancel-report"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!reason || flagContentMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-submit-report"
            >
              {flagContentMutation.isPending ? "Reporting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}