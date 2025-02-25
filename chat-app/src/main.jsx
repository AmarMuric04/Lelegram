import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/redux/redux.js";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MessageProvider } from "./store/context/MessageProvider.jsx";
import { HelmetProvider } from "react-helmet-async";

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MessageProvider>
            <RouterProvider router={router} />
          </MessageProvider>
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  </StrictMode>
);
