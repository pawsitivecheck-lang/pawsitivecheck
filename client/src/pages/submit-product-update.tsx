import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AdBanner from "@/components/ad-banner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Upload, ArrowLeft, AlertTriangle } from "lucide-react";
import type { UploadResult } from "@uppy/core";
import { insertProductUpdateSubmissionSchema } from "@shared/schema";
import Footer from "@/components/footer";

const submitUpdateSchema = insertProductUpdateSubmissionSchema.extend({
  productName: z.string().optional(), // For display purposes
  productBrand: z.string().optional(), // For display purposes
  productBarcode: z.string().optional(), // For display purposes
});

type SubmitUpdateData = z.infer<typeof submitUpdateSchema>;

export default function SubmitProductUpdate() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<SubmitUpdateData>({
    resolver: zodResolver(submitUpdateSchema),
    defaultValues: {
      type: "info_correction",
      title: "",
      description: "",
      proposedChanges: {},
      submittedImageUrl: "",
      productName: "",
      productBrand: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitUpdateData) => {
      const submitData = {
        ...data,
        submittedImageUrl: uploadedImageUrl,
        proposedChanges: {
          name: data.productName,
          brand: data.productBrand,
          description: data.description,
        },
      };
      delete submitData.productName;
      delete submitData.productBrand;
      return apiRequest("/api/product-update-submissions", {
        method: "POST",
        body: JSON.stringify(submitData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Submission successful",
        description: "Your product update has been submitted for review",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/product-update-submissions"] });
      setLocation("/");
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your update. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    try {
      const response = await apiRequest("/api/objects/upload", {
        method: "POST",
      }) as { uploadURL: string };
      return {
        method: "PUT" as const,
        url: response.uploadURL,
      };
    } catch (error) {
      console.error("Error getting upload URL:", error);
      throw error;
    }
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    setIsUploading(false);
    if (result.successful && result.successful.length > 0) {
      const uploadUrl = result.successful[0].uploadURL as string;
      setUploadedImageUrl(uploadUrl);
      toast({
        title: "Image uploaded",
        description: "Your product image has been uploaded successfully",
      });
    }
  };

  const onSubmit = (data: SubmitUpdateData) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <AdBanner size="leaderboard" position="submit-product-update-header" />
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="mb-4 text-purple-200 hover:text-white hover:bg-purple-800/20"
              data-testid="link-back-home"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-400" />
              Submit Product Update
              <Sparkles className="h-8 w-8 text-purple-400" />
            </h1>
            <p className="text-purple-200 max-w-2xl mx-auto text-lg">
              Help improve our database by submitting corrections, updates, or new product information.
              Our cosmic review team will verify your submission.
            </p>
          </div>
        </div>

        {/* Warning Notice */}
        <Card className="mb-8 border-orange-500/20 bg-orange-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
              <div className="text-orange-100">
                <h3 className="font-semibold mb-2">Review Process Notice</h3>
                <p className="text-sm">
                  All submissions are reviewed by our admin team before being applied to the database. 
                  This helps maintain accuracy and prevents misinformation. You'll be notified of the review status.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-2xl mx-auto bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Product Update Details</CardTitle>
            <CardDescription className="text-purple-200">
              Fill out the information below to submit your product update or correction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Update Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-200">Update Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger 
                            className="bg-slate-700/50 border-purple-500/30 text-white"
                            data-testid="select-update-type"
                          >
                            <SelectValue placeholder="Select update type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="info_correction">Information Correction</SelectItem>
                          <SelectItem value="image_update">Image Update</SelectItem>
                          <SelectItem value="new_product">New Product Suggestion</SelectItem>
                          <SelectItem value="update">General Update</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-purple-300">
                        Choose the type of update you're submitting
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-200">Update Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief title for your update"
                          className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400"
                          data-testid="input-update-title"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-purple-300">
                        A short, descriptive title for your update
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-200">Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Full product name"
                          className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400"
                          data-testid="input-product-name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-purple-300">
                        The complete name of the product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Product Brand */}
                <FormField
                  control={form.control}
                  name="productBrand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-200">Product Brand</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brand or manufacturer name"
                          className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400"
                          data-testid="input-product-brand"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-purple-300">
                        The brand or manufacturer of the product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Product UPC/Barcode */}
                <FormField
                  control={form.control}
                  name="productBarcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-200">UPC/Barcode (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 012345678906"
                          className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400 font-mono"
                          data-testid="input-product-barcode"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-purple-300">
                        The UPC barcode found on the product packaging
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-200">Update Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the update, correction, or additional information..."
                          className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400 min-h-[120px]"
                          data-testid="textarea-update-description"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-purple-300">
                        Provide detailed information about what you're updating or correcting
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                <div className="space-y-2">
                  <FormLabel className="text-purple-200">Product Image (Optional)</FormLabel>
                  <div className="flex items-center gap-4">
                    <ObjectUploader
                      maxNumberOfFiles={1}
                      maxFileSize={10485760} // 10MB
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleUploadComplete}
                      isLoading={isUploading}
                      buttonClassName="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Product Image
                    </ObjectUploader>
                    {uploadedImageUrl && (
                      <span className="text-green-400 text-sm">
                        ✓ Image uploaded successfully
                      </span>
                    )}
                  </div>
                  <p className="text-purple-300 text-sm">
                    Upload a clear image of the product for verification
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg"
                  data-testid="button-submit-update"
                >
                  {submitMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit for Review"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}