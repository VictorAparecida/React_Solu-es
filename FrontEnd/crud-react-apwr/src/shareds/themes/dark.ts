import { createTheme } from "@mui/material";

export const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0357E6',
      light: '#00458E',
      contrastText: "#D5D5D5",
    },
    background: {
      default: '#2C2C2C',
      paper: '#303134',
    },
    secondary: {
      main:"#0357E6",
      light:"#fff"
    },
  },
  
  typography: {
    allVariants: {
      color: "rgba(255, 255, 255)",
    },
  },
});
