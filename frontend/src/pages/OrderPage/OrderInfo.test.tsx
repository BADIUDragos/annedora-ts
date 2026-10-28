import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import OrderInfo from "./OrderInfo";
import { CreatedOrder } from "../../store/interfaces/orderInterfaces";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("OrderInfo", () => {
  it("shows the postal code field the order API returns", () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    const order = {
      user: { first_name: "Anne", email: "anne@example.com" },
      shipping_address: {
        address: "1 Rue",
        city: "Montreal",
        postal_code: "H2X 1Y4",
      },
      is_paid: false,
    } as CreatedOrder;

    act(() => {
      root.render(<OrderInfo {...order} />);
    });

    expect(container.textContent).toContain("H2X 1Y4");
    act(() => root.unmount());
  });
});
