import {
  AlertTriangle,
  ArrowDownToLine,
  BarChart3,
  Car,
  CheckCircle2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MapPin,
  MapPinOff,
  MinusCircle,
  Package,
  Route,
  Server,
  Settings,
  Bell as BellIcon,
  UploadCloud,
  UserX,
  Users,
  Waypoints,
  XCircle,
} from "lucide-react";
import type {
  AlertItem,
  DailyEvolutionPoint,
  DonutSlice,
  DriverPerformance,
  ImportRecord,
  NavItem,
  OnboardingStep,
  OperationSummaryItem,
  QuickAction,
  RouteFailure,
  StatMetric,
} from "@/types/dashboard";

export const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Rotas", icon: Route },
  { label: "Motoristas", icon: Users },
  { label: "Veículos", icon: Car },
  { label: "Operações", icon: ClipboardList },
  { label: "Indicadores", icon: BarChart3 },
  { label: "Insucessos", icon: XCircle },
  { label: "Importações", icon: ArrowDownToLine },
  { label: "Relatórios", icon: FileText, href: "/relatorios" },
  { label: "Alertas", icon: BellIcon },
  { label: "Configurações", icon: Settings },
];

export const statMetrics: StatMetric[] = [
  {
    label: "Total de Rotas",
    value: "--",
    helperText: "Sem dados",
    icon: Waypoints,
    iconClassName: "bg-blue-50 text-blue-500",
  },
  {
    label: "Total de Paradas",
    value: "--",
    helperText: "Sem dados",
    icon: MapPin,
    iconClassName: "bg-violet-50 text-violet-500",
  },
  {
    label: "Entregas Realizadas",
    value: "--",
    helperText: "Sem dados",
    icon: Package,
    iconClassName: "bg-amber-50 text-amber-500",
  },
  {
    label: "% de Entregas",
    value: "--",
    helperText: "Sem dados",
    icon: CheckCircle2,
    iconClassName: "bg-emerald-50 text-emerald-500",
  },
  {
    label: "Insucessos",
    value: "--",
    helperText: "Sem dados",
    icon: XCircle,
    iconClassName: "bg-rose-50 text-rose-500",
  },
  {
    label: "Não Visitadas",
    value: "--",
    helperText: "Sem dados",
    icon: MinusCircle,
    iconClassName: "bg-slate-100 text-slate-400",
  },
];

export const onboardingSteps: OnboardingStep[] = [
  {
    title: "Importe um relatório",
    description: "Faça o upload do seu arquivo Excel com os dados da operação.",
    icon: UploadCloud,
    iconClassName: "bg-blue-50 text-blue-500",
  },
  {
    title: "Processamento",
    description: "O sistema irá processar e validar os dados automaticamente.",
    icon: Server,
    iconClassName: "bg-emerald-50 text-emerald-500",
  },
  {
    title: "Visualize indicadores",
    description: "Acesse dashboards e relatórios com insights da operação.",
    icon: BarChart3,
    iconClassName: "bg-amber-50 text-amber-500",
  },
  {
    title: "Tome decisões",
    description: "Use os dados para otimizar rotas e melhorar resultados.",
    icon: Users,
    iconClassName: "bg-violet-50 text-violet-500",
  },
];

export const svcOptions = ["SJP1 - Conde", "SPE1 - Recife"];

export const dashboardStats: StatMetric[] = [
  {
    label: "Total de Rotas",
    value: "154",
    helperText: "100% do período",
    icon: Waypoints,
    iconClassName: "bg-blue-50 text-blue-500",
  },
  {
    label: "Total de Paradas",
    value: "8.432",
    helperText: "Média 54,7 por rota",
    icon: MapPin,
    iconClassName: "bg-violet-50 text-violet-500",
  },
  {
    label: "Entregas Realizadas",
    value: "7.981",
    helperText: "Média 51,8 por rota",
    icon: Package,
    iconClassName: "bg-amber-50 text-amber-500",
  },
  {
    label: "% de Entregas",
    value: "94,65%",
    helperText: "Taxa de sucesso",
    icon: CheckCircle2,
    iconClassName: "bg-emerald-50 text-emerald-500",
  },
  {
    label: "Insucessos",
    value: "451",
    helperText: "5,35% do total",
    icon: XCircle,
    iconClassName: "bg-rose-50 text-rose-500",
  },
  {
    label: "Não Visitadas",
    value: "123",
    helperText: "1,46% do total",
    icon: MinusCircle,
    iconClassName: "bg-slate-100 text-slate-400",
  },
];

