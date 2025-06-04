// src/hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import axios from 'axios';

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const signOut = async () => {
    try {
      await axios.delete('http://localhost:3000/bloggers/sign_out', {
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
