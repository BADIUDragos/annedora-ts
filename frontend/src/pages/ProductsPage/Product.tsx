import { Card, Container } from "react-bootstrap";
import Rating from '../../components/Rating'
import { Link } from 'react-router-dom'
import { ProductState } from "../../store/interfaces/productInterfaces";
import { useTranslation } from "react-i18next";

const Product = (product: ProductState) => {
  const { t } = useTranslation("home");
  return (
    <Card className="my-3 p-3 rounded" style={{ display: 'flex', flexDirection: 'column' }}>
      <Link to={`/products/${product.id}`}>
        <Card.Img src={product.image} />
      </Link>
      <Card.Body style={{ marginTop: 'auto', flex: 0 }}>
        <Link to={`/products/${product.id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <div className="my-3">
            <Rating value={product.rating} text={`${product.num_reviews} ` + t('review')} color={'#f8e825'}/>
          </div>
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Product;