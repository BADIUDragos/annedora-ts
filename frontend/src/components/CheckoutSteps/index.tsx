import { Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { LinkContainer } from "react-router-bootstrap";

interface CheckoutStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ step1, step2 }) => {

  const { t } = useTranslation("shipping")

  return (
    <Nav className="justify-content-center mb-4">


      <Nav.Item>
        {step1 ? (
          <LinkContainer to="/cart/address">
            <Nav.Link>{t("shipping")}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>{t("shipping")}</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to="/placeorder">
            <Nav.Link>{t("placeOrder")}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>{t("placeOrder")}</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
