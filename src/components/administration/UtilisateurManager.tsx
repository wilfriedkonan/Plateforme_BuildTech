import React, { useState, useEffect } from 'react';
import { CreditCard as Edit, Trash2, Shield, Key, UserX, UserCheck } from 'lucide-react';
import { mockUtilisateurs, Utilisateur } from '../lib/mock/utilisateurs';
import UtilisateurForm from './forms/utilisateurs/UtilisateurForm';
import { UtilisateurDeleteModal } from './forms/utilisateurs/UtilisateurDeleteModal';

interface UtilisateurManagerProps {
  onRegisterNewAction?: (action: () => void) => void;
}

const UtilisateurManager: React.FC<UtilisateurManagerProps> = ({ onRegisterNewAction }) => {
  const [utilisateurs, setUtilisateurs] = useState(mockUtilisateurs);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Utilisateur | null>(null);
  const [deletingUser, setDeletingUser] = useState<Utilisateur | null>(null);

  const handleNewUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  useEffect(() => {
    if (onRegisterNewAction) {
      onRegisterNewAction(handleNewUser);
    }
  }, [onRegisterNewAction]);

  const handleEditUser = (user: Utilisateur) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleSaveUser = (data: Partial<Utilisateur>) => {
    if (editingUser) {
      setUtilisateurs(utilisateurs.map(u =>
        u.id === editingUser.id ? { ...u, ...data } : u
      ));
    } else {
      const newUser: Utilisateur = {
        id: `U${Date.now()}`,
        code: `USR${(utilisateurs.length + 1).toString().padStart(3, '0')}`,
        derniereConnexion: new Date().toLocaleString('fr-FR', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit'
        }).replace(',', ''),
        ...data as Omit<Utilisateur, 'id' | 'code' | 'derniereConnexion'>
      };
      setUtilisateurs([...utilisateurs, newUser]);
    }
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleResetPassword = (user: Utilisateur) => {
    alert(`Réinitialiser le mot de passe de ${user.prenom} ${user.nom} - À implémenter`);
  };

  const handleToggleStatus = (user: Utilisateur) => {
    const newStatus = user.statut === 'actif' ? 'suspendu' : 'actif';
    const action = newStatus === 'suspendu' ? 'suspendre' : 'réactiver';
    if (confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${user.prenom} ${user.nom} ?`)) {
      setUtilisateurs(utilisateurs.map(u =>
        u.id === user.id ? { ...u, statut: newStatus } : u
      ));
    }
  };

  const handleDeleteUser = (id: string) => {
    setUtilisateurs(utilisateurs.filter(u => u.id !== id));
    setDeletingUser(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Admin</span>;
      case 'manager':
        return <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">Manager</span>;
      case 'caissier':
        return <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Caissier</span>;
      case 'livreur':
        return <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Livreur</span>;
      default:
        return null;
    }
  };

  const getInitials = (nom: string, prenom: string) => {
    return (nom[0] + prenom[0]).toUpperCase();
  };

  const getAvatarColor = (role: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-red-500',
      'manager': 'bg-orange-500',
      'caissier': 'bg-blue-500',
      'livreur': 'bg-green-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des Utilisateurs</h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rôle</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dernière connexion</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {utilisateurs.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        {user.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${getAvatarColor(user.role)} rounded-full flex items-center justify-center`}>
                          <span className="text-white text-sm font-bold">{getInitials(user.nom, user.prenom)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.prenom} {user.nom}</p>
                          <p className="text-xs text-gray-500">{user.telephone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                    <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{user.derniereConnexion}</td>
                    <td className="px-4 py-3">
                      {user.statut === 'actif' ? (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          <UserCheck className="w-3 h-3 mr-1" /> Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                          <UserX className="w-3 h-3 mr-1" /> Suspendu
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <button
                          className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                          onClick={() => handleEditUser(user)}
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded transition-colors"
                          onClick={() => handleResetPassword(user)}
                          title="Réinitialiser MDP"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-2 rounded transition-colors ${
                            user.statut === 'actif'
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          onClick={() => handleToggleStatus(user)}
                          title={user.statut === 'actif' ? 'Suspendre' : 'Activer'}
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-2 rounded transition-colors ${
                            user.role === 'admin'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                          onClick={() => setDeletingUser(user)}
                          disabled={user.role === 'admin'}
                          title={user.role === 'admin' ? 'Impossible de supprimer admin' : 'Supprimer'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-sm text-gray-600 px-4 mt-4">
          {utilisateurs.length} utilisateurs | Utilisateur: Admin | <span className="font-semibold">COCOPROJECTS</span>
        </div>
      </div>

      <UtilisateurForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        utilisateur={editingUser}
      />

      <UtilisateurDeleteModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteUser}
        utilisateur={deletingUser}
      />
    </div>
  );
};

export default UtilisateurManager;
