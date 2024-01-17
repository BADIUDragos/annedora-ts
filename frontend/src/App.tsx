import "./bootstrap.min.css";

import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { useIdle } from "./hooks/useIdle";

function App() {

  useIdle()

  return <RouterProvider router={router} />;
}

export default App;
