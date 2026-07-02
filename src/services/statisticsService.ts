import { apiClient } from './apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DashboardPeriod = '7days' | '30days' | '90days' | '1year';

export interface DashboardSales {
  today: number;
  thisWeek: number;
  thisMonth: number;
  growth: number;
}

export interface DashboardRevenue {
  today: number;
  thisWeek: number;
  thisMonth: number;
  growth: number;
}

export interface DashboardCustomers {
  total: number;
  new: number;
  returning: number;
  growth: number;
}

export interface DashboardInventory {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
}

export interface DashboardActivityData {
  sales: DashboardSales;
  revenue: DashboardRevenue;
  customers: DashboardCustomers;
  inventory: DashboardInventory;
}

export interface DashboardChartPoint {
  date: string;
  sales: number;
  revenue: number;
}

export interface DashboardStatistics {
  activityData: DashboardActivityData;
  chartData: DashboardChartPoint[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const statisticsService = {
  async getDashboard(period: DashboardPeriod = '7days'): Promise<DashboardStatistics | null> {
    const response = await apiClient.get<{ success: boolean; data: DashboardStatistics }>(
      '/Statistics/dashboard',
      { params: { period } }
    );
    const body = response.data;
    if (!body.success) return null;
    return body.data;
  },
};
