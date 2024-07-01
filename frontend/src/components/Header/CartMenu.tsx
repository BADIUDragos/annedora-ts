import { Badge, Nav } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../../store";

const CartMenu: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalItemsQuantity = Object.values(cartItems).reduce((acc, item) => acc + item.qty, 0);

  return (
    <Nav className="ms-auto">
      <NavLink to="/cart" className="nav-link">
        <FaShoppingCart />
        <Badge pill className="bg-danger">
          {totalItemsQuantity}
        </Badge>
      </NavLink>
    </Nav>
  );
};

export default CartMenu;
