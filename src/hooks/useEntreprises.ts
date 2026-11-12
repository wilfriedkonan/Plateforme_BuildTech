import { useCallback, useEffect, useRef, useState } from 'react';
import { entrepriseService, type Entreprise } from '../services/entrepriseService';

export const useEntreprises = () => {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await entrepriseService.getAll();
      if (mounted.current) setEntreprises(list);
    } catch (e: any) {
      const status: number | undefined = e?.response?.status;
      const message =
        status === 401 || status === 403
          ? 'Accès réservé aux administrateurs'
          : e?.response?.data?.message || e?.message || 'Erreur lors du chargement des entreprises';
      if (mounted.current) setError(message);
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();
    return () => { mounted.current = false; };
  }, [refresh]);

  return { entreprises, isLoading, error, refresh };
};
