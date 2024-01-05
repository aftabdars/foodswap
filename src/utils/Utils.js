

export function stringCapitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


export const navigationPreviousScreenName = (navigation) => {
    const routes = navigation.getState()?.routes;
    const previousRoute = routes[routes.length - 2];

    return previousRoute && previousRoute.name;
}