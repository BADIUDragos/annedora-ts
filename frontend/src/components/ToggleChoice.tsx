import React, { useState } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { setOrderOption } from "../store/slices/orderSlice";
import { DeliveryPickupInterface } from "../store/interfaces/orderInterfaces";
import { useDispatch } from "react-redux";

interface ToggleChoiceInterface {
  firstOption: string;
  secondOption: string;
}

const ToggleChoice: React.FC<ToggleChoiceInterface> = ({
  firstOption,
  secondOption,
}) => {
  const options = [firstOption, secondOption];
  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] =
    useState<DeliveryPickupInterface>("Pick-up");

  const handleChange = (value: DeliveryPickupInterface) => {
    setSelectedOption(value); 
    dispatch(setOrderOption(value)); 
  };

  return (
    <ToggleButtonGroup
      type="radio"
      className="w-100 mb-3"
      name="options"
      value={selectedOption}
      onChange={handleChange}
    >
      {options.map((option, index) => (
        <ToggleButton
          style={{
            backgroundColor: selectedOption === option ? "black" : "#ffc600",
          }}
          key={index}
          id={`tbg-radio-${index}`}
          value={option}
        >
          {option}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ToggleChoice;
