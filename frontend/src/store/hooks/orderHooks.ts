import { useSelector } from 'react-redux';
import { OrderState } from '../interfaces/orderInterfaces';

export const useOrder = () => {
  return useSelector((state: { order: OrderState }) => state.order);
};
