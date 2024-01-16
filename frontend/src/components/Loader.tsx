import React from "react";
import { Spinner } from "react-bootstrap";

interface ILoader {
  style?: React.CSSProperties;
  className?: string;
  testid?: string
}

const Loader: React.FC<ILoader> = ({ style, className, testid }) => {
  return (
    <Spinner
      {...(testid && { 'data-testid': testid })}
      animation="border"
      role="status"
      className={className}
      style={{
        height: "100px",
        width: "100px",
        margin: "auto",
        display: "block",
        ...style,
      }}
    ></Spinner>
  );
};

export default Loader;
