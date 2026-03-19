export interface MessageCRM {
  id: string;
  code: string;
  nom: string;
  canal: 'whatsapp' | 'sms' | 'email';
  declencheur: 'a_risque' | 'inactif' | 'perdu' | 'manuel' | 'anniversaire';
  delaiJours: number;
  objet?: string;
  corps: string;
  statut: 'actif' | 'inactif';
}

export const mockMessagesCRM: MessageCRM[] = [
  {
    id: "1",
    code: "MSG001",
    nom: "Relance client à risque",
    canal: "whatsapp",
    declencheur: "a_risque",
    delaiJours: 2,
    corps: "Bonjour {{prenom}} 👋, cela fait un moment qu'on ne vous a pas vu chez nous ! Revenez profiter de nos offres 🎁. Consultez notre catalogue : {{lien_catalogue}}",
    statut: "actif"
  },
  {
    id: "2",
    code: "MSG002",
    nom: "Réactivation client inactif",
    canal: "whatsapp",
    declencheur: "inactif",
    delaiJours: 1,
    corps: "Bonjour {{prenom}}, votre fidélité nous tient à cœur ❤️. Voici une offre spéciale rien que pour vous : -10% sur votre prochaine commande avec le code RETOUR10 🛍️",
    statut: "actif"
  },
  {
    id: "3",
    code: "MSG003",
    nom: "Dernière tentative client perdu",
    canal: "sms",
    declencheur: "perdu",
    delaiJours: 0,
    corps: "Bonjour {{prenom}}, vous nous manquez ! Revenez découvrir nos nouveautés. Code promo exclusif : WELCOME",
    statut: "actif"
  },
  {
    id: "4",
    code: "MSG004",
    nom: "Souhaits anniversaire",
    canal: "whatsapp",
    declencheur: "anniversaire",
    delaiJours: 0,
    corps: "🎂 Joyeux anniversaire {{prenom}} ! Toute l'équipe COCOPROJECTS vous souhaite une excellente journée. Cadeau surprise vous attend en magasin 🎁",
    statut: "actif"
  },
  {
    id: "5",
    code: "MSG005",
    nom: "Email relance VIP",
    canal: "email",
    declencheur: "manuel",
    delaiJours: 0,
    objet: "Offre exclusive pour {{prenom}}",
    corps: "Cher(e) {{prenom}} {{nom}},\n\nEn tant que client privilégié, nous vous offrons un accès anticipé à notre nouvelle collection.\n\nVotre dernière commande remonte au {{derniere_commande}}.\n\nÀ très bientôt,\nL'équipe COCOPROJECTS",
    statut: "actif"
  }
];
