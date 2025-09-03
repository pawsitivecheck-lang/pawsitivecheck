import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Heart, PlusCircle, PawPrint } from "lucide-react";
import type { PetProfile } from "@shared/schema";

interface SaveToPetButtonProps {
  productId: number;
  productName: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export function SaveToPetButton({ 
  productId, 
  productName, 
  size = "sm", 
  variant = "outline",
  className = ""
}: SaveToPetButtonProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPet, setSelectedPet] = useState<PetProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"saved" | "favorite" | "avoid" | "tried">("saved");

  const { data: pets = [], error } = useQuery<PetProfile[]>({
    queryKey: ["/api/pets"],
    enabled: isAuthenticated,
  });

  // Handle errors from the query
  React.useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  const saveProductMutation = useMutation({
    mutationFn: async (data: { petId: number; productId: number; notes?: string; status: string }) => {
      return await apiRequest(`/api/pets/${data.petId}/saved-products`, "POST", {
        productId: data.productId,
        notes: data.notes || null,
        status: data.status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      setIsDialogOpen(false);
      setSelectedPet(null);
      setNotes("");
      setStatus("saved");
      toast({
        title: "Success",
        description: `${productName} saved to ${selectedPet?.name}'s profile!`,
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      // Handle conflict (product already saved)
      if (error.message.includes("409")) {
        toast({
          title: "Already Saved",
          description: `This product is already saved for ${selectedPet?.name}.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save product. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handlePetSelect = (pet: PetProfile) => {
    setSelectedPet(pet);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedPet) return;
    
    saveProductMutation.mutate({
      petId: selectedPet.id,
      productId,
      notes: notes.trim() || undefined,
      status,
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (pets.length === 0) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`${className} opacity-50 cursor-not-allowed`}
        disabled
        data-testid="button-save-to-pet-disabled"
      >
        <PawPrint className="h-4 w-4 mr-1" />
        No Pets
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={className}
            data-testid="button-save-to-pet"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="h-4 w-4 mr-1" />
            Save for Pet
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
          <DropdownMenuLabel>Save to which pet?</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {pets.map((pet: PetProfile) => (
            <DropdownMenuItem
              key={pet.id}
              onClick={() => handlePetSelect(pet)}
              className="cursor-pointer"
              data-testid={`menu-item-pet-${pet.id}`}
            >
              <div className="flex items-center gap-2">
                <PawPrint className="h-4 w-4" />
                <div>
                  <div className="font-medium">{pet.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{pet.species}</div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => window.location.href = "/pets"}
            className="cursor-pointer text-blue-600"
            data-testid="menu-item-manage-pets"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Manage Pets
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Save Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Product for {selectedPet?.name}</DialogTitle>
            <DialogDescription>Add this product to your pet's saved items with notes and status</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Saving "{productName}" for {selectedPet?.name}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                <SelectTrigger className="mt-1" data-testid="select-product-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="saved">💾 Saved for later</SelectItem>
                  <SelectItem value="favorite">❤️ Favorite product</SelectItem>
                  <SelectItem value="tried">✅ Tried this product</SelectItem>
                  <SelectItem value="avoid">❌ Avoid this product</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Notes (optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this product for your pet..."
                className="mt-1"
                data-testid="textarea-product-notes"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                data-testid="button-cancel-save"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveProductMutation.isPending}
                data-testid="button-confirm-save"
              >
                {saveProductMutation.isPending ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}