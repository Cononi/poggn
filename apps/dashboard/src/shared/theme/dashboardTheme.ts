import { alpha, createTheme } from "@mui/material/styles";
import type { DashboardThemeMode } from "../model/dashboard";

export function createDashboardTheme(mode: DashboardThemeMode) {
  const isDark = mode === "dark";
  const primary = isDark ? "#579dff" : "#2467d6";
  const secondary = isDark ? "#9fadbc" : "#5e6c84";
  const backgroundDefault = isDark ? "#1d2125" : "#eef2f8";
  const backgroundPaper = isDark ? "#22272b" : "#ffffff";
  const navSurface = isDark ? "#1a1f24" : "#f7f9fc";
  const surfaceBorder = isDark ? alpha("#f8fafc", 0.08) : alpha("#091e42", 0.12);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primary,
        light: isDark ? "#8fbaff" : "#3f7ce8",
        dark: isDark ? "#2555b3" : "#1b4fa8",
        contrastText: isDark ? "#091e42" : "#ffffff"
      },
      secondary: {
        main: secondary
      },
      error: {
        main: isDark ? "#f87168" : "#d92d20",
        contrastText: "#ffffff"
      },
      success: {
        main: isDark ? "#6ccb8f" : "#2c7a4b",
        contrastText: isDark ? "#0f2419" : "#ffffff"
      },
      warning: {
        main: isDark ? "#d9b45d" : "#b26b00",
        contrastText: isDark ? "#23190a" : "#ffffff"
      },
      info: {
        main: isDark ? "#6ea8fe" : "#2467d6"
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
      h6: {
        fontWeight: 600,
        letterSpacing: "-0.01em"
      },
      body1: {
        lineHeight: 1.4
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
            background: backgroundDefault
          },
          "#root": {
            minHeight: "100vh"
          },
          "select, option": {
            font: "inherit",
            color: isDark ? "#f8fafc" : "#171717",
            backgroundColor: backgroundPaper
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
            border: `1px solid ${surfaceBorder}`,
            backgroundColor: backgroundPaper
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${surfaceBorder}`
          },
          head: {
            color: isDark ? "#9fadbc" : "#4f5b72",
            fontWeight: 700,
            backgroundColor: alpha(navSurface, isDark ? 0.72 : 0.45)
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 1,
            paddingInline: 14
          },
          contained: {
            boxShadow: "none"
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 1,
            height: 28
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
            borderRadius: 1,
            backgroundColor: alpha(navSurface, isDark ? 0.72 : 0.55)
          }
        }
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            borderRadius: 1,
            minHeight: "auto",
            paddingTop: 10,
            paddingBottom: 10
          },
          icon: {
            color: isDark ? "#9fadbc" : "#5e6c84"
          }
        }
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 1,
            border: `1px solid ${surfaceBorder}`,
            boxShadow: isDark
              ? "0 16px 36px rgba(0, 0, 0, 0.38)"
              : "0 16px 36px rgba(15, 23, 42, 0.14)"
          }
        }
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 1,
            marginInline: 6,
            marginBlock: 2
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 1
          }
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderColor: surfaceBorder
          }
        }
      }
    }
  });
}
