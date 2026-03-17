import type { MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

type ProfileMenuProps = {
  menuRef: MutableRefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onToggle: () => void;
};

export function ProfileMenu({ menuRef, isOpen, onToggle }: ProfileMenuProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-green-700 ring-1 ring-zinc-700 transition hover:scale-105 hover:ring-zinc-400"
      >
        {/* We can safely cast user?.images to any, or check properly in actual codebase, but User interface has no images field yet, so let it be */}
        {/* Since user interface doesn't have images in useAuthStore, we can just use the name initial */}
        <div className="flex h-full w-full items-center justify-center bg-zinc-700 text-sm font-bold text-white uppercase">
          {user?.name?.[0] || user?.username?.[0] || user?.email?.[0] || 'U'}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-44 rounded-lg border border-zinc-700 bg-zinc-900 p-1 shadow-2xl shadow-black/50">
          <NavLink
            to={`/user/${user?.id || 'me'}`}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm transition ${isActive ? 'bg-zinc-700 text-white' : 'text-zinc-200 hover:bg-zinc-800'}`
            }
          >
            {t('layout.profile.label')}
          </NavLink>
          <NavLink
            to="/preferences"
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm transition ${isActive ? 'bg-zinc-700 text-white' : 'text-zinc-200 hover:bg-zinc-800'}`
            }
          >
            {t('layout.profile.settings')}
          </NavLink>
          <div className="my-1 border-t border-zinc-700" />
          <button
            type="button"
            className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-200 transition hover:bg-zinc-800"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            {t('layout.profile.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
