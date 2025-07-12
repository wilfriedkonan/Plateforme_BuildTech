import React, { useState } from 'react';
import { Check, Star, Crown, Zap, Shield } from 'lucide-react';

interface PricingProps {
  onPlanSelect: (app: string, plan: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ onPlanSelect }) => {
  const [activeTab, setActiveTab] = useState('business-manager');

  const applications = {
    'business-manager': {
      name: 'Business Manager Pro',
      icon: Zap,
      description: 'Solution complète de gestion d\'entreprise',
      color: 'from-purple-600 to-orange-500',
      plans: [
        {
          name: 'Découverte',
          price: 'Gratuit',
          period: '14 jours',
          icon: Star,
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
          icon: Zap,
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
          icon: Crown,
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
    'security-suite': {
      name: 'Security Suite',
      icon: Shield,
      description: 'Protection avancée des données et sécurité informatique',
      color: 'from-blue-600 to-purple-600',
      plans: [
        {
          name: 'Découverte',
          price: 'Gratuit',
          period: '14 jours',
          icon: Star,
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
          icon: Shield,
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
          icon: Crown,
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
  };

  const currentApp = applications[activeTab as keyof typeof applications];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre{' '}
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              plan d'abonnement
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des tarifs transparents et flexibles pour chaque application selon vos besoins
          </p>
        </div>

        {/* Application Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl p-2 shadow-lg">
            {Object.entries(applications).map(([key, app]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                  activeTab === key
                    ? `bg-gradient-to-r ${app.color} text-white shadow-lg`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <app.icon className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">{app.name}</div>
                  <div className={`text-sm ${activeTab === key ? 'text-white/80' : 'text-gray-500'}`}>
                    {app.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Application Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r ${currentApp.color} text-white mb-4`}>
            <currentApp.icon className="w-6 h-6" />
            <span className="font-semibold">{currentApp.name}</span>
          </div>
          <p className="text-lg text-gray-600">{currentApp.description}</p>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {currentApp.plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className={`bg-gradient-to-r ${currentApp.color} text-white px-4 py-2 rounded-full text-sm font-medium`}>
                    Le plus populaire
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 ml-2">/ {plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? `bg-gradient-to-r ${currentApp.color} text-white hover:shadow-lg`
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
                onClick={() => onPlanSelect(currentApp.name, plan.name)}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Tous les plans incluent une garantie de remboursement de 30 jours
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              Paiement sécurisé
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              Orange Money & Wave
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              Carte bancaire
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;