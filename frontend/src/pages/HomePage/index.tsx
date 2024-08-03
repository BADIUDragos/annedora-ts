import { Container } from "react-bootstrap";
import AnnedoraCarousel from "./AnnedoraCarousel";
import ProductCategories from "./ProductCategories";
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {

  const { t } = useTranslation('home')

  return (
    <Container>
      <h1>{t('carouselTitle')}</h1>
      <AnnedoraCarousel/>
      <h1>{t('categoriesTitle')}</h1>
      <ProductCategories/>
    </Container>
  );
};

export default HomePage;
