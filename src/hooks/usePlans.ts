import { useCallback, useEffect, useMemo, useState } from 'react';
import { plansService, type ApplicationPlansDto, type CreatePlanDto, type PlanDto, type UpdatePlanDto } from '../services/plansService';
import { mockPlansData } from '../services/mockPlansData';

const USE_MOCK_DATA = (import.meta as any).env?.VITE_USE_MOCK_PLANS === 'true';

type UsePlansState = {
  data: ApplicationPlansDto[] | null;
  loading: boolean;
  error: string | null;
};

const isApplicationPlansArray = (value: unknown): value is ApplicationPlansDto[] => {
  if (!Array.isArray(value)) return false;
  return value.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const anyItem = item as any;
    return typeof anyItem.key === 'string' && Array.isArray(anyItem.plans);
  });
};

const normalizePlansResponse = (value: unknown): ApplicationPlansDto[] | null => {
  if (isApplicationPlansArray(value)) return value;

  if (Array.isArray(value)) {
    const plans = value as PlanDto[];
    const grouped = new Map<string, ApplicationPlansDto>();

    for (const plan of plans) {
      const key = plan.applicationKey ?? 'unknown';
      const name = plan.applicationName ?? key;
      const description = plan.applicationDescription ?? '';

      const existing = grouped.get(key);
      if (existing) {
        existing.plans.push(plan);
      } else {
        grouped.set(key, {
          key,
          name,
          description,
          color: undefined,
          plans: [plan],
        });
      }
    }

    return Array.from(grouped.values());
  }

  return null;
};

export const usePlans = () => {
  const [state, setState] = useState<UsePlansState>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchPlans = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      if (USE_MOCK_DATA) {
        console.log('[usePlans] Using mock data (VITE_USE_MOCK_PLANS=true)');
        setState({ data: mockPlansData, loading: false, error: null });
        return;
      }

      console.log('[usePlans] Fetching plans from API...');
      const raw = await plansService.list();
      console.log('[usePlans] Raw response:', raw);
      const normalized = normalizePlansResponse(raw);
      console.log('[usePlans] Normalized data:', normalized);
      setState({ data: normalized, loading: false, error: normalized ? null : 'Format de réponse API inattendu' });
    } catch (e: any) {
      console.error('[usePlans] API Error, falling back to mock data:', e?.message);
      console.log('[usePlans] Using mock data as fallback');
      setState({ data: mockPlansData, loading: false, error: null });
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const createPlan = useCallback(async (payload: CreatePlanDto) => {
    const res = await plansService.create(payload);
    await fetchPlans();
    return res;
  }, [fetchPlans]);

  const updatePlan = useCallback(async (id: string, payload: UpdatePlanDto) => {
    const res = await plansService.update(id, payload);
    await fetchPlans();
    return res;
  }, [fetchPlans]);

  const deletePlan = useCallback(async (id: string) => {
    await plansService.remove(id);
    await fetchPlans();
  }, [fetchPlans]);

  return useMemo(() => ({
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchPlans,
    create: createPlan,
    update: updatePlan,
    remove: deletePlan,
  }), [state.data, state.loading, state.error, fetchPlans, createPlan, updatePlan, deletePlan]);
};
