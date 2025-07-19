import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  isFinancial?: boolean;
  showValue?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  isFinancial = false,
  showValue = true,
  className = ""
}: StatCardProps) {
  const displayValue = showValue ? value : "••••";

  return (
    <Card className={`bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all duration-300 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground/80">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-card-foreground mb-1">
          {displayValue}
        </div>
        
        {trend && (
          <div className="flex items-center gap-1 text-xs">
            <span className={`font-medium ${
              trend.isPositive ? "text-success" : "text-destructive"
            }`}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-muted-foreground">em relação ao mês anterior</span>
          </div>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}