import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, Shield, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import blackSmallImage from './assets/black-small.webp';
import coffeeshop from './assets/coffee-shop.jpg';
import mediumShot from './assets/medium-shot-black-woman-.avif';
import pexelsolly from './assets/pexels-olly-3801439.jpg';
import portrai from './assets/portrait-of-store-owner-in-his-store.jpg';


interface HeroProps {
  onLogin?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onLogin }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const environments = [
    {
      id: 1,
      title: "Boutique de mode",
      description: "Gestion complète des stocks et ventes",
      image: blackSmallImage,
      features: ["Gestion des stocks", "Point de vente", "Fidélisation client"]
    },
    {
      id: 2,
      title: "Restaurant",
      description: "Solution de gestion restauration",
      image: coffeeshop,
      features: ["Commandes", "Inventaire", "Facturation"]
    },
    {
      id: 3,
      title: "Pressing",
      description: "Suivi des vêtements et planning",
      image: mediumShot,
      features: ["Suivi commandes", "Planning", "Gestion clients"]
    },
    {
      id: 4,
      title: "Salon de beauté",
      description: "Rendez-vous et gestion clientèle",
      image: pexelsolly,
      features: ["Réservations", "Produits", "Historique client"]
    },
    {
      id: 5,
      title: "Bureau d'affaires",
      description: "Gestion d'entreprise moderne",
      image: portrai,
      features: ["Comptabilité", "RH", "Projets"]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % environments.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % environments.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + environments.length) % environments.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const scrollToSignup = () => {
    const element = document.getElementById('signup');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="pt-16 pb-20 bg-gradient-to-br from-purple-50 to-orange-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Left Content */}
          <div className="mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
             Les commerçants{' '}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                performants
              </span>{' '}
              gèrent avec précision
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Gérez vos ventes, suivez vos stocks et consultez vos statistiques en temps réel grâce à notre solution de gestion commerciale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => {
                  const element = document.getElementById('pricing');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-gray-800 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center group"
              >
                Choisir un plan
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
               onClick={onLogin} 
               className="border border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 text-purple-600">
                Connexion
              </button>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-gray-600 mr-2" />
                Sécurisé
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-gray-600 mr-2" />
                Rapide
              </div>
              <div className="flex items-center">
                <Download className="w-5 h-5 text-gray-600 mr-2" />
                Facile
              </div>
            </div>
          </div>
          
          {/* Right Content - Slider */}
          <div className="relative">
            {/* Environment Slider */}
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
              <div className="relative h-80 md:h-96">
                {environments.map((env, index) => (
                  <div
                    key={env.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentSlide 
                        ? 'opacity-100 transform translate-x-0' 
                        : index < currentSlide 
                          ? 'opacity-0 transform -translate-x-full'
                          : 'opacity-0 transform translate-x-full'
                    }`}
                  >
                    <div className="relative h-full">
                      <img
                        src={env.image}
                        alt={env.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{env.title}</h3>
                        <p className="text-white/90 mb-4">{env.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {env.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {environments.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentSlide 
                        ? 'bg-white scale-110' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Applications Dashboard Preview */}
            <div className="relative bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Applications disponibles</h3>
                <span className="bg-green-100 text-gray-700 text-xs px-3 py-1 rounded-full">2 Apps</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Business Manager Pro</h4>
                    <p className="text-sm text-gray-600">Gestion d'entreprise complète</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Security Suite</h4>
                    <p className="text-sm text-gray-600">Protection avancée des données</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-8">
            Adapté à tous les secteurs d'activité
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Commerce de détail
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Restauration
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Services
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Beauté & Bien-être
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;