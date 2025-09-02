import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdBanner from "@/components/ad-banner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Eye, CheckCircle, XCircle, Clock, FileText, Calendar, User, Package } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import type { ProductUpdateSubmission } from "@shared/schema";
import ThemeToggle from "@/components/theme-toggle";
import Footer from "@/components/footer";

type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'in_review';

export default function AdminProductSubmissions() {
  // All hooks must be called at the top of the component
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ProductUpdateSubmission | null>(null);
  const [reviewStatus, setReviewStatus] = useState<SubmissionStatus>('pending');
  const [adminNotes, setAdminNotes] = useState('');

  // Hooks must always be called, use enabled to control when query runs
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['/api/admin/product-update-submissions', selectedStatus],
    queryFn: () => {
      const url = selectedStatus === 'all' 
        ? '/api/admin/product-update-submissions'
        : `/api/admin/product-update-submissions?status=${selectedStatus}`;
      return apiRequest(url);
    },
    enabled: !authLoading && user?.isAdmin,
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: number; status: string; adminNotes: string }) => {
      return apiRequest(`/api/admin/product-update-submissions/${id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ status, adminNotes }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "The submission has been reviewed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/product-update-submissions'] });
      setReviewDialogOpen(false);
      setSelectedSubmission(null);
      setAdminNotes('');
    },
    onError: (error) => {
      console.error('Review error:', error);
      toast({
        title: "Review failed",
        description: "There was an error submitting the review",
        variant: "destructive",
      });
    },
  });

  // Conditional logic after all hooks are called
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-red-500/20">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
            <p className="text-gray-300">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'in_review':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"><Eye className="h-3 w-3 mr-1" />In Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const openReviewDialog = (submission: ProductUpdateSubmission) => {
    setSelectedSubmission(submission);
    setReviewStatus(submission.status as SubmissionStatus);
    setAdminNotes(submission.adminNotes || '');
    setReviewDialogOpen(true);
  };

  const handleReviewSubmit = () => {
    if (!selectedSubmission) return;
    
    reviewMutation.mutate({
      id: selectedSubmission.id,
      status: reviewStatus,
      adminNotes,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <AdBanner size="leaderboard" position="admin-product-submissions-header" />
        
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-400" />
              Product Update Submissions
              <Sparkles className="h-8 w-8 text-purple-400" />
            </h1>
            <p className="text-purple-200 max-w-2xl mx-auto text-lg">
              Review and manage product update submissions from the community
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <Card className="mb-8 bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Filter Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[200px]">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white" data-testid="select-filter-status">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all">All Submissions</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
            <p className="text-purple-200 mt-4">Loading submissions...</p>
          </div>
        ) : submissions?.length === 0 ? (
          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="pt-8 text-center">
              <FileText className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Submissions Found</h3>
              <p className="text-purple-200">No product update submissions match your current filter.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {submissions?.map((submission: ProductUpdateSubmission) => (
              <Card key={submission.id} className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white flex items-center gap-3">
                        <Package className="h-5 w-5 text-purple-400" />
                        {submission.title}
                        {getStatusBadge(submission.status)}
                      </CardTitle>
                      <CardDescription className="text-purple-200 mt-2">
                        Type: {submission.type.replace('_', ' ').toUpperCase()} • 
                        Submitted {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => openReviewDialog(submission)}
                      className="bg-purple-600 hover:bg-purple-700"
                      data-testid={`button-review-${submission.id}`}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-purple-200 mb-2">Description:</h4>
                      <p className="text-gray-300">{submission.description}</p>
                    </div>
                    
                    {submission.proposedChanges && typeof submission.proposedChanges === 'object' && (
                      <div>
                        <h4 className="font-medium text-purple-200 mb-2">Proposed Changes:</h4>
                        <div className="bg-slate-700/30 p-3 rounded-lg">
                          <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                            {JSON.stringify(submission.proposedChanges, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-sm text-purple-300">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Submitter: {submission.submittedByUserId}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {submission.adminNotes && (
                      <div>
                        <h4 className="font-medium text-purple-200 mb-2">Admin Notes:</h4>
                        <p className="text-gray-300 bg-slate-700/30 p-3 rounded-lg">{submission.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="bg-slate-800 border-purple-500/30 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Product Update Submission</DialogTitle>
              <DialogDescription className="text-purple-200">
                Review and provide feedback on this product update submission
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {selectedSubmission && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-purple-200 mb-2">Submission Details:</h4>
                    <div className="bg-slate-700/30 p-4 rounded-lg space-y-2">
                      <p><strong>Title:</strong> {selectedSubmission.title}</p>
                      <p><strong>Type:</strong> {selectedSubmission.type}</p>
                      <p><strong>Description:</strong> {selectedSubmission.description}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-purple-200 font-medium mb-2">Review Status</label>
                    <Select value={reviewStatus} onValueChange={(value) => setReviewStatus(value as SubmissionStatus)}>
                      <SelectTrigger className="bg-slate-700/50 border-purple-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_review">In Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-purple-200 font-medium mb-2">Admin Notes</label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="bg-slate-700/50 border-purple-500/30 text-white"
                      placeholder="Add notes about this review..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setReviewDialogOpen(false)}
                      className="border-purple-500/30 text-purple-200 hover:bg-purple-900/20"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleReviewSubmit}
                      disabled={reviewMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {reviewMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  );
}