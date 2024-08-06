import React from "react";
import { Button, Container } from "react-bootstrap";
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
    <Container>
      <h1 className="mx-5 mb-5">{t("pollinationTitle")}</h1>

      <h2 className="mx-5" style={{ color: "#ffc600" }}>
        {t("increaseYourYield")}
      </h2>
      <p className="mx-5">{t("weOfferPollinationServices")}</p>

      <Container className="d-flex justify-content-center">
        <BeeButton onClick={handleClick}>{t("contactOurBees")}</BeeButton>
      </Container>
    </Container>
  );
};

export default PollinationServices;
