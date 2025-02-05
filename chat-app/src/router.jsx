import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Main from "./components/Main";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/auth",
    element: <App />,
  },
]);
