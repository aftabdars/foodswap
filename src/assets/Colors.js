import {Appearance} from 'react-native';

function getColors () {
    const colorScheme = Appearance.getColorScheme() || 'light';
    let colors ={}
    if (colorScheme === 'dark') {
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

let Colors = getColors()

export default Colors