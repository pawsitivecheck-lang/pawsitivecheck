import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface MascotCardProps {
  name: string;
  role: string;
  icon: ReactNode;
  bgGradient: string;
}

export default function MascotCard({ name, role, icon, bgGradient }: MascotCardProps) {
  return (
    <div className="space-y-6">
      <div className={`w-32 h-32 mx-auto bg-gradient-to-br ${bgGradient} rounded-full flex items-center justify-center`} data-testid={`mascot-${name.toLowerCase()}-icon`}>
        {icon}
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-blue-600 mb-2" data-testid={`mascot-${name.toLowerCase()}-name`}>
          {name}
        </h3>
        <p className="text-gray-600" data-testid={`mascot-${name.toLowerCase()}-role`}>
          {role}
        </p>
      </div>
    </div>
  );
}
