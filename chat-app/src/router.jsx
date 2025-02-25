import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./components/misc/PrivateRoute.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/k",
    element: (
      <PrivateRoute>
        <ChatPage />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/k/:chatId",
        element: (
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: (
      <PrivateRoute isAuthPage={true}>
        <AuthPage />
      </PrivateRoute>
    ),
  },
]);
