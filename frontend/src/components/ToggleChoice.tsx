import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { useCart } from "../store/hooks/cartHooks";
import { useGetTotalMutation } from "../store/apis/orderApi";
import { setOrderOption, setPrices } from "../store/slices/orderSlice";
import { useOrder } from "../store/hooks/orderHooks";
import { DeliveryPickupInterface } from "../store/interfaces/orderInterfaces";

interface ToggleChoiceInterface {
  firstOption: string;
  secondOption: string;
}

const ToggleChoice: React.FC<ToggleChoiceInterface> = ({
  firstOption,
  secondOption,
}) => {
  const options = [firstOption, secondOption];
  const cart = useCart();
  const [getTotal] = useGetTotalMutation();
  const { cartItems } = cart;
  const { option : selectedOption} = useOrder();
  const dispatch = useDispatch();

  useEffect(() => {
    const items = cartItems.map(item => ({
        id: item.id,
        qty: item.qty
    }));

    getTotal({ items, option: selectedOption }).unwrap()
      .then(fetchedPrices => {
        dispatch(setPrices(fetchedPrices));
      })
      .catch(error => console.error('Failed to fetch prices:', error));
}, [selectedOption, cartItems, getTotal, dispatch]);


const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  if (value !== "Shipping" && value !== "Pick-up") {
      console.error("Invalid option");
      return;
  }

  const newOption = value as DeliveryPickupInterface;
  dispatch(setOrderOption(newOption));

  const items = cartItems.map(item => ({
      id: item.id,
      qty: item.qty
  }));

  getTotal({ items, option: newOption }).unwrap()
    .then(fetchedPrices => {
      dispatch(setPrices(fetchedPrices));
    })
    .catch(error => console.error('Failed to fetch prices:', error));
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
