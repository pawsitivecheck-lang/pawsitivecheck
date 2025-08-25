import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Shield, TriangleAlert, AlertCircle, Calendar, Package } from "lucide-react";

export default function Recalls() {
  const { user } = useAuth();

  const { data: recalls, isLoading } = useQuery({
    queryKey: ['/api/recalls'],
  });

  // Type guard to ensure recalls is an array
  const recallsArray = Array.isArray(recalls) ? recalls : [];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return <TriangleAlert className="text-mystical-red" />;
      case 'moderate':
        return <AlertCircle className="text-yellow-500" />;
      case 'low':
        return <Shield className="text-mystical-green" />;
      default:
        return <Shield className="text-cosmic-400" />;
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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Top Ad */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="recalls-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="w-20 h-20 mx-auto bg-mystical-red rounded-full flex items-center justify-center mb-6 animate-pulse">
              <TriangleAlert className="text-3xl text-white" />
            </div>
            <h1 className="font-mystical text-4xl md:text-6xl font-bold text-mystical-red mb-4" data-testid="text-recalls-title">
              Cosmic Recall Alerts
            </h1>
            <p className="text-cosmic-300 text-lg" data-testid="text-recalls-description">
              The universe has spoken - these products must be avoided at all costs
            </p>
          </div>

          {/* Alert Summary */}
          <Card className="cosmic-card mb-8 border-mystical-red/30" data-testid="card-alert-summary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-mystical-red">
                <Shield className="h-5 w-5" />
                Cosmic Warning Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-mystical-red mb-2" data-testid="text-urgent-count">
                    {recallsArray.filter((r: any) => r.severity === 'urgent').length}
                  </div>
                  <p className="text-cosmic-300">Urgent Warnings</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500 mb-2" data-testid="text-moderate-count">
                    {recallsArray.filter((r: any) => r.severity === 'moderate').length}
                  </div>
                  <p className="text-cosmic-300">Moderate Alerts</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-mystical-green mb-2" data-testid="text-low-count">
                    {recallsArray.filter((r: any) => r.severity === 'low').length}
                  </div>
                  <p className="text-cosmic-300">Minor Cautions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mascot Commentary */}
          <Card className="cosmic-card mb-8 border-mystical-purple/30" data-testid="card-mascot-commentary">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-mystical-purple to-cosmic-600 rounded-full flex items-center justify-center mb-4 animate-glow">
                    <Shield className="text-2xl text-starlight-500" />
                  </div>
                  <h3 className="font-mystical text-xl text-mystical-purple mb-2" data-testid="text-aleister-title">Aleister's Warning</h3>
                  <p className="text-cosmic-200 italic" data-testid="text-aleister-warning">
                    "The cosmic winds carry dark omens. These cursed products have been marked by the universe itself for banishment."
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-midnight-600 to-cosmic-700 rounded-full flex items-center justify-center mb-4 animate-glow">
                    <TriangleAlert className="text-2xl text-starlight-500" />
                  </div>
                  <h3 className="font-mystical text-xl text-midnight-400 mb-2" data-testid="text-severus-title">Severus's Decree</h3>
                  <p className="text-cosmic-200 italic" data-testid="text-severus-decree">
                    "Heed these warnings, fellow guardians. The safety of our beloved companions depends upon our vigilance."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recalls List */}
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="cosmic-card animate-pulse" data-testid={`skeleton-recall-${i}`}>
                  <CardContent className="p-6">
                    <div className="h-4 bg-cosmic-700 rounded mb-4"></div>
                    <div className="h-4 bg-cosmic-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-cosmic-700 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recallsArray.length > 0 ? (
            <div className="space-y-6">
              {recallsArray.map((recall: any) => (
                <Card key={recall.id} className={`cosmic-card border-l-4 ${
                  recall.severity === 'urgent' ? 'border-mystical-red' :
                  recall.severity === 'moderate' ? 'border-yellow-500' :
                  'border-mystical-green'
                }`} data-testid={`card-recall-${recall.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(recall.severity)}
                        <div>
                          <h3 className="text-xl font-semibold text-cosmic-100 mb-1" data-testid="text-recall-reason">
                            {recall.reason}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(recall.severity)} data-testid="badge-recall-severity">
                              {recall.severity.toUpperCase()}
                            </Badge>
                            <span className="text-cosmic-400 text-sm" data-testid="text-recall-number">
                              #{recall.recallNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-cosmic-400 text-sm mb-1">
                          <Calendar className="h-4 w-4" />
                          <span data-testid="text-recall-date">
                            {new Date(recall.recallDate).toLocaleDateString()}
                          </span>
                        </div>
                        {recall.source && (
                          <p className="text-cosmic-500 text-xs" data-testid="text-recall-source">
                            Source: {recall.source}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Source Link */}
                    <div className="mb-4 p-3 bg-starlight-500/10 rounded-lg border border-starlight-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-cosmic-300 text-sm font-medium">Official Source</span>
                        <a 
                          href={recall.sourceUrl || (recall.source === 'CPSC' ? 'https://www.cpsc.gov/Recalls' : 'https://www.fda.gov/animal-veterinary/recalls-withdrawals')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-starlight-400 hover:text-starlight-300 text-sm underline flex items-center gap-1"
                          data-testid={`recall-official-source-${recall.id}`}
                        >
                          View {recall.source || 'Official'} Report →
                        </a>
                      </div>
                    </div>

                    {/* Detailed Guidance */}
                    <div className="mb-4 p-4 bg-mystical-red/5 rounded-lg border border-mystical-red/20">
                      <h4 className="text-mystical-red font-semibold mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        What You Should Do
                      </h4>
                      <div className="space-y-2 text-cosmic-200 text-sm">
                        {recall.severity === 'urgent' && (
                          <>
                            <p><strong>IMMEDIATE ACTION REQUIRED:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li>Stop feeding this product to your pet immediately</li>
                              <li>Check if your pet has consumed any of the affected batches</li>
                              <li>Contact your veterinarian if your pet shows any symptoms</li>
                              <li>Dispose of remaining product safely (do not donate or give away)</li>
                              <li>Contact the manufacturer for refund information</li>
                            </ul>
                          </>
                        )}
                        {recall.severity === 'moderate' && (
                          <>
                            <p><strong>PRECAUTIONARY MEASURES:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li>Stop using the affected products</li>
                              <li>Monitor your pet for any adverse reactions</li>
                              <li>Consult your veterinarian if you notice any symptoms</li>
                              <li>Switch to an alternative product</li>
                            </ul>
                          </>
                        )}
                        {recall.severity === 'low' && (
                          <>
                            <p><strong>RECOMMENDED ACTIONS:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li>Consider switching to an alternative when current supply is finished</li>
                              <li>Monitor your pet for any unusual symptoms</li>
                              <li>Keep the product packaging for reference</li>
                            </ul>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Safe Disposal Instructions */}
                    {recall.disposalInstructions && (
                      <div className="mb-4 p-4 bg-cosmic-700/10 rounded-lg border border-cosmic-600/20">
                        <h4 className="text-cosmic-300 font-semibold mb-2 flex items-center gap-2">
                          ♻️ Safe Disposal Instructions
                        </h4>
                        <p className="text-cosmic-200 text-sm leading-relaxed" data-testid={`disposal-instructions-${recall.id}`}>
                          {recall.disposalInstructions}
                        </p>
                        <div className="mt-3 p-2 bg-mystical-red/10 rounded border border-mystical-red/30">
                          <p className="text-mystical-red text-xs font-medium">
                            ⚠️ IMPORTANT: Do not donate, sell, or give away recalled products to others.
                          </p>
                        </div>
                      </div>
                    )}

                    {recall.affectedBatches?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-cosmic-200 font-medium mb-2 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Affected Batches - Check Your Products:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {recall.affectedBatches.map((batch: string, index: number) => (
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
                      <h4 className="text-cosmic-200 font-medium mb-2">Mystical Guidance:</h4>
                      <p className="text-cosmic-300 text-sm" data-testid="text-mystical-guidance">
                        {recall.severity === 'urgent' 
                          ? "Immediately remove this cursed product from your realm. The cosmic forces demand swift action to protect your beloved companions."
                          : recall.severity === 'moderate'
                          ? "Exercise caution with this product. The universe suggests careful consideration before continued use."
                          : "While not immediately dangerous, the cosmic guardians recommend awareness of this minor concern."
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="cosmic-card" data-testid="card-no-recalls">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto bg-mystical-green/20 rounded-full flex items-center justify-center mb-6">
                  <Shield className="text-mystical-green text-2xl" />
                </div>
                <h3 className="font-mystical text-2xl text-mystical-green mb-4" data-testid="text-no-recalls-title">
                  The Realm is Peaceful
                </h3>
                <p className="text-cosmic-300 text-lg mb-6" data-testid="text-no-recalls-description">
                  No cosmic warnings active at this time. The universe smiles upon our pet companions.
                </p>
                <p className="text-cosmic-400 italic" data-testid="text-peace-quote">
                  "In times of peace, we prepare for the storms ahead" - The Audit Syndicate
                </p>
              </CardContent>
            </Card>
          )}

          {/* Admin Actions */}
          {user?.isAdmin && recallsArray.length > 0 && (
            <div className="mt-12">
              <Card className="cosmic-card border-starlight-500/50" data-testid="card-admin-actions">
                <CardHeader>
                  <CardTitle className="text-starlight-400">Syndicate Command Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      className="border-mystical-red text-mystical-red hover:bg-mystical-red/10"
                      data-testid="button-create-recall"
                    >
                      Issue New Cosmic Warning
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-cosmic-600 text-cosmic-300 hover:bg-cosmic-600/10"
                      data-testid="button-manage-recalls"
                    >
                      Manage Active Alerts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
