import { createTheme } from "@mui/material";
import { green, grey, red } from "@mui/material/colors";

declare module "@mui/material/styles" {
    export interface Palette {
        neutral: Palette["primary"];
    }

    export interface PaletteOptions {
        neutral: PaletteOptions["primary"];
    }
}

declare module "@mui/material/Button" {
    export interface ButtonPropsColorOverrides {
        neutral: true;
    }
}

declare module "@mui/material/ButtonGroup" {
    export interface ButtonGroupPropsColorOverrides {
        neutral: true;
    }
}

declare module "@mui/material/CircularProgress" {
    export interface CircularProgressPropsColorOverrides {
        neutral: true;
    }
}

export default createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: green[700]
        },
        secondary: {
            main: "#ca7300",
            dark: "#975d2e",
            light: "#ffc380"
        },
        neutral: {
            main: grey[300],
            contrastText: "#1c1c1c"
        },
        error: {
            main: red[500],
            dark: "#7e1e1e"
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    innerHeight: "100vh",
                    overflowY: "hidden"
                },
                "*::-webkit-scrollbar": {
                    width: "1em",
                    cursor: "pointer"
                },
                "*::-webkit-scrollbar-track": {
                    background: grey[800],
                    borderRadius: "5px"
                },
                "*::-webkit-scrollbar-thumb": {
                    background: grey[600],
                    border: `2px solid ${grey[800]}`,
                    borderRadius: "5px",
                    "&:hover": {
                        background: grey[600]
                    }
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    minHeight: 0,
                    padding: 10
                }
            }
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    minHeight: 0,
                    padding: 0
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    paddingTop: 10,
                    paddingBottom: 10
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: "1em"
                }
            }
        },
        MuiButton: {
            defaultProps: {
                variant: "outlined",
                color: "neutral"
            }
        },
        MuiButtonGroup: {
            defaultProps: {
                variant: "outlined",
                color: "neutral"
            }
        }
    }
});
