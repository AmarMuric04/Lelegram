import { createBrowserRouter } from "react-router-dom";
import ChatPage from "./pages/ChatPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Root from "./components/Root.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <AuthPage /> },
      { path: "/k", element: <ChatPage /> },
      { path: "/k/:chatId", element: <ChatPage /> },
    ],
  },
]);
