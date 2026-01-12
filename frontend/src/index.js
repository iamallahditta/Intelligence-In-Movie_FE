import "./index.css";
import "./config/i18nextConfig";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";

// Create a custom history object
export const customHistory = createBrowserHistory();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <HistoryRouter history={customHistory}>
      <App />
    </HistoryRouter>
  </QueryClientProvider>
);
