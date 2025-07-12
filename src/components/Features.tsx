import React from 'react';
import { Shield, Download, Users, Zap, Clock, Award } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Sécurité avancée',
      description: 'Authentification sécurisée avec JWT et contrôle d\'accès granulaire pour protéger vos applications.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Download,
      title: 'Téléchargements contrôlés',
      description: 'Gérez les téléchargements de vos utilisateurs avec un système de suivi complet et des liens sécurisés.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'Gestion des utilisateurs',
      description: 'Interface d\'administration complète pour gérer vos clients et leurs abonnements en temps réel.',
      color: 'from-purple-500 to-orange-500'
    },
    {
      icon: Zap,
      title: 'Déploiement instantané',
      description: 'Mettez à jour vos applications et déployez les nouvelles versions en quelques clics seulement.',
      color: 'from-orange-500 to-purple-600'
    },
    {
      icon: Clock,
      title: 'Support 24/7',
      description: 'Équipe technique disponible en permanence pour vous accompagner et résoudre vos problèmes.',
      color: 'from-purple-600 to-orange-500'
    },
    {
      icon: Award,
      title: 'Qualité premium',
      description: 'Applications testées et validées selon les standards les plus élevés de l\'industrie.',
      color: 'from-orange-600 to-purple-500'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir{' '}
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Build Tech Solutions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les avantages de notre plateforme de distribution d'applications Windows 
            conçue pour les professionnels exigeants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
            En savoir plus
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;