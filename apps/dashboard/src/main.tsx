import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import App from "./App";
import "@xyflow/react/dist/style.css";
import { useDashboardStore } from "./shared/store/dashboardStore";
import { createDashboardTheme } from "./shared/theme/dashboardTheme";

const client = new QueryClient();

function DashboardRoot() {
  const themeMode = useDashboardStore((state) => state.themeMode);
  const theme = useMemo(() => createDashboardTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DashboardRoot />
  </React.StrictMode>
);
