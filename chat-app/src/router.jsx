import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Main from "./components/Main.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
  },
  {
    path: "/auth",
    element: (
      <PrivateRoute isAuthPage={true}>
        <App />
      </PrivateRoute>
    ),
  },
]);
