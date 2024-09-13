import { extendTheme } from "@mui/joy";
import { colors } from "@mui/material";
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    background: {
      default: colors.grey["300"]
    }
  }
})

export const joyLightTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: colors.grey["300"]
        }
      }
    }
  }
})