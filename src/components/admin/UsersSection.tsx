import React, { useState, useEffect } from 'react';
import { Eye, Download, Search, Filter, Calendar, Mail, Phone, Building } from 'lucide-react';
import * as XLSX from 'xlsx';

interface User {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending';
  plan: string;
  lastActivity: string;
  otpVerified: boolean;
}

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Détails de l'utilisateur</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'entreprise
              </label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                <Building className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">{user.companyName}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">{user.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">{user.phone}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan d'abonnement
              </label>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.plan === 'Pro' ? 'bg-purple-100 text-purple-800' :
                  user.plan === 'Standard' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.plan}
                </span>
              </div>
            </div>
          </div>

          {/* Statut et dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                  user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'active' ? 'Actif' : 
                   user.status === 'pending' ? 'En attente' : 'Inactif'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'inscription
              </label>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-900">{user.registrationDate}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dernière activité
              </label>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-900">{user.lastActivity}</span>
              </div>
            </div>
          </div>

          {/* Vérification OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vérification OTP
            </label>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.otpVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.otpVerified ? 'Vérifié' : 'Non vérifié'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Envoyer un email
            </button>
            <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
              Modifier le statut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UsersSection: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Simulation de récupération des données
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      
      // Simulation d'appel API
      setTimeout(() => {
        const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => {
          const companies = [
            'TechCorp Solutions', 'Digital Innovations', 'Smart Business', 'Future Systems',
            'Creative Agency', 'Data Analytics Pro', 'Cloud Services', 'Mobile First',
            'AI Solutions', 'Cyber Security Plus', 'Web Development Co', 'Marketing Digital'
          ];
          
          const plans = ['Découverte', 'Standard', 'Pro'];
          const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending'];
          
          const registrationDate = new Date();
          registrationDate.setDate(registrationDate.getDate() - Math.floor(Math.random() * 90));
          
          const lastActivity = new Date();
          lastActivity.setDate(lastActivity.getDate() - Math.floor(Math.random() * 7));
          
          return {
            id: `USER${String(i + 1).padStart(4, '0')}`,
            companyName: companies[i % companies.length] + ` ${Math.floor(i / companies.length) + 1}`,
            email: `contact${i + 1}@${companies[i % companies.length].toLowerCase().replace(/\s+/g, '')}.com`,
            phone: `+33 6 ${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
            registrationDate: registrationDate.toLocaleDateString('fr-FR'),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            plan: plans[Math.floor(Math.random() * plans.length)],
            lastActivity: lastActivity.toLocaleDateString('fr-FR'),
            otpVerified: Math.random() > 0.2
          };
        });
        
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    };

    fetchUsers();
  }, []);

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesPlan = planFilter === 'all' || user.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Export en Excel
  const exportToExcel = () => {
    const exportData = filteredUsers.map(user => ({
      'ID': user.id,
      'Entreprise': user.companyName,
      'Email': user.email,
      'Téléphone': user.phone,
      'Date inscription': user.registrationDate,
      'Statut': user.status === 'active' ? 'Actif' : user.status === 'pending' ? 'En attente' : 'Inactif',
      'Plan': user.plan,
      'Dernière activité': user.lastActivity,
      'OTP vérifié': user.otpVerified ? 'Oui' : 'Non'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Utilisateurs');
    XLSX.writeFile(workbook, `utilisateurs_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Utilisateurs inscrits</h1>
          <p className="text-gray-600">Gestion des leads et utilisateurs de la plateforme</p>
        </div>
        <button
          onClick={exportToExcel}
          className="mt-4 md:mt-0 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Exporter Excel</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par entreprise ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
            <option value="inactive">Inactif</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tous les plans</option>
            <option value="Découverte">Découverte</option>
            <option value="Standard">Standard</option>
            <option value="Pro">Pro</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            <span>{filteredUsers.length} utilisateur(s) trouvé(s)</span>
          </div>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.companyName}</div>
                      <div className="text-sm text-gray-500">{user.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.plan === 'Pro' ? 'bg-purple-100 text-purple-800' :
                      user.plan === 'Standard' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Actif' : 
                       user.status === 'pending' ? 'En attente' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.registrationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Voir plus</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun utilisateur trouvé</p>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UsersSection;