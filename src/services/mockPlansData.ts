import { ApplicationPlansDto } from './plansService';

export const mockPlansData: ApplicationPlansDto[] = [
  {
    key: 'business-manager',
    name: 'Business Manager Pro',
    description: 'Solution complète de gestion d\'entreprise',
    color: 'from-purple-600 to-orange-500',
    plans: [
      {
        name: 'Découverte',
        price: 'Gratuit',
        period: '14 jours',
        features: [
          'Accès complet à Business Manager Pro',
          'Gestion des clients et factures',
          'Rapports de base',
          'Support par email',
          'Mises à jour incluses'
        ],
        cta: 'Essai gratuit',
        popular: false,
        color: 'from-gray-600 to-gray-700'
      },
      {
        name: 'Standard',
        price: '39€',
        period: 'par mois',
        features: [
          'Tout du plan Découverte',
          'Gestion avancée des stocks',
          'Rapports détaillés et analytics',
          'Support prioritaire',
          'Sauvegarde cloud automatique',
          'Intégrations comptables'
        ],
        cta: 'Commencer maintenant',
        popular: true,
        color: 'from-purple-600 to-orange-500'
      },
      {
        name: 'Pro',
        price: '89€',
        period: 'par mois',
        features: [
          'Tout du plan Standard',
          'Multi-utilisateurs illimités',
          'Personnalisation avancée',
          'API complète',
          'Support téléphonique 24/7',
          'Formation personnalisée',
          'Gestionnaire de compte dédié'
        ],
        cta: 'Contacter l\'équipe',
        popular: false,
        color: 'from-orange-600 to-purple-600'
      }
    ]
  },
  {
    key: 'security-suite',
    name: 'Security Suite',
    description: 'Protection avancée des données et sécurité informatique',
    color: 'from-blue-600 to-purple-600',
    plans: [
      {
        name: 'Découverte',
        price: 'Gratuit',
        period: '14 jours',
        features: [
          'Accès complet à Security Suite',
          'Scan antivirus en temps réel',
          'Firewall de base',
          'Support par email',
          'Mises à jour de sécurité'
        ],
        cta: 'Essai gratuit',
        popular: false,
        color: 'from-gray-600 to-gray-700'
      },
      {
        name: 'Standard',
        price: '29€',
        period: 'par mois',
        features: [
          'Tout du plan Découverte',
          'Protection avancée contre les malwares',
          'VPN intégré',
          'Monitoring réseau',
          'Support prioritaire',
          'Rapports de sécurité détaillés'
        ],
        cta: 'Commencer maintenant',
        popular: true,
        color: 'from-blue-600 to-purple-600'
      },
      {
        name: 'Enterprise',
        price: '69€',
        period: 'par mois',
        features: [
          'Tout du plan Standard',
          'Gestion centralisée multi-postes',
          'Audit de sécurité complet',
          'Conformité RGPD',
          'Support téléphonique 24/7',
          'Consultant sécurité dédié',
          'Formation équipe IT'
        ],
        cta: 'Contacter l\'équipe',
        popular: false,
        color: 'from-purple-600 to-blue-600'
      }
    ]
  }
];
