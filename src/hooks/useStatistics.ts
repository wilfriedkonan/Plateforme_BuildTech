import { useState, useCallback } from 'react';
import {
  statisticsService,
  DashboardStatistics,
  DashboardPeriod,
} from '../services/statisticsService';

interface UseStatisticsState {
  dashboard: DashboardStatistics | null;
  loading: boolean;
  error: string | null;
}

export const useStatistics = () => {
  const [state, setState] = useState<UseStatisticsState>({
    dashboard: null,
    loading: false,
    error: null,
  });

  const fetchDashboard = useCallback(async (period: DashboardPeriod = '7days') => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await statisticsService.getDashboard(period);
      setState({ dashboard: data, loading: false, error: null });
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'Erreur chargement dashboard';
      setState(prev => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  return {
    dashboard: state.dashboard,
    loading: state.loading,
    error: state.error,
    fetchDashboard,
    // raccourcis pratiques
    activityData: state.dashboard?.activityData ?? null,
    chartData: state.dashboard?.chartData ?? [],
  };
};
