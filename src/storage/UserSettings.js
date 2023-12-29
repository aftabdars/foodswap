import { getCachedData, setCachedData, removeCachedData, setCachedDataNoAsync } from "./Storage";

//==========================Theme Settings================================//

// Gets user theme
export const getUserTheme = async () => {
    theme = await getCachedData('theme');
    return JSON.parse(theme);
};

// Sets or updates user theme
export const setUserTheme = (theme) => {
    return setCachedDataNoAsync('theme', JSON.stringify(theme));
};

// Removes user theme
export const removeUserTheme = () => {
    return removeCachedData('theme');
};
