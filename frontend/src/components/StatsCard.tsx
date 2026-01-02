import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

const StatsCard = ({ icon, label, value, className = "" }: StatsCardProps) => {
  return (
    <Card className={`border-0 shadow-soft ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-subtle rounded-lg" data-testid="stats-icon">
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-xl font-bold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;