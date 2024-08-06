import React, { useState } from "react";
import { Button } from "react-bootstrap";


interface BeeButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    type?: "button" | "submit" | "reset"; 
    className?: string; 
  }
  
  const BeeButton: React.FC<BeeButtonProps> = ({ onClick, children, type = "button", className }) => {

    const [isHovered, setIsHovered] = useState(false);
  
    const buttonStyle = {
      backgroundColor: isHovered ? '#c9a204' : '#ffc600',
      color: 'black',
      borderRadius: '5px',
      borderColor: '#ffc600',
      transition: 'background-color 0.3s, transform 0.3s',
    };
  
    return (
      <Button
        className={`${className}`}
        style={buttonStyle}
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        onClick={onClick}
        type={type} 
      >
        {children}
      </Button>
    );
  };
  
  export default BeeButton;