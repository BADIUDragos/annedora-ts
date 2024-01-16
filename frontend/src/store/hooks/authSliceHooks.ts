import { useSelector } from 'react-redux';
import { RootState } from '../index';

export const useAuth = () => {
  return useSelector((state: RootState) => state.auth);
};
