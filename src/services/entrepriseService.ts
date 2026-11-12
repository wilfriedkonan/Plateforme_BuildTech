import { apiClient } from './apiClient';

export interface Entreprise {
  id: string;
  designation?: string;
  localisation?: string;
  contact?: string;
  email?: string;
  pays?: string;
  ville?: string;
  commune?: string;
  nrc?: string;
  autorisation?: string;
  codeEntreprise?: string;
  isActive?: boolean;
  subscriptionStatus?: string;
  subscriptionEndsAt?: string;
  createdAt?: string;
  updatedAt?: string;
  idOrganisation?: string;
}

type Raw = Record<string, unknown>;

const str = (...values: unknown[]): string | undefined => {
  for (const v of values) {
    if (typeof v === 'string' && v !== '') return v;
    if (typeof v === 'number') return String(v);
  }
  return undefined;
};

// Le schéma de GET /api/Entreprise n'est pas documenté : on accepte camelCase et PascalCase.
export const normalizeEntreprise = (raw: Raw): Entreprise => ({
  id: str(raw.id, raw.Id) ?? '',
  designation: str(raw.designation, raw.Designation),
  localisation: str(raw.localisation, raw.Localisation),
  contact: str(raw.contact, raw.Contact),
  email: str(raw.email, raw.Email),
  pays: str(raw.pays, raw.Pays),
  ville: str(raw.ville, raw.Ville),
  commune: str(raw.commune, raw.Commune),
  nrc: str(raw.nrc, raw.Nrc, raw.NRC),
  autorisation: str(raw.autorisation, raw.Autorisation),
  codeEntreprise: str(raw.codeEntreprise, raw.CodeEntreprise),
  isActive: typeof (raw.isActive ?? raw.IsActive) === 'boolean' ? ((raw.isActive ?? raw.IsActive) as boolean) : undefined,
  subscriptionStatus: str(raw.subscriptionStatus, raw.SubscriptionStatus),
  subscriptionEndsAt: str(raw.subscriptionEndsAt, raw.SubscriptionEndsAt),
  createdAt: str(raw.createdAt, raw.CreatedAt),
  updatedAt: str(raw.updatedAt, raw.UpdatedAt),
  idOrganisation: str(raw.idOrganisation, raw.IdOrganisation),
});

// Réponse : tableau direct, ou enveloppé (data, items, entreprises, result)
const extractList = (payload: unknown): Raw[] => {
  if (Array.isArray(payload)) return payload as Raw[];
  if (payload && typeof payload === 'object') {
    const obj = payload as Raw;
    for (const key of ['data', 'Data', 'items', 'Items', 'entreprises', 'Entreprises', 'result', 'Result']) {
      const inner = obj[key];
      if (Array.isArray(inner)) return inner as Raw[];
    }
  }
  return [];
};

export const entrepriseService = {
  getAll: async (): Promise<Entreprise[]> => {
    try {
      const { data } = await apiClient.get<unknown>('Entreprise');
      return extractList(data)
        .filter((r): r is Raw => !!r && typeof r === 'object')
        .map(normalizeEntreprise);
    } catch (error: any) {
      console.error('[entrepriseService] Error fetching entreprises:', error?.message);
      throw error;
    }
  },
};
