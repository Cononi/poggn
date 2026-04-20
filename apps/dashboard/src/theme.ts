import { alpha, createTheme } from "@mui/material/styles";

export const dashboardTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#d1643a"
    },
    secondary: {
      main: "#385a73"
    },
    success: {
      main: "#2f7d62"
    },
    warning: {
      main: "#c88d1d"
    },
    background: {
      default: "#f4efe6",
      paper: "rgba(255, 251, 246, 0.88)"
    },
    text: {
      primary: "#201a16",
      secondary: "#6d6258"
    }
  },
  shape: {
    borderRadius: 20
  },
  typography: {
    fontFamily: '"Sora", "IBM Plex Sans", "Avenir Next", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.05em"
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.03em"
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.02em"
    },
    overline: {
      fontWeight: 700,
      letterSpacing: "0.18em"
    },
    button: {
      textTransform: "none",
      fontWeight: 600
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minWidth: 320,
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left, rgba(219, 137, 88, 0.34), transparent 28%), radial-gradient(circle at top right, rgba(72, 114, 140, 0.18), transparent 22%), linear-gradient(180deg, #fbf7f1 0%, #efe6d9 100%)"
        },
        "#root": {
          minHeight: "100vh"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(18px)",
          border: `1px solid ${alpha("#3a2e21", 0.09)}`
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999
        }
      }
    }
  }
});