export const cycleBreakdown: DonutSlice[] = [
  { label: "AM - Manhã", value: 87, percentage: 56.49, color: "#3b82f6" },
  { label: "PM - Tarde", value: 54, percentage: 35.06, color: "#10b981" },
  { label: "SD - Sábado", value: 13, percentage: 8.44, color: "#8b5cf6" },
];

export const deliveryStatusBreakdown: DonutSlice[] = [
  { label: "Entregues", value: 7981, percentage: 94.65, color: "#10b981" },
  { label: "Insucessos", value: 451, percentage: 5.35, color: "#f59e0b" },
  { label: "Não Visitadas", value: 123, percentage: 1.46, color: "#8b5cf6" },
];

export const dailyEvolution: DailyEvolutionPoint[] = [
  { date: "15/08", deliveries: 7120, deliveryRate: 93.8 },
  { date: "16/08", deliveries: 7340, deliveryRate: 94.1 },
  { date: "17/08", deliveries: 7205, deliveryRate: 92.6 },
  { date: "18/08", deliveries: 7480, deliveryRate: 94.8 },
  { date: "19/08", deliveries: 7620, deliveryRate: 95.2 },
  { date: "20/08", deliveries: 7390, deliveryRate: 93.1 },
  { date: "21/08", deliveries: 7981, deliveryRate: 94.65 },
];

export const topDrivers: DriverPerformance[] = [
  { name: "EMERSON ANTONIO NUNES DA SILVA", routes: 12, stops: 692, deliveries: 673, failures: 19, rate: 97.26 },
  { name: "JOAO KLEBER DE ARAUJO MIRANDA", routes: 10, stops: 564, deliveries: 547, failures: 17, rate: 96.98 },
  { name: "MARLON HENRIQUE DA SILVA MARTINS", routes: 11, stops: 608, deliveries: 589, failures: 19, rate: 96.88 },
  { name: "WANDER PEREIRA DE BARROS", routes: 12, stops: 702, deliveries: 677, failures: 25, rate: 96.44 },
  { name: "KAUE KURDOGLO DE SALES", routes: 9, stops: 498, deliveries: 477, failures: 21, rate: 95.78 },
];

export const topFailureRoutes: RouteFailure[] = [
  { code: "RN01G29", driver: "EMERSON ANTONIO N. SILVA", failures: 40, failureRate: 7.14 },
  { code: "SY2D3J1", driver: "RENAN FERREIRA M. NASC.", failures: 36, failureRate: 5.71 },
  { code: "T2GDB48", driver: "VALDEMIR PEREIRA DE BARROS", failures: 35, failureRate: 5.1 },
  { code: "5LEC3B4", driver: "HERICK VINICIUS NETO", failures: 33, failureRate: 4.62 },
  { code: "TC4H3C4", driver: "VITOR MANOEL SILVA", failures: 31, failureRate: 4.29 },
];

export const operationSummary: OperationSummaryItem[] = [
  { label: "KM Total Percorrido", value: "19.346 km" },
  { label: "ORH Planejado (soma)", value: "1.543,21 h" },
  { label: "ORH Realizado (soma)", value: "1.612,78 h" },
  { label: "% Desempenho Médio (DS)", value: "100,00%", badge: true },
  { label: "SPR Médio", value: "125" },
  { label: "DPPH Médio", value: "16,35" },
];

export const recentAlerts: AlertItem[] = [
  {
    icon: AlertTriangle,
    title: "8 rotas ultrapassaram o tempo planejado",
    description: "Tempo real acima de 120% do planejado.",
    timeAgo: "Há 15 min",
  },
  {
    icon: UserX,
    title: "14 motoristas com taxa abaixo de 90%",
    description: "Performance abaixo da meta definida.",
    timeAgo: "Há 35 min",
  },
  {
    icon: MapPinOff,
    title: "23 rotas com entregas não visitadas",
    description: "Total de não visitadas acima do esperado.",
    timeAgo: "Há 1 hora",
  },
];

export const quickActions: QuickAction[] = [
  { label: "Importar Relatório", icon: UploadCloud, iconClassName: "bg-blue-50 text-blue-500" },
  { label: "Ver Rotas", icon: Route, iconClassName: "bg-violet-50 text-violet-500" },
  { label: "Ver Insucessos", icon: XCircle, iconClassName: "bg-rose-50 text-rose-500" },
  { label: "Gerar Relatório", icon: FileText, iconClassName: "bg-emerald-50 text-emerald-500" },
];

export const lastImport: ImportRecord = {
  fileName: "Relatório 21/08/2026 10:42",
  importedAt: "21/08/2026 10:42",
  routesProcessed: 154,
};

export function formatIsoToBr(isoDate: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return null;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}
