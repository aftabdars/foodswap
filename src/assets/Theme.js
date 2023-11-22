import { createContext } from 'react';
import {Appearance} from 'react-native';

export const ThemeContext = createContext(null);

export function getColors(scheme) {
    //const colorScheme = Appearance.getColorScheme() || 'light';
    let colors = {}
    if (scheme === 'dark') {
        colors = {
            highlight1: '#fe724c',
            highlight2: '#009688',
            background: '#272d2f',
            background2: '#555555',
            foreground: '#d7d7d7',
            error: "rgba(254,114,76,1)"
        }
    }
    else {
        colors = {
            highlight1: '#fe724c',
            highlight2: '#009688',
            background: '#d7d7d7',
            background2: '#e6e6e6',
            foreground: '#272d2f',
            error: "rgba(254,114,76,1)"
        }
    }
    return colors
}

/*
let Colors = getColors()

export const DefaultTheme = {
    dark: false,
    colors: {
      primary: '#fe724c',
      card: 'rgb(255, 255, 255)',
      text: '#272d2f',
      border: '#e6e6e6',
      notification: '#009688',
      highlight1: '#fe724c',
        highlight2: '#009688',
        background: '#d7d7d7',
        background2: '#e6e6e6',
        foreground: '#272d2f',
        error: "rgba(254,114,76,1)"
    },
  };
  
export const DarkTheme = {
    dark: true,
    colors: {
      primary: '#fe724c',
      card: '#555555',
      text: '#d7d7d7',
      border: '#555555',
      notification: '#009688',
      highlight1: '#fe724c',
            highlight2: '#009688',
            background: '#272d2f',
            background2: '#555555',
            foreground: '#d7d7d7',
            error: "rgba(254,114,76,1)"
    },
  };

export default Colors
*/