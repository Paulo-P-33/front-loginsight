import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href?: string;
}

export interface StatMetric {
  label: string;
  value: string;
  helperText: string;
  icon: LucideIcon;
  iconClassName: string;
}

export interface OnboardingStep {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
}

export interface DonutSlice {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface DailyEvolutionPoint {
  date: string;
  deliveries: number;
  deliveryRate: number;
}

export interface DriverPerformance {
  name: string;
  routes: number;
  stops: number;
  deliveries: number;
  failures: number;
  rate: number;
}

export interface RouteFailure {
  code: string;
  driver: string;
  failures: number;
  failureRate: number;
}

export interface OperationSummaryItem {
  label: string;
  value: string;
  badge?: boolean;
}

export interface AlertItem {
  icon: LucideIcon;
  title: string;
  description: string;
  timeAgo: string;
}

export interface QuickAction {
  label: string;
  icon: LucideIcon;
  iconClassName: string;
}

export interface ImportRecord {
  fileName: string;
  importedAt: string;
  routesProcessed: number;
}
