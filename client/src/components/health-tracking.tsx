import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  TrendingUp, 
  Calendar, 
  Weight, 
  Heart, 
  Activity,
  Stethoscope,
  Camera,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import type { HealthRecord, MedicalEvent } from "@shared/schema";

interface HealthTrackingProps {
  petId: number;
  petName: string;
}

export default function HealthTracking({ petId, petName }: HealthTrackingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showHealthDialog, setShowHealthDialog] = useState(false);
  const [showMedicalDialog, setShowMedicalDialog] = useState(false);
  const [healthForm, setHealthForm] = useState({
    weight: "",
    bodyConditionScore: "",
    energyLevel: "",
    appetiteLevel: "",
    coatCondition: "",
    symptomsSeen: [] as string[],
    behaviorChanges: "",
    productUsed: "",
    productDuration: "",
    notes: ""
  });
  const [medicalForm, setMedicalForm] = useState({
    eventType: "",
    eventDate: "",
    veterinarian: "",
    clinic: "",
    description: "",
    medications: [] as string[],
    followUpRequired: false,
    followUpDate: "",
    cost: "",
    notes: ""
  });

  // Fetch health records
  const { data: healthRecords = [], isLoading: healthLoading } = useQuery<HealthRecord[]>({
    queryKey: [`/api/pets/${petId}/health-records`],
  });

  // Fetch medical events
  const { data: medicalEvents = [], isLoading: medicalLoading } = useQuery<MedicalEvent[]>({
    queryKey: [`/api/pets/${petId}/medical-events`],
  });

  // Create health record mutation
  const createHealthRecordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', `/api/pets/${petId}/health-records`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Health record added successfully!" });
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${petId}/health-records`] });
      setShowHealthDialog(false);
      resetHealthForm();
    },
    onError: () => {
      toast({ title: "Failed to add health record", variant: "destructive" });
    },
  });

  // Create medical event mutation
  const createMedicalEventMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', `/api/pets/${petId}/medical-events`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Medical event added successfully!" });
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${petId}/medical-events`] });
      setShowMedicalDialog(false);
      resetMedicalForm();
    },
    onError: () => {
      toast({ title: "Failed to add medical event", variant: "destructive" });
    },
  });

  const resetHealthForm = () => {
    setHealthForm({
      weight: "",
      bodyConditionScore: "",
      energyLevel: "",
      appetiteLevel: "",
      coatCondition: "",
      symptomsSeen: [],
      behaviorChanges: "",
      productUsed: "",
      productDuration: "",
      notes: ""
    });
  };

  const resetMedicalForm = () => {
    setMedicalForm({
      eventType: "",
      eventDate: "",
      veterinarian: "",
      clinic: "",
      description: "",
      medications: [],
      followUpRequired: false,
      followUpDate: "",
      cost: "",
      notes: ""
    });
  };

  const handleHealthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHealthRecordMutation.mutate({
      ...healthForm,
      weight: healthForm.weight ? parseFloat(healthForm.weight) : null,
      bodyConditionScore: healthForm.bodyConditionScore ? parseInt(healthForm.bodyConditionScore) : null,
      energyLevel: healthForm.energyLevel ? parseInt(healthForm.energyLevel) : null,
      appetiteLevel: healthForm.appetiteLevel ? parseInt(healthForm.appetiteLevel) : null,
      productDuration: healthForm.productDuration ? parseInt(healthForm.productDuration) : null,
    });
  };

  const handleMedicalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMedicalEventMutation.mutate({
      ...medicalForm,
      eventDate: new Date(medicalForm.eventDate).toISOString(),
      followUpDate: medicalForm.followUpDate ? new Date(medicalForm.followUpDate).toISOString() : null,
      cost: medicalForm.cost ? parseFloat(medicalForm.cost) : null,
    });
  };

  const getHealthTrend = () => {
    if (healthRecords.length < 2) return null;
    
    const recent = healthRecords.slice(0, 2);
    const current = recent[0];
    const previous = recent[1];
    
    if (current.weight && previous.weight) {
      const weightChange = parseFloat(current.weight.toString()) - parseFloat(previous.weight.toString());
      return {
        weight: weightChange,
        trend: weightChange > 0 ? 'up' : weightChange < 0 ? 'down' : 'stable'
      };
    }
    return null;
  };

  const healthTrend = getHealthTrend();

  return (
    <div className="space-y-6" data-testid="health-tracking-section">
      {/* Header with Action Buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-cosmic-100 flex items-center gap-2">
            <Heart className="h-6 w-6 text-mystical-red" />
            Long-Term Health Tracking
          </h3>
          <p className="text-cosmic-400 mt-1">
            Monitor {petName}'s health over time to detect trends and patterns
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showHealthDialog} onOpenChange={setShowHealthDialog}>
            <DialogTrigger asChild>
              <Button className="mystical-button" data-testid="button-add-health-record">
                <Plus className="h-4 w-4 mr-2" />
                Health Check
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl cosmic-dialog">
              <DialogHeader>
                <DialogTitle className="text-starlight-400">Record Health Check for {petName}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleHealthSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={healthForm.weight}
                      onChange={(e) => setHealthForm({...healthForm, weight: e.target.value})}
                      className="cosmic-input"
                      placeholder="Current weight"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bodyConditionScore">Body Condition (1-9 scale)</Label>
                    <Select value={healthForm.bodyConditionScore} onValueChange={(value) => setHealthForm({...healthForm, bodyConditionScore: value})}>
                      <SelectTrigger className="cosmic-input">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very thin</SelectItem>
                        <SelectItem value="2">2 - Thin</SelectItem>
                        <SelectItem value="3">3 - Lean</SelectItem>
                        <SelectItem value="4">4 - Slightly underweight</SelectItem>
                        <SelectItem value="5">5 - Ideal weight</SelectItem>
                        <SelectItem value="6">6 - Slightly overweight</SelectItem>
                        <SelectItem value="7">7 - Overweight</SelectItem>
                        <SelectItem value="8">8 - Obese</SelectItem>
                        <SelectItem value="9">9 - Severely obese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="energyLevel">Energy Level (1-5)</Label>
                    <Select value={healthForm.energyLevel} onValueChange={(value) => setHealthForm({...healthForm, energyLevel: value})}>
                      <SelectTrigger className="cosmic-input">
                        <SelectValue placeholder="Energy level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very low</SelectItem>
                        <SelectItem value="2">2 - Low</SelectItem>
                        <SelectItem value="3">3 - Normal</SelectItem>
                        <SelectItem value="4">4 - High</SelectItem>
                        <SelectItem value="5">5 - Very high</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="appetiteLevel">Appetite Level (1-5)</Label>
                    <Select value={healthForm.appetiteLevel} onValueChange={(value) => setHealthForm({...healthForm, appetiteLevel: value})}>
                      <SelectTrigger className="cosmic-input">
                        <SelectValue placeholder="Appetite level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very poor</SelectItem>
                        <SelectItem value="2">2 - Poor</SelectItem>
                        <SelectItem value="3">3 - Normal</SelectItem>
                        <SelectItem value="4">4 - Good</SelectItem>
                        <SelectItem value="5">5 - Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coatCondition">Coat Condition</Label>
                    <Select value={healthForm.coatCondition} onValueChange={(value) => setHealthForm({...healthForm, coatCondition: value})}>
                      <SelectTrigger className="cosmic-input">
                        <SelectValue placeholder="Coat condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="productUsed">Product Currently Using</Label>
                    <Input
                      id="productUsed"
                      value={healthForm.productUsed}
                      onChange={(e) => setHealthForm({...healthForm, productUsed: e.target.value})}
                      className="cosmic-input"
                      placeholder="Food/treat/supplement"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="behaviorChanges">Behavior Changes Noticed</Label>
                  <Textarea
                    id="behaviorChanges"
                    value={healthForm.behaviorChanges}
                    onChange={(e) => setHealthForm({...healthForm, behaviorChanges: e.target.value})}
                    className="cosmic-input"
                    placeholder="Any changes in behavior, activity, or habits..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={healthForm.notes}
                    onChange={(e) => setHealthForm({...healthForm, notes: e.target.value})}
                    className="cosmic-input"
                    placeholder="Any other observations or notes..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowHealthDialog(false)}
                    disabled={createHealthRecordMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="mystical-button"
                    disabled={createHealthRecordMutation.isPending}
                  >
                    {createHealthRecordMutation.isPending ? "Saving..." : "Save Health Record"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showMedicalDialog} onOpenChange={setShowMedicalDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-starlight-500/30 text-starlight-400" data-testid="button-add-medical-event">
                <Stethoscope className="h-4 w-4 mr-2" />
                Medical Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl cosmic-dialog">
              <DialogHeader>
                <DialogTitle className="text-starlight-400">Record Medical Event for {petName}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleMedicalSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select value={medicalForm.eventType} onValueChange={(value) => setMedicalForm({...medicalForm, eventType: value})}>
                      <SelectTrigger className="cosmic-input">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vaccination">Vaccination</SelectItem>
                        <SelectItem value="checkup">Regular Checkup</SelectItem>
                        <SelectItem value="illness">Illness</SelectItem>
                        <SelectItem value="injury">Injury</SelectItem>
                        <SelectItem value="surgery">Surgery</SelectItem>
                        <SelectItem value="dental">Dental Cleaning</SelectItem>
                        <SelectItem value="emergency">Emergency Visit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={medicalForm.eventDate}
                      onChange={(e) => setMedicalForm({...medicalForm, eventDate: e.target.value})}
                      className="cosmic-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="veterinarian">Veterinarian</Label>
                    <Input
                      id="veterinarian"
                      value={medicalForm.veterinarian}
                      onChange={(e) => setMedicalForm({...medicalForm, veterinarian: e.target.value})}
                      className="cosmic-input"
                      placeholder="Dr. Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="clinic">Clinic/Hospital</Label>
                    <Input
                      id="clinic"
                      value={medicalForm.clinic}
                      onChange={(e) => setMedicalForm({...medicalForm, clinic: e.target.value})}
                      className="cosmic-input"
                      placeholder="Clinic name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={medicalForm.description}
                    onChange={(e) => setMedicalForm({...medicalForm, description: e.target.value})}
                    className="cosmic-input"
                    placeholder="Describe the medical event, treatment, diagnosis..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cost">Cost ($)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={medicalForm.cost}
                      onChange={(e) => setMedicalForm({...medicalForm, cost: e.target.value})}
                      className="cosmic-input"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="followUpDate">Follow-up Date (if any)</Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      value={medicalForm.followUpDate}
                      onChange={(e) => setMedicalForm({...medicalForm, followUpDate: e.target.value, followUpRequired: e.target.value !== ""})}
                      className="cosmic-input"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={medicalForm.notes}
                    onChange={(e) => setMedicalForm({...medicalForm, notes: e.target.value})}
                    className="cosmic-input"
                    placeholder="Any additional information..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowMedicalDialog(false)}
                    disabled={createMedicalEventMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="mystical-button"
                    disabled={createMedicalEventMutation.isPending}
                  >
                    {createMedicalEventMutation.isPending ? "Saving..." : "Save Medical Event"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Health Overview Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cosmic-card" data-testid="card-recent-health">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-mystical-green/20 rounded-full flex items-center justify-center">
                <Weight className="h-6 w-6 text-mystical-green" />
              </div>
              <div>
                <p className="text-sm text-cosmic-400">Latest Weight</p>
                {healthRecords.length > 0 && healthRecords[0].weight ? (
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-cosmic-100">
                      {healthRecords[0].weight} lbs
                    </p>
                    {healthTrend && (
                      <Badge 
                        variant="outline" 
                        className={
                          healthTrend.trend === 'up' ? 'border-yellow-500 text-yellow-500' :
                          healthTrend.trend === 'down' ? 'border-blue-500 text-blue-500' :
                          'border-mystical-green text-mystical-green'
                        }
                      >
                        <TrendingUp className={`h-3 w-3 mr-1 ${healthTrend.trend === 'down' ? 'transform rotate-180' : ''}`} />
                        {Math.abs(healthTrend.weight).toFixed(1)} lbs
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-cosmic-300">No records yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cosmic-card" data-testid="card-health-records">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-starlight-500/20 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-starlight-500" />
              </div>
              <div>
                <p className="text-sm text-cosmic-400">Health Records</p>
                <p className="text-lg font-semibold text-cosmic-100">{healthRecords.length}</p>
                <p className="text-xs text-cosmic-400">
                  {healthRecords.length > 0 ? `Last: ${new Date(healthRecords[0].recordDate).toLocaleDateString()}` : 'Start tracking today'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cosmic-card" data-testid="card-medical-events">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-mystical-red/20 rounded-full flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-mystical-red" />
              </div>
              <div>
                <p className="text-sm text-cosmic-400">Medical Events</p>
                <p className="text-lg font-semibold text-cosmic-100">{medicalEvents.length}</p>
                <p className="text-xs text-cosmic-400">
                  {medicalEvents.filter(e => e.followUpRequired).length} need follow-up
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Health Records */}
      {healthRecords.length > 0 && (
        <Card className="cosmic-card" data-testid="card-health-timeline">
          <CardHeader>
            <CardTitle className="text-starlight-400 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Health Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {healthRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="border border-cosmic-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-cosmic-400" />
                      <span className="text-cosmic-200 font-medium">
                        {new Date(record.recordDate).toLocaleDateString()}
                      </span>
                      {record.vetVisit && (
                        <Badge variant="outline" className="border-mystical-green text-mystical-green">
                          <Stethoscope className="h-3 w-3 mr-1" />
                          Vet Visit
                        </Badge>
                      )}
                    </div>
                    <div className="text-right text-sm">
                      {record.weight && (
                        <div className="text-cosmic-300">Weight: {record.weight} lbs</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    {record.energyLevel && (
                      <div className="text-sm">
                        <span className="text-cosmic-400">Energy:</span>
                        <span className="text-cosmic-200 ml-1">{record.energyLevel}/5</span>
                      </div>
                    )}
                    {record.appetiteLevel && (
                      <div className="text-sm">
                        <span className="text-cosmic-400">Appetite:</span>
                        <span className="text-cosmic-200 ml-1">{record.appetiteLevel}/5</span>
                      </div>
                    )}
                    {record.bodyConditionScore && (
                      <div className="text-sm">
                        <span className="text-cosmic-400">Body Condition:</span>
                        <span className="text-cosmic-200 ml-1">{record.bodyConditionScore}/9</span>
                      </div>
                    )}
                    {record.coatCondition && (
                      <div className="text-sm">
                        <span className="text-cosmic-400">Coat:</span>
                        <span className="text-cosmic-200 ml-1 capitalize">{record.coatCondition}</span>
                      </div>
                    )}
                  </div>

                  {record.productUsed && (
                    <div className="text-sm mb-2">
                      <span className="text-cosmic-400">Product:</span>
                      <span className="text-cosmic-200 ml-1">{record.productUsed}</span>
                      {record.productDuration && (
                        <span className="text-cosmic-400 ml-2">({record.productDuration} days)</span>
                      )}
                    </div>
                  )}
                  
                  {record.behaviorChanges && (
                    <div className="text-sm mb-2">
                      <span className="text-cosmic-400">Behavior:</span>
                      <p className="text-cosmic-200 mt-1">{record.behaviorChanges}</p>
                    </div>
                  )}
                  
                  {record.notes && (
                    <div className="text-sm">
                      <span className="text-cosmic-400">Notes:</span>
                      <p className="text-cosmic-200 mt-1">{record.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Medical Events */}
      {medicalEvents.length > 0 && (
        <Card className="cosmic-card" data-testid="card-medical-timeline">
          <CardHeader>
            <CardTitle className="text-starlight-400 flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Recent Medical Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {medicalEvents.slice(0, 10).map((event) => (
                <div key={event.id} className="border border-cosmic-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-cosmic-400" />
                      <span className="text-cosmic-200 font-medium">
                        {new Date(event.eventDate).toLocaleDateString()}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={
                          event.eventType === 'emergency' ? 'border-mystical-red text-mystical-red' :
                          event.eventType === 'vaccination' ? 'border-mystical-green text-mystical-green' :
                          'border-starlight-500 text-starlight-500'
                        }
                      >
                        {event.eventType}
                      </Badge>
                      {event.followUpRequired && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          <Clock className="h-3 w-3 mr-1" />
                          Follow-up needed
                        </Badge>
                      )}
                    </div>
                    {event.cost && (
                      <div className="text-cosmic-300 font-medium">${event.cost}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-cosmic-200">{event.description}</p>
                  </div>

                  <div className="text-sm space-y-1">
                    {event.veterinarian && (
                      <div>
                        <span className="text-cosmic-400">Veterinarian:</span>
                        <span className="text-cosmic-200 ml-1">{event.veterinarian}</span>
                      </div>
                    )}
                    {event.clinic && (
                      <div>
                        <span className="text-cosmic-400">Clinic:</span>
                        <span className="text-cosmic-200 ml-1">{event.clinic}</span>
                      </div>
                    )}
                    {event.followUpDate && (
                      <div>
                        <span className="text-cosmic-400">Follow-up:</span>
                        <span className="text-cosmic-200 ml-1">
                          {new Date(event.followUpDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {event.notes && (
                    <div className="text-sm mt-2">
                      <span className="text-cosmic-400">Notes:</span>
                      <p className="text-cosmic-200 mt-1">{event.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {healthRecords.length === 0 && medicalEvents.length === 0 && (
        <Card className="cosmic-card" data-testid="card-empty-health">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-cosmic-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-cosmic-400" />
            </div>
            <h3 className="text-xl font-semibold text-cosmic-200 mb-2">Start Tracking {petName}'s Health</h3>
            <p className="text-cosmic-400 mb-6 max-w-md mx-auto">
              Begin monitoring your pet's health over time to identify trends, track product effectiveness, and maintain comprehensive medical records.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setShowHealthDialog(true)} className="mystical-button">
                <Plus className="h-4 w-4 mr-2" />
                First Health Check
              </Button>
              <Button onClick={() => setShowMedicalDialog(true)} variant="outline" className="border-starlight-500/30 text-starlight-400">
                <Stethoscope className="h-4 w-4 mr-2" />
                Medical Event
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}