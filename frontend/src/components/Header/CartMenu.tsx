import { Badge, Nav } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartMenu: React.FC = () => {
  const totalItemsQuantity = 0;

  return (
    <Nav className="ms-auto">
      <Link to="/cart">
        <Nav.Link>
          <FaShoppingCart />
          <Badge pill className="bg-danger">
            {totalItemsQuantity}
          </Badge>
        </Nav.Link>
      </Link>
    </Nav>
  );
};

export default CartMenu;
