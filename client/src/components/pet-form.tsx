import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import type { PetProfile } from "@shared/schema";

const petFormSchema = z.object({
  name: z.string().min(1, "Pet name is required").max(100, "Name too long"),
  species: z.string().min(1, "Species is required"),
  breed: z.string(),
  age: z.number().min(0).max(50),
  weight: z.string(),
  weightUnit: z.string().default("lbs"),
  gender: z.enum(["male", "female", "unknown"]),
  isSpayedNeutered: z.boolean(),
  profileImageUrl: z.string(),
  notes: z.string(),
});

type PetFormData = z.infer<typeof petFormSchema>;

interface PetFormProps {
  initialData?: Partial<PetProfile>;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function PetForm({ initialData, onSubmit, isLoading }: PetFormProps) {
  const [allergies, setAllergies] = useState<string[]>(initialData?.allergies || []);
  const [medicalConditions, setMedicalConditions] = useState<string[]>(initialData?.medicalConditions || []);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(initialData?.dietaryRestrictions || []);
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedicalCondition, setNewMedicalCondition] = useState("");
  const [newDietaryRestriction, setNewDietaryRestriction] = useState("");

  const form = useForm<PetFormData>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      species: initialData?.species ?? "",
      breed: initialData?.breed ?? "",
      age: initialData?.age ?? 0,
      weight: initialData?.weight?.toString() ?? "",
      weightUnit: initialData?.weightUnit ?? "lbs",
      gender: (initialData?.gender as "male" | "female" | "unknown") ?? "unknown",
      isSpayedNeutered: initialData?.isSpayedNeutered ?? false,
      profileImageUrl: initialData?.profileImageUrl ?? "",
      notes: initialData?.notes ?? "",
    },
  });

  const handleSubmit = (data: PetFormData) => {
    const formData = {
      ...data,
      age: data.age > 0 ? Number(data.age) : null,
      weight: data.weight?.trim() ? data.weight.trim() : null,
      breed: data.breed?.trim() ? data.breed.trim() : null,
      allergies: allergies.length > 0 ? allergies : null,
      medicalConditions: medicalConditions.length > 0 ? medicalConditions : null,
      dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : null,
      profileImageUrl: data.profileImageUrl?.trim() ? data.profileImageUrl.trim() : null,
      notes: data.notes?.trim() ? data.notes.trim() : null,
    };
    onSubmit(formData);
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter(a => a !== allergy));
  };

  const addMedicalCondition = () => {
    if (newMedicalCondition.trim() && !medicalConditions.includes(newMedicalCondition.trim())) {
      setMedicalConditions([...medicalConditions, newMedicalCondition.trim()]);
      setNewMedicalCondition("");
    }
  };

  const removeMedicalCondition = (condition: string) => {
    setMedicalConditions(medicalConditions.filter(c => c !== condition));
  };

  const addDietaryRestriction = () => {
    if (newDietaryRestriction.trim() && !dietaryRestrictions.includes(newDietaryRestriction.trim())) {
      setDietaryRestrictions([...dietaryRestrictions, newDietaryRestriction.trim()]);
      setNewDietaryRestriction("");
    }
  };

  const removeDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions(dietaryRestrictions.filter(r => r !== restriction));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pet Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter pet name" {...field} data-testid="input-pet-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Species *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-species">
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Traditional Pets */}
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="bird">Bird</SelectItem>
                    <SelectItem value="fish">Fish</SelectItem>
                    <SelectItem value="rabbit">Rabbit</SelectItem>
                    <SelectItem value="hamster">Hamster</SelectItem>
                    <SelectItem value="guinea-pig">Guinea Pig</SelectItem>
                    <SelectItem value="ferret">Ferret</SelectItem>
                    <SelectItem value="chinchilla">Chinchilla</SelectItem>
                    
                    {/* Farm Animals */}
                    <SelectItem value="cattle">Cattle</SelectItem>
                    <SelectItem value="sheep">Sheep</SelectItem>
                    <SelectItem value="goat">Goat</SelectItem>
                    <SelectItem value="pig">Pig</SelectItem>
                    <SelectItem value="horse">Horse</SelectItem>
                    <SelectItem value="chicken">Chicken</SelectItem>
                    <SelectItem value="duck">Duck</SelectItem>
                    <SelectItem value="turkey">Turkey</SelectItem>
                    <SelectItem value="llama">Llama</SelectItem>
                    <SelectItem value="alpaca">Alpaca</SelectItem>
                    
                    {/* Exotic Pets */}
                    <SelectItem value="snake">Snake</SelectItem>
                    <SelectItem value="lizard">Lizard</SelectItem>
                    <SelectItem value="turtle">Turtle</SelectItem>
                    <SelectItem value="gecko">Gecko</SelectItem>
                    <SelectItem value="bearded-dragon">Bearded Dragon</SelectItem>
                    <SelectItem value="parrot">Parrot</SelectItem>
                    <SelectItem value="cockatiel">Cockatiel</SelectItem>
                    <SelectItem value="canary">Canary</SelectItem>
                    <SelectItem value="hedgehog">Hedgehog</SelectItem>
                    <SelectItem value="sugar-glider">Sugar Glider</SelectItem>
                    <SelectItem value="axolotl">Axolotl</SelectItem>
                    <SelectItem value="hermit-crab">Hermit Crab</SelectItem>
                    <SelectItem value="tarantula">Tarantula</SelectItem>
                    <SelectItem value="scorpion">Scorpion</SelectItem>
                    <SelectItem value="tree-frog">Tree Frog</SelectItem>
                    <SelectItem value="betta">Betta Fish</SelectItem>
                    <SelectItem value="angelfish">Angelfish</SelectItem>
                    <SelectItem value="clownfish">Clownfish</SelectItem>
                    
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl>
                  <Input placeholder="Enter breed (optional)" {...field} data-testid="input-breed" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (years)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter age"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    data-testid="input-age"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input placeholder="Enter weight" {...field} data-testid="input-weight" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weightUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-weight-unit">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isSpayedNeutered"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="checkbox-spayed-neutered"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Spayed/Neutered</FormLabel>
                <FormDescription>
                  Check if your pet has been spayed or neutered
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profileImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/pet-image.jpg" {...field} data-testid="input-image-url" />
              </FormControl>
              <FormDescription>
                Optional: Enter a URL for your pet's profile picture
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Allergies */}
        <div className="space-y-3">
          <FormLabel>Allergies</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add allergy"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
              data-testid="input-new-allergy"
            />
            <Button type="button" onClick={addAllergy} variant="outline" data-testid="button-add-allergy">
              Add
            </Button>
          </div>
          {allergies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allergies.map((allergy) => (
                <Badge key={allergy} variant="secondary" className="flex items-center gap-1">
                  {allergy}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => removeAllergy(allergy)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Medical Conditions */}
        <div className="space-y-3">
          <FormLabel>Medical Conditions</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add medical condition"
              value={newMedicalCondition}
              onChange={(e) => setNewMedicalCondition(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedicalCondition())}
              data-testid="input-new-medical-condition"
            />
            <Button type="button" onClick={addMedicalCondition} variant="outline" data-testid="button-add-medical-condition">
              Add
            </Button>
          </div>
          {medicalConditions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {medicalConditions.map((condition) => (
                <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                  {condition}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => removeMedicalCondition(condition)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Dietary Restrictions */}
        <div className="space-y-3">
          <FormLabel>Dietary Restrictions</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add dietary restriction"
              value={newDietaryRestriction}
              onChange={(e) => setNewDietaryRestriction(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDietaryRestriction())}
              data-testid="input-new-dietary-restriction"
            />
            <Button type="button" onClick={addDietaryRestriction} variant="outline" data-testid="button-add-dietary-restriction">
              Add
            </Button>
          </div>
          {dietaryRestrictions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {dietaryRestrictions.map((restriction) => (
                <Badge key={restriction} variant="secondary" className="flex items-center gap-1">
                  {restriction}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => removeDietaryRestriction(restriction)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about your pet..."
                  className="min-h-[100px]"
                  {...field}
                  data-testid="textarea-notes"
                />
              </FormControl>
              <FormDescription>
                Any additional information about your pet's personality, preferences, or special needs
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isLoading} data-testid="button-save-pet">
            {isLoading ? "Saving..." : initialData ? "Update Pet" : "Create Pet"}
          </Button>
        </div>
      </form>
    </Form>
  );
}