import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const homeActivePath =
  'M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732z';
const homeInactivePath =
  'M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732z';

export function HomeButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isHomeRoute = location.pathname === '/home';

  return (
    <button
      type="button"
      data-testid="home-button"
      className={`Button-sc-1dqy6lx-0 LlNsd e-91000-overflow-wrap-anywhere e-91000-button-tertiary--icon-only _Bg_zSvFrEutyacG kUHE42xvQVzWqabl uBpmNFia37U4nzmX flex h-10 w-10 items-center justify-center rounded-full transition ${
        isHomeRoute
          ? 'kxv3By32Og8yDEXy bg-zinc-700 text-white'
          : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
      }`}
      aria-label={t('layout.home')}
      data-encore-id="buttonTertiary"
      onClick={() => navigate('/home')}
    >
      <span
        aria-hidden="true"
        className="e-91000-button__icon-wrapper inline-flex items-center justify-center"
      >
        <svg
          data-encore-id="icon"
          role="img"
          aria-hidden="true"
          className="e-91000-icon e-91000-baseline h-5 w-5 transition-colors"
          viewBox="0 0 24 24"
        >
          <path
            d={isHomeRoute ? homeActivePath : homeInactivePath}
            fill={isHomeRoute ? '#FFFFFF' : '#969696'}
          ></path>
        </svg>
      </span>
    </button>
  );
}
