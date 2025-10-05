export interface HeaderProps {
  name: string;
  day: number;
  showBack?: boolean;
}

export interface ScoreCardProps {
  title: string;
  score: number;
  criticalThreshold: number;
  warningThreshold?: number;
  description: string;
  unit: string;
}

export interface TrendChartProps {
  data: any[];
  dataKey: string;
  color: string;
  xAxisKey: string;
  title: string;
  linkTo?: string;
}