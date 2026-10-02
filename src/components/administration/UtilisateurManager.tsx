import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Shield, Key, UserX, UserCheck, RefreshCw, Plus } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { useRoles } from '../../hooks/useRoles';
import { UserDto } from '../../services/userService';
import { Utilisateur } from '../lib/mock/utilisateurs';
import UtilisateurForm from './forms/utilisateurs/UtilisateurForm';
import { UtilisateurDeleteModal } from './forms/utilisateurs/UtilisateurDeleteModal';

interface UtilisateurManagerProps {
  onRegisterNewAction?: (action: () => void) => void;
}

// Rôles autorisés à voir tous les utilisateurs
const ROLES_ADMIN = ['owner', 'Owner', 'manager', 'Manager', 'admin', 'Admin'];

function decodeJwtPayload(): Record<string, any> | null {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function getCurrentUserInfo() {
  const p = decodeJwtPayload();
  if (!p) return { role: '', email: '', id: '', isSuperAdmin: false };
  const role: string =
    p.role ?? p.roleName ?? p.RoleName ??
    p['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? '';
  const email: string =
    p.email ?? p['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? '';
  const id: string =
    p.sub ?? p.nameid ?? p['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? '';
  const isSuperAdmin: boolean = p.isSuperAdmin === true || p.IsSuperAdmin === 'true';
  return { role, email, id, isSuperAdmin };
}

// Adapte un UserDto vers l'interface Utilisateur attendue par les formulaires existants
function toUtilisateur(u: UserDto): Utilisateur {
  return {
    id: u.id,
    code: `USR-${u.id.slice(0, 6).toUpperCase()}`,
    nom: u.nom ?? '',
    prenom: u.prenom ?? '',
    email: u.email,
    telephone: u.telephone,
    role: (u.roleName as Utilisateur['role']) ?? 'caissier',
    statut: u.isActive ? 'actif' : 'suspendu',
    derniereConnexion: u.lastLoginAt ?? '—',
  };
}

const UtilisateurManager: React.FC<UtilisateurManagerProps> = ({ onRegisterNewAction }) => {
  const { users, loading, error, total, fetchUsers, createUser, updateUser, deleteUser } = useUsers();
  const { roles } = useRoles();

  const currentUser = getCurrentUserInfo();
  const canManageAll = currentUser.isSuperAdmin || ROLES_ADMIN.includes(currentUser.role);

  // Les rôles non-admin ne voient que leur propre compte
  const visibleUsers = canManageAll
    ? users
    : users.filter(u =>
        u.id === currentUser.id ||
        u.email.toLowerCase() === currentUser.email.toLowerCase()
      );

  const [isFormOpen,   setIsFormOpen]   = useState(false);
  const [editingUser,  setEditingUser]  = useState<UserDto | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserDto | null>(null);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleNewUser = () => { setEditingUser(null); setIsFormOpen(true); };

  useEffect(() => {
    if (onRegisterNewAction) onRegisterNewAction(() => handleNewUser);
  }, [onRegisterNewAction]);

  const handleEditUser = (user: UserDto) => { setEditingUser(user); setIsFormOpen(true); };

  const handleSaveUser = async (data: Partial<Utilisateur> & { idRole?: string; password?: string }) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          nom:       data.nom,
          prenom:    data.prenom,
          email:     data.email,
          telephone: data.telephone,
          idRole:    data.idRole,
          isActive:  data.statut ? data.statut === 'actif' : editingUser.isActive,
          password:  data.password,
        });
      } else {
        await createUser({
          nom:          data.nom!,
          prenom:       data.prenom!,
          email:        data.email!,
          telephone:    data.telephone,
          password:     data.password,
          idRole:       data.idRole,
          idEntreprise: users[0]?.idEntreprise ?? '',
        });
      }
      setIsFormOpen(false);
      setEditingUser(null);
    } catch (e) {
      console.error('[UtilisateurManager] handleSaveUser', e);
    }
  };

  const handleToggleStatus = async (user: UserDto) => {
    const willActivate = !user.isActive;
    const action = willActivate ? 'Réactiver' : 'Suspendre';
    if (!window.confirm(`${action} ${user.prenom} ${user.nom} ?`)) return;
    try {
      await updateUser(user.id, { isActive: willActivate });
    } catch (e) {
      console.error('[UtilisateurManager] handleToggleStatus', e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setDeletingUser(null);
    } catch (e) {
      console.error('[UtilisateurManager] handleDeleteUser', e);
    }
  };

  const handleResetPassword = (user: UserDto) => {
    alert(`Réinitialiser le mot de passe de ${user.prenom} ${user.nom} — À implémenter`);
  };

  // ── Helpers UI ──────────────────────────────────────────────────────────────

  const getRoleBadge = (role = '') => {
    const cfg: Record<string, { label: string; cls: string }> = {
      admin:    { label: 'Admin',    cls: 'bg-gray-900 text-white'        },
      manager:  { label: 'Manager',  cls: 'bg-gray-700 text-white'        },
      caissier: { label: 'Caissier', cls: 'bg-gray-200 text-gray-700'     },
      livreur:  { label: 'Livreur',  cls: 'bg-gray-100 text-gray-600'     },
    };
    const c = cfg[role] ?? { label: role, cls: 'bg-gray-100 text-gray-500' };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${c.cls}`}>
        {c.label}
      </span>
    );
  };

  const getInitials = (nom?: string, prenom?: string) =>
    (((nom ?? '')[0] ?? '') + ((prenom ?? '')[0] ?? '')).toUpperCase();

  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }).format(new Date(iso)).replace(',', ' ·');
    } catch {
      return iso;
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Utilisateurs</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {canManageAll ? `${total} compte${total !== 1 ? 's' : ''}` : 'Mon compte'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          {canManageAll && (
            <button
              onClick={handleNewUser}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouvel utilisateur
            </button>
          )}
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Tableau */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto relative">
          {loading && visibleUsers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                Chargement…
              </div>
            </div>
          )}
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Utilisateur</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rôle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Dernière connexion</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleUsers.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                visibleUsers.map(user => (
                  <tr key={user.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-bold">
                            {getInitials(user.nom, user.prenom)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.prenom} {user.nom}</p>
                          {user.telephone && (
                            <p className="text-xs text-gray-400">{user.telephone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">{getRoleBadge(user.roleName)}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{formatDate(user.lastLoginAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        user.isActive ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.isActive ? 'bg-gray-700' : 'bg-gray-300'
                        }`} />
                        {user.isActive
                          ? <><UserCheck className="w-3 h-3" /> Actif</>
                          : <><UserX className="w-3 h-3" /> Suspendu</>
                        }
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5">
                        {/* Modifier — toujours visible (son propre compte ou admin) */}
                        <button
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                          onClick={() => handleEditUser(user)}
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {/* Actions réservées aux Owner / Manager */}
                        {canManageAll && (
                          <>
                            <button
                              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                              onClick={() => handleResetPassword(user)}
                              title="Réinitialiser mot de passe"
                            >
                              <Key className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                              onClick={() => handleToggleStatus(user)}
                              title={user.isActive ? 'Suspendre' : 'Activer'}
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                            <button
                              className={`p-1.5 rounded transition-colors ${
                                user.roleName === 'admin'
                                  ? 'text-gray-200 cursor-not-allowed'
                                  : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                              }`}
                              onClick={() => user.roleName !== 'admin' && setDeletingUser(user)}
                              disabled={user.roleName === 'admin'}
                              title={user.roleName === 'admin' ? 'Impossible de supprimer un admin' : 'Supprimer'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulaire création / édition */}
      <UtilisateurForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingUser(null); }}
        onSave={handleSaveUser}
        utilisateur={editingUser ? toUtilisateur(editingUser) : null}
        roles={roles}
        initialIdRole={editingUser?.idRole}
      />

      {/* Modale de suppression */}
      <UtilisateurDeleteModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteUser}
        utilisateur={deletingUser ? toUtilisateur(deletingUser) : null}
      />
    </div>
  );
};

export default UtilisateurManager;
