import React from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BeeButton from "../../components/BeeButton";

const PollinationServices: React.FC = () => {
  const { t } = useTranslation("pollination");
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/pollinationcontact");
  };

  return (
    <Container fluid>
      <h1 className="mx-1 pb-2">{t("pollinationTitle")}</h1>

      <h3 className="mx-3 pb-2" style={{ color: "#ffc600" }}>
        {t("increaseYourYield")}
      </h3>
      <p className="mx-3 pb-3">{t("weOfferPollinationServices")}</p>

      <Container className="d-flex justify-content-center">
        <BeeButton onClick={handleClick}>{t("contactOurBees")}</BeeButton>
      </Container>
    </Container>
  );
};

export default PollinationServices;
