import React from "react";
import { Button, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const PollinationServices: React.FC = () => {
  const { t } = useTranslation("home");

  const buttonStyle = {
    backgroundColor: "#ffc600",
    color: "black",
    borderRadius: "5px",
    borderColor: "#ffc600",
    transition: "background-color 0.3s, transform 0.3s",
  };

  const hoverStyle = {
    backgroundColor: "#c9a204",
  };

  return (
    <Container>
      <h1 className="mx-5 mb-5">{t("pollinationTitle")}</h1>

      <h2 className="mx-5" style={{ color: "#ffc600" }}>
        {t("increaseYourYield")}
      </h2>
      <p className="mx-5">{t("weOfferPollinationServices")}</p>

      <Container className="d-flex justify-content-center">
        <Button
          className="mt-3"
          style={buttonStyle}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
            Object.assign((e.target as HTMLButtonElement).style, hoverStyle);
          }}
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
            Object.assign((e.target as HTMLButtonElement).style, buttonStyle);
          }}
        >
          {t("hostOurBees")}
        </Button>
      </Container>
    </Container>
  );
};

export default PollinationServices;
