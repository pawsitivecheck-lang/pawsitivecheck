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
        return <Shield className="text-blue-400 h-5 w-5" />;
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
        return 'bg-blue-500/20 text-blue-400 border-blue-400';
    }
  };

  const getSafetyGuidance = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return "Immediate action required. Discontinue use of this product and consult your veterinarian.";
      case 'moderate':
        return "Exercise caution when using this product. Monitor your pet closely for any adverse reactions.";
      case 'low':
        return "Low-risk recall. Stay informed and monitor for any updates from the manufacturer.";
      default:
        return "Our safety team is reviewing this recall for further details.";
    }
  };

  return (
    <Card className={`border-l-4 ${
      recall.severity === 'urgent' ? 'border-mystical-red' :
      recall.severity === 'moderate' ? 'border-yellow-500' :
      'border-mystical-green'
    }`} data-testid={`recall-alert-${recall.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {getSeverityIcon(recall.severity)}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900" data-testid="text-recall-reason">
                {recall.reason}
              </h3>
              <Badge className={getSeverityColor(recall.severity)} data-testid="badge-recall-severity">
                {recall.severity.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span data-testid="text-recall-date">
                  {new Date(recall.recallDate).toLocaleDateString()}
                </span>
              </div>
              {recall.recallNumber && (
                <span className="text-gray-500" data-testid="text-recall-number">
                  #{recall.recallNumber}
                </span>
              )}
              {recall.source && (
                <span className="text-gray-500" data-testid="text-recall-source">
                  Source: {recall.source}
                </span>
              )}
            </div>

            {recall.affectedBatches && recall.affectedBatches.length > 0 && (
              <div className="mb-4">
                <h4 className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Affected Batches:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recall.affectedBatches.map((batch, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="bg-gray-100 text-gray-700 border-gray-300"
                      data-testid={`badge-batch-${index}`}
                    >
                      {batch}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-blue-700 font-medium mb-2">Safety Guidance:</h4>
              <p className="text-gray-700 text-sm" data-testid="text-safety-guidance">
                {getSafetyGuidance(recall.severity)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
