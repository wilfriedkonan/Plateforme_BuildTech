import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Comment créer un compte ?',
      answer: 'Pour créer un compte, cliquez sur "Créer un compte" dans le header, remplissez le formulaire avec vos informations d\'entreprise, puis validez avec le code OTP que vous recevrez par WhatsApp ou email.'
    },
    {
      question: 'Y a-t-il un essai gratuit ?',
      answer: 'Oui ! Nous proposons un essai gratuit de 14 jours avec le plan Découverte. Vous aurez accès à toutes les applications et fonctionnalités pendant cette période.'
    },
    {
      question: 'Comment récupérer mon installation ?',
      answer: 'Une fois connecté à votre dashboard, vous trouverez tous vos téléchargements dans la section "Applications disponibles". Chaque application dispose d\'un bouton de téléchargement sécurisé.'
    },
    {
      question: 'Quel support technique est disponible ?',
      answer: 'Nous offrons un support par email pour tous les plans, un support prioritaire pour le plan Standard, et un support téléphonique 24/7 pour le plan Pro.'
    },
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Absolument ! Vous pouvez upgrader ou downgrader votre plan à tout moment depuis votre dashboard. Les changements prennent effet immédiatement.'
    },
    {
      question: 'Quels moyens de paiement acceptez-vous ?',
      answer: 'Nous acceptons les cartes bancaires, Orange Money et Wave via notre partenaire KKiaPay pour offrir une expérience de paiement sécurisée et locale.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Questions{' '}
            <span className="text-gray-800">
              fréquentes
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Trouvez rapidement les réponses à vos questions les plus courantes
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Vous ne trouvez pas la réponse à votre question ?
          </p>
          <button className="bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
            Contactez le support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;