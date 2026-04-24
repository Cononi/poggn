import { alpha, createTheme } from "@mui/material/styles";
import type { DashboardThemeMode } from "../model/dashboard";

export function createDashboardTheme(mode: DashboardThemeMode) {
  const isDark = mode === "dark";
  const primary = isDark ? "#1d9bf0" : "#1677d2";
  const secondary = isDark ? "#9fb3c8" : "#5e6c84";
  const backgroundDefault = isDark ? "#031827" : "#eaf1f8";
  const backgroundPaper = isDark ? "#092235" : "#ffffff";
  const navSurface = isDark ? "#061c2d" : "#f6faff";
  const surfaceBorder = isDark ? alpha("#38bdf8", 0.18) : alpha("#0f4c81", 0.16);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primary,
        light: isDark ? "#4db8ff" : "#3f9af5",
        dark: isDark ? "#0b73c6" : "#0c5da8",
        contrastText: isDark ? "#00111f" : "#ffffff"
      },
      secondary: {
        main: secondary
      },
      error: {
        main: isDark ? "#f25767" : "#d92d20",
        contrastText: "#ffffff"
      },
      success: {
        main: isDark ? "#2fd07f" : "#2c7a4b",
        contrastText: isDark ? "#001f13" : "#ffffff"
      },
      warning: {
        main: isDark ? "#ff8a3d" : "#b26b00",
        contrastText: isDark ? "#251000" : "#ffffff"
      },
      info: {
        main: isDark ? "#22d3ee" : "#2467d6"
      },
      background: {
        default: backgroundDefault,
        paper: backgroundPaper
      },
      text: {
        primary: isDark ? "#f3f8ff" : "#172033",
        secondary: isDark ? "#a6b7c9" : "#5b6472"
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
        letterSpacing: 0
      },
      h2: {
        fontWeight: 700,
        letterSpacing: 0
      },
      h3: {
        fontWeight: 700,
        letterSpacing: 0
      },
      overline: {
        fontWeight: 700,
        letterSpacing: "0.08em"
      },
      h6: {
        fontWeight: 600,
        letterSpacing: 0
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
            background: isDark
              ? `linear-gradient(180deg, ${backgroundDefault} 0%, #02121f 100%)`
              : backgroundDefault
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
              ? "0 12px 24px rgba(0, 0, 0, 0.34)"
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
            backgroundColor: backgroundPaper,
            boxShadow: isDark ? "inset 0 1px 0 rgba(255, 255, 255, 0.03)" : "none"
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
            backgroundColor: alpha(navSurface, isDark ? 0.9 : 0.45)
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 1,
            paddingInline: 14,
            minHeight: 34
          },
          contained: {
            boxShadow: "none",
            backgroundColor: primary,
            "&:hover": {
              boxShadow: `0 0 0 1px ${alpha(primary, 0.35)}`
            }
          },
          outlined: {
            borderColor: alpha(primary, isDark ? 0.55 : 0.42),
            backgroundColor: alpha(primary, isDark ? 0.05 : 0.02)
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 1,
            height: 26,
            fontWeight: 700
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
            backgroundColor: alpha(navSurface, isDark ? 0.82 : 0.55)
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
