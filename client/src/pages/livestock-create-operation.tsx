import React, { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Home } from "lucide-react";

export default function LivestockCreateOperation() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    operationName: "",
    operationType: "",
    city: "",
    state: "",
    totalHeadCount: "",
  });

  const createOperationMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("🚀 Starting API request with data:", data);
      console.log("🔍 Data type:", typeof data);
      console.log("🔍 Data keys:", Object.keys(data));
      
      try {
        console.log("📡 Calling apiRequest...");
        const response = await apiRequest("/api/livestock/operations", "POST", data);
        console.log("✅ API request successful, response:", response);
        return response.json();
      } catch (error) {
        console.error("❌ API request failed:", error);
        console.error("❌ Error type:", typeof error);
        console.error("❌ Error details:", error);
        throw error;
      }
    },
    onSuccess: (operation) => {
      console.log("Operation created successfully:", operation);
      toast({
        title: "Success!",
        description: "Your livestock operation has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/livestock/operations"] });
      navigate("/livestock");
    },
    onError: (error) => {
      console.error("Error creating operation:", error);
      toast({
        title: "Error",
        description: "Failed to create livestock operation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted with data:", formData);
    console.log("Form validation check:");
    console.log("- operationName:", formData.operationName);
    console.log("- operationType:", formData.operationType); 
    console.log("- city:", formData.city);
    console.log("- state:", formData.state);
    
    // Validate required fields
    if (!formData.operationName || !formData.operationType || !formData.city || !formData.state) {
      console.log("Validation failed - missing required fields");
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Validation passed, proceeding with mutation...");
    
    // Get species based on operation type
    const getSpeciesForOperationType = (operationType: string): string[] => {
      switch (operationType) {
        case 'beef-cattle':
        case 'dairy-cattle':
          return ['cattle'];
        case 'swine':
          return ['pigs'];
        case 'poultry':
          return ['chickens'];
        case 'sheep-goat':
          return ['sheep', 'goats'];
        case 'mixed':
          return ['cattle', 'pigs', 'chickens'];
        default:
          return ['cattle'];
      }
    };
    
    const finalData = {
      ...formData,
      totalHeadCount: parseInt(formData.totalHeadCount) || 0,
      primarySpecies: getSpeciesForOperationType(formData.operationType),
    };
    
    console.log("🎯 Final data to submit:", finalData);
    console.log("🎯 Final data stringify:", JSON.stringify(finalData, null, 2));
    console.log("📤 About to call createOperationMutation.mutate...");
    
    try {
      console.log("🔄 Calling mutation...");
      createOperationMutation.mutate(finalData);
      console.log("✅ Mutation called successfully");
    } catch (error) {
      console.error("❌ Error calling mutation:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/livestock")}
          className="mb-4 -ml-4"
          data-testid="button-back-to-livestock"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Livestock Management
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Livestock Operation
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Set up your first livestock operation to start tracking herds, feed, and health records.
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Operation Details
          </CardTitle>
          <CardDescription>
            Provide basic information about your livestock operation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="operationName">Operation Name *</Label>
              <Input
                id="operationName"
                value={formData.operationName}
                onChange={(e) => setFormData({...formData, operationName: e.target.value})}
                placeholder="My Farm"
                required
                data-testid="input-operation-name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="operationType">Operation Type *</Label>
              <Select 
                value={formData.operationType} 
                onValueChange={(value) => setFormData({...formData, operationType: value})}
              >
                <SelectTrigger data-testid="select-operation-type">
                  <SelectValue placeholder="Select operation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beef-cattle">Beef Cattle</SelectItem>
                  <SelectItem value="dairy-cattle">Dairy Cattle</SelectItem>
                  <SelectItem value="swine">Swine</SelectItem>
                  <SelectItem value="poultry">Poultry</SelectItem>
                  <SelectItem value="sheep-goat">Sheep & Goat</SelectItem>
                  <SelectItem value="mixed">Mixed Operation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Enter city"
                  required
                  data-testid="input-city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  placeholder="Enter state"
                  required
                  data-testid="input-state"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalHeadCount">Total Head Count *</Label>
              <Input
                id="totalHeadCount"
                type="number"
                value={formData.totalHeadCount}
                onChange={(e) => setFormData({...formData, totalHeadCount: e.target.value})}
                placeholder="Enter number of animals"
                min="0"
                required
                data-testid="input-head-count"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/livestock")}
                disabled={createOperationMutation.isPending}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createOperationMutation.isPending}
                data-testid="button-create-operation"
              >
                {createOperationMutation.isPending ? "Creating..." : "Create Operation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}