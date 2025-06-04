import axios from 'axios';
// src/hooks/useAuth.ts
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import { API_BASE_URL } from '../config/api';
import { RootState } from '../store';
import { logout } from '../store/authSlice';

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const signOut = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/bloggers/sign_out`, {
        headers: {
          Authorization: localStorage.getItem('auth_token') || '',
        },
      });
    } catch {
      console.warn('Logout failed, but continuing...');
    }
    dispatch(logout());
    localStorage.removeItem('auth_token');
  };

  return {
    user,
    signOut,
    isLoggedIn: !!user,
  };
};
