import { alpha, createTheme } from "@mui/material/styles";
import type { DashboardThemeMode } from "../model/dashboard";

export function createDashboardTheme(mode: DashboardThemeMode) {
  const isDark = mode === "dark";
  const primary = "#d1643a";
  const secondary = isDark ? "#94a3b8" : "#56657f";
  const backgroundDefault = isDark ? "#101417" : "#f3eee8";
  const backgroundPaper = isDark ? "#151c22" : "#fffdf9";
  const surfaceBorder = isDark ? alpha("#f8fafc", 0.1) : alpha("#111827", 0.12);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primary
      },
      secondary: {
        main: secondary
      },
      success: {
        main: isDark ? "#34d399" : "#15803d"
      },
      warning: {
        main: isDark ? "#fbbf24" : "#b45309"
      },
      info: {
        main: isDark ? "#38bdf8" : "#0284c7"
      },
      background: {
        default: backgroundDefault,
        paper: backgroundPaper
      },
      text: {
        primary: isDark ? "#f8fafc" : "#171717",
        secondary: isDark ? "#94a3b8" : "#5b6472"
      },
      divider: surfaceBorder
    },
    shape: {
      borderRadius: 1
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
          "*": {
            boxSizing: "border-box"
          },
          "html, body": {
            margin: 0,
            color: isDark ? "#f8fafc" : "#171717"
          },
          "button, input, textarea": {
            font: "inherit"
          },
          "code, pre": {
            fontFamily: '"IBM Plex Mono", "SFMono-Regular", monospace'
          },
          body: {
            minWidth: 320,
            minHeight: "100vh",
            background: isDark
              ? "radial-gradient(circle at top left, rgba(209, 100, 58, 0.14), transparent 24%), radial-gradient(circle at top right, rgba(56, 189, 248, 0.12), transparent 20%), linear-gradient(180deg, #0f1317 0%, #121920 100%)"
              : "radial-gradient(circle at top left, rgba(209, 100, 58, 0.14), transparent 24%), radial-gradient(circle at top right, rgba(56, 189, 248, 0.10), transparent 18%), linear-gradient(180deg, #f7f1ea 0%, #ece7df 100%)"
          },
          "#root": {
            minHeight: "100vh"
          },
          ".react-flow__attribution": {
            display: "none"
          },
          ".react-flow__controls": {
            boxShadow: isDark
              ? "0 12px 24px rgba(0, 0, 0, 0.36)"
              : "0 12px 24px rgba(17, 24, 39, 0.12)",
            borderRadius: 1,
            overflow: "hidden",
            border: `1px solid ${surfaceBorder}`
          },
          ".react-flow__minimap": {
            borderRadius: 1,
            overflow: "hidden",
            boxShadow: isDark
              ? "0 14px 28px rgba(0, 0, 0, 0.28)"
              : "0 14px 28px rgba(17, 24, 39, 0.12)",
            border: `1px solid ${surfaceBorder}`
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${surfaceBorder}`
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 1
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 1
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 1
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 1
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 1
          }
        }
      }
    }
  });
}
