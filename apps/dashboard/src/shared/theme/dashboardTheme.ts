import { alpha, createTheme } from "@mui/material/styles";

export const dashboardTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0c66e4"
    },
    secondary: {
      main: "#44546f"
    },
    success: {
      main: "#1f845a"
    },
    warning: {
      main: "#b65c02"
    },
    info: {
      main: "#388bff"
    },
    background: {
      default: "#f7f8fa",
      paper: "rgba(255, 255, 255, 0.88)"
    },
    text: {
      primary: "#172b4d",
      secondary: "#5e6c84"
    }
  },
  shape: {
    borderRadius: 16
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Sora", "Avenir Next", sans-serif',
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
            "radial-gradient(circle at top left, rgba(56, 139, 255, 0.18), transparent 26%), radial-gradient(circle at top right, rgba(9, 30, 66, 0.08), transparent 20%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)"
        },
        "#root": {
          minHeight: "100vh"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(16px)",
          border: `1px solid ${alpha("#091e42", 0.08)}`
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12
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
