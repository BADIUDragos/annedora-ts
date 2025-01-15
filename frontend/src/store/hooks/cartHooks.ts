import { useSelector } from 'react-redux';
import { RootState } from '../index';

export const useCart = () => {
  return useSelector((state: RootState) => state.cart);
};
