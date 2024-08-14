// theme.d.ts
import { Theme } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      backgroundImage: string;
    };
  }

  // permitir configuração através de `createTheme`
  interface ThemeOptions {
    custom?: {
      backgroundImage?: string;
    };
  }
}
