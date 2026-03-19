export interface CrmConfig {
  delaiARisque: { valeur: number; unite: 'jours' | 'semaines' | 'mois' };
  delaiInactif: { valeur: number; unite: 'jours' | 'semaines' | 'mois' };
  delaiPerdu: { valeur: number; unite: 'jours' | 'semaines' | 'mois' };
  alertesActives: boolean;
  frequenceVerification: 'quotidienne' | 'hebdomadaire' | 'mensuelle';
}

export const mockCrmConfig: CrmConfig = {
  delaiARisque: { valeur: 30, unite: 'jours' },
  delaiInactif: { valeur: 90, unite: 'jours' },
  delaiPerdu: { valeur: 180, unite: 'jours' },
  alertesActives: true,
  frequenceVerification: 'hebdomadaire'
};
