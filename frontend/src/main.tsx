import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { Provider } from "react-redux";
import setupStore from "./store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={setupStore()}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
