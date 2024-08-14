import { createTheme } from "@mui/material";

export const LightTheme = createTheme({
  palette: {
    primary: {
      main: '#0357E6',
      dark: '#5E5D5D',
      light: '#E7E7E7',
      contrastText: "#212128",
    },
    background: {
      default: '#F7F7F7',
      paper: '#fff',
      
    },
    secondary: {
      main:"#0357E6",
      light:"#fff"
    },
    
  },
});
