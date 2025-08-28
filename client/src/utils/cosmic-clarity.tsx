import { CheckCircle, AlertTriangle, XCircle, Eye } from "lucide-react";

export const getCosmicClarityIcon = (clarity: string) => {
  switch (clarity) {
    case 'blessed':
      return <CheckCircle className="text-mystical-green h-4 w-4" />;
    case 'questionable':
      return <AlertTriangle className="text-yellow-500 h-4 w-4" />;
    case 'cursed':
      return <XCircle className="text-mystical-red h-4 w-4" />;
    default:
      return <Eye className="text-cosmic-400 h-4 w-4" />;
  }
};

export const getCosmicClarityColor = (clarity: string) => {
  switch (clarity) {
    case 'blessed':
      return 'bg-mystical-green/20 text-mystical-green border-mystical-green';
    case 'questionable':
      return 'bg-yellow-500/20 text-yellow-500 border-yellow-500';
    case 'cursed':
      return 'bg-mystical-red/20 text-mystical-red border-mystical-red';
    default:
      return 'bg-cosmic-400/20 text-cosmic-400 border-cosmic-400';
  }
};

export const getCosmicVerdict = (clarity: string, score: number) => {
  switch (clarity) {
    case 'blessed':
      return "The ingredients sing with purity";
    case 'questionable':
      return "The shadows hide much";
    case 'cursed':
      return "Banish this from your realm!";
    default:
      return "Awaiting cosmic analysis";
  }
};

export const generatePawRating = (score: number) => {
  return Math.max(1, Math.min(5, Math.round(score / 20)));
};