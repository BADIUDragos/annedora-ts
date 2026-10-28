import { act } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import setupStore from "../../store";
import { addItemToCart, clearCart } from "../../store/slices/cartSlice";
import PlaceOrderScreen from "./index";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

vi.mock("./components/Payment", () => ({
  default: () => null,
}));

const getTotal = vi.fn(() => ({
  unwrap: () =>
    Promise.resolve({ subtotal: 10, tax: 0, shipping: 0, total: 10 }),
}));

vi.mock("../../store/apis/orderApi", () => ({
  useGetTotalMutation: () => [getTotal, { isLoading: false }],
}));

describe("PlaceOrderScreen", () => {
  beforeEach(() => {
    localStorage.clear();
    getTotal.mockClear();
  });

  it("does not crash when the cart is cleared after the page has rendered", () => {
    const store = setupStore();
    store.dispatch(
      addItemToCart({
        id: 1,
        name: "Honey",
        french_name: "Miel",
        image: "",
        price: 10,
        count_in_stock: 5,
        qty: 1,
      })
    );

    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <Provider store={store}>
          <MemoryRouter>
            <PlaceOrderScreen />
          </MemoryRouter>
        </Provider>
      );
    });

    expect(container.textContent).toContain("details");

    expect(() => {
      act(() => {
        store.dispatch(clearCart());
      });
    }).not.toThrow();

    act(() => root.unmount());
  });
});
