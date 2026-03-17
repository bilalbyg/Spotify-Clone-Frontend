import { Navigate, createBrowserRouter } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import AlbumPage from '@/pages/AlbumPage';
import ArtistPage from '@/pages/ArtistPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import PodcastPage from '@/pages/PodcastPage';
import PlaylistPage from '@/pages/PlaylistPage';
import ProfilePage from '@/pages/ProfilePage';
import SearchPage from '@/pages/SearchPage';
import SettingsPage from '@/pages/SettingsPage';
import TrackPage from '@/pages/TrackPage';
import EpisodePage from '@/pages/EpisodePage';
import { ProtectedRoute, PublicRoute } from '@/components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signin',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate replace to="/home" />,
          },
          {
            path: 'home',
            element: <HomePage />,
          },
          {
            path: 'playlist/:id',
            element: <PlaylistPage />,
          },
          {
            path: 'album/:id',
            element: <AlbumPage />,
          },
          {
            path: 'artist/:id',
            element: <ArtistPage />,
          },
          {
            path: 'show/:id',
            element: <PodcastPage />,
          },
          {
            path: 'track/:id',
            element: <TrackPage />,
          },
          {
            path: 'episode/:id',
            element: <EpisodePage />,
          },
          {
            path: 'user/:id',
            element: <ProfilePage />,
          },
          {
            path: 'preferences',
            element: <SettingsPage />,
          },
          {
            path: 'search',
            element: <SearchPage />,
          },
        ],
      },
    ],
  },
]);
