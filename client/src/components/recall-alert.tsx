import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TriangleAlert, AlertCircle, Shield, Calendar, Package } from "lucide-react";

interface RecallAlertProps {
  recall: {
    id: number;
    reason: string;
    severity: string;
    recallDate: string;
    recallNumber?: string;
    affectedBatches?: string[];
    source?: string;
    isActive?: boolean;
  };
}

export default function RecallAlert({ recall }: RecallAlertProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return <TriangleAlert className="text-mystical-red h-5 w-5" />;
      case 'moderate':
        return <AlertCircle className="text-yellow-500 h-5 w-5" />;
      case 'low':
        return <Shield className="text-mystical-green h-5 w-5" />;
      default:
        return <Shield className="text-cosmic-400 h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return 'bg-mystical-red/20 text-mystical-red border-mystical-red';
      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500';
      case 'low':
        return 'bg-mystical-green/20 text-mystical-green border-mystical-green';
      default:
        return 'bg-cosmic-400/20 text-cosmic-400 border-cosmic-400';
    }
  };

  const getMysticalGuidance = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return "The cosmic forces demand immediate action. Remove this cursed product from your realm without delay.";
      case 'moderate':
        return "The universe whispers caution. Exercise wisdom when considering this product's use.";
      case 'low':
        return "A minor disturbance in the cosmic harmony. Awareness is sufficient for now.";
      default:
        return "The cosmic guardians are investigating this matter.";
    }
  };

  return (
    <Card className={`cosmic-card border-l-4 ${
      recall.severity === 'urgent' ? 'border-mystical-red' :
      recall.severity === 'moderate' ? 'border-yellow-500' :
      'border-mystical-green'
    }`} data-testid={`recall-alert-${recall.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {getSeverityIcon(recall.severity)}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-cosmic-100" data-testid="text-recall-reason">
                {recall.reason}
              </h3>
              <Badge className={getSeverityColor(recall.severity)} data-testid="badge-recall-severity">
                {recall.severity.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-cosmic-400 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span data-testid="text-recall-date">
                  {new Date(recall.recallDate).toLocaleDateString()}
                </span>
              </div>
              {recall.recallNumber && (
                <span className="text-cosmic-500" data-testid="text-recall-number">
                  #{recall.recallNumber}
                </span>
              )}
              {recall.source && (
                <span className="text-cosmic-500" data-testid="text-recall-source">
                  Source: {recall.source}
                </span>
              )}
            </div>

            {recall.affectedBatches && recall.affectedBatches.length > 0 && (
              <div className="mb-4">
                <h4 className="text-cosmic-200 font-medium mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Cursed Batches:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recall.affectedBatches.map((batch, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="bg-cosmic-800/50 text-cosmic-300 border-cosmic-600"
                      data-testid={`badge-batch-${index}`}
                    >
                      {batch}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-cosmic-900/30 rounded-lg p-4">
              <h4 className="text-cosmic-200 font-medium mb-2 font-mystical">Cosmic Guidance:</h4>
              <p className="text-cosmic-300 text-sm italic" data-testid="text-mystical-guidance">
                "{getMysticalGuidance(recall.severity)}"
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
