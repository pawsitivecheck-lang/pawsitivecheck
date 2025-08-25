import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVeterinaryOfficeSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Phone, 
  Globe, 
  Clock,
  Shield,
  Building2,
  Search
} from "lucide-react";
import Footer from "@/components/footer";

type VeterinaryOffice = {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website?: string;
  email?: string;
  rating?: string;
  reviewCount: number;
  services?: string[];
  specialties?: string[];
  hours?: Record<string, string>;
  emergencyServices: boolean;
  acceptsWalkIns: boolean;
  languages?: string[];
  description?: string;
  isActive: boolean;
  createdAt: string;
};

type VetOfficeForm = z.infer<typeof insertVeterinaryOfficeSchema>;

const vetOfficeFormSchema = insertVeterinaryOfficeSchema.extend({
  services: z.string().optional(),
  specialties: z.string().optional(),
  languages: z.string().optional(),
  hours: z.string().optional(),
});

export default function VetAdmin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingOffice, setEditingOffice] = useState<VeterinaryOffice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof vetOfficeFormSchema>>({
    resolver: zodResolver(vetOfficeFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      website: "",
      email: "",
      description: "",
      emergencyServices: false,
      acceptsWalkIns: false,
      services: "",
      specialties: "",
      languages: "",
      hours: "",
    },
  });

  // Fetch vet offices
  const { data: offices = [], isLoading } = useQuery({
    queryKey: ['/api/vets', search],
    queryFn: async () => {
      const response = await fetch(`/api/vets?search=${search}`);
      if (!response.ok) throw new Error('Failed to fetch vet offices');
      return response.json();
    },
  });

  // Create vet office mutation
  const createOfficeMutation = useMutation({
    mutationFn: async (data: VetOfficeForm) => {
      const response = await fetch('/api/vets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create vet office');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vets'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Veterinary office created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create veterinary office",
        variant: "destructive",
      });
    },
  });

  // Update vet office mutation
  const updateOfficeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<VetOfficeForm> }) => {
      const response = await fetch(`/api/vets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update vet office');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vets'] });
      setIsDialogOpen(false);
      setEditingOffice(null);
      form.reset();
      toast({
        title: "Success",
        description: "Veterinary office updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update veterinary office",
        variant: "destructive",
      });
    },
  });

  // Delete vet office mutation
  const deleteOfficeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/vets/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete vet office');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vets'] });
      toast({
        title: "Success",
        description: "Veterinary office deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete veterinary office",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof vetOfficeFormSchema>) => {
    const transformedData = {
      ...data,
      services: data.services ? data.services.split(',').map(s => s.trim()) : [],
      specialties: data.specialties ? data.specialties.split(',').map(s => s.trim()) : [],
      languages: data.languages ? data.languages.split(',').map(s => s.trim()) : [],
      hours: data.hours ? JSON.parse(data.hours) : {},
    };

    if (editingOffice) {
      updateOfficeMutation.mutate({ id: editingOffice.id, data: transformedData });
    } else {
      createOfficeMutation.mutate(transformedData);
    }
  };

  const handleEdit = (office: VeterinaryOffice) => {
    setEditingOffice(office);
    form.reset({
      name: office.name,
      address: office.address,
      city: office.city,
      state: office.state,
      zipCode: office.zipCode,
      phone: office.phone,
      website: office.website || "",
      email: office.email || "",
      description: office.description || "",
      emergencyServices: office.emergencyServices,
      acceptsWalkIns: office.acceptsWalkIns,
      services: office.services?.join(', ') || "",
      specialties: office.specialties?.join(', ') || "",
      languages: office.languages?.join(', ') || "",
      hours: office.hours ? JSON.stringify(office.hours, null, 2) : "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this veterinary office?")) {
      deleteOfficeMutation.mutate(id);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card text-center p-8">
              <Shield className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Admin Access Required</h1>
              <p className="text-muted-foreground">This page is restricted to administrators only.</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Veterinary Office Management</h1>
            <p className="text-muted-foreground">Manage veterinary offices in the database</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search veterinary offices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-vets"
                />
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="shrink-0"
                  onClick={() => {
                    setEditingOffice(null);
                    form.reset();
                  }}
                  data-testid="button-add-vet"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vet Office
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingOffice ? "Edit Veterinary Office" : "Add New Veterinary Office"}
                  </DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Practice Name *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-vet-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-vet-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-vet-address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-vet-city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-vet-state" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-vet-zip" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-vet-website" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-vet-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} data-testid="input-vet-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="services"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Services (comma-separated)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="General Wellness Exams, Vaccinations, Surgery, Dental Care"
                              data-testid="input-vet-services"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialties"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialties (comma-separated)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Small Animal Care, Emergency Medicine, Surgery"
                              data-testid="input-vet-specialties"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hours (JSON format)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder='{"Monday": "8:00 AM - 6:00 PM", "Tuesday": "8:00 AM - 6:00 PM"}'
                              data-testid="input-vet-hours"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 pt-4 border-t border-border">
                      <Button
                        type="submit"
                        disabled={createOfficeMutation.isPending || updateOfficeMutation.isPending}
                        data-testid="button-save-vet"
                      >
                        {editingOffice ? "Update Office" : "Create Office"}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingOffice(null);
                          form.reset();
                        }}
                        data-testid="button-cancel-vet"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Offices List */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading veterinary offices...</p>
              </div>
            ) : offices.length === 0 ? (
              <Card className="bg-card text-center p-8" data-testid="card-no-vets">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Veterinary Offices</h3>
                <p className="text-muted-foreground mb-4">
                  {search ? `No offices found matching "${search}"` : "No offices have been added yet"}
                </p>
              </Card>
            ) : (
              <div className="grid gap-6">
                {offices.map((office: VeterinaryOffice) => (
                  <Card key={office.id} className="bg-card" data-testid={`vet-card-${office.id}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">{office.name}</h3>
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">
                              {office.address}, {office.city}, {office.state} {office.zipCode}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm">{office.phone}</span>
                          </div>
                          {office.website && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Globe className="h-4 w-4" />
                              <a 
                                href={office.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:text-primary transition-colors"
                              >
                                Visit Website
                              </a>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(office)}
                            data-testid={`button-edit-vet-${office.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDelete(office.id)}
                            data-testid={`button-delete-vet-${office.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {office.services && office.services.length > 0 && (
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Services</h4>
                            <div className="flex flex-wrap gap-1">
                              {office.services.slice(0, 3).map((service, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                              {office.services.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{office.services.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {office.specialties && office.specialties.length > 0 && (
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Specialties</h4>
                            <div className="flex flex-wrap gap-1">
                              {office.specialties.slice(0, 3).map((specialty, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                              {office.specialties.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{office.specialties.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        {office.emergencyServices && (
                          <Badge variant="destructive" className="text-xs">
                            🚨 Emergency Services
                          </Badge>
                        )}
                        {office.acceptsWalkIns && (
                          <Badge variant="secondary" className="text-xs">
                            Walk-ins Accepted
                          </Badge>
                        )}
                        <Badge variant={office.isActive ? "default" : "secondary"} className="text-xs">
                          {office.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}