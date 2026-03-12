import type { MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';

type ProfileMenuProps = {
  menuRef: MutableRefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onToggle: () => void;
};

export function ProfileMenu({ menuRef, isOpen, onToggle }: ProfileMenuProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-green-700 ring-1 ring-zinc-700 transition hover:scale-105 hover:ring-zinc-400"
      >
        <img
          src="https://picsum.photos/seed/user-emre-300/300/300"
          alt={t('layout.profile.avatarAlt')}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-44 rounded-lg border border-zinc-700 bg-zinc-900 p-1 shadow-2xl shadow-black/50">
          <NavLink
            to="/user/a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
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
            onClick={() => navigate('/login')}
          >
            {t('layout.profile.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
