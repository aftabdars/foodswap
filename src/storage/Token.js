import { getCachedData, setCachedData, removeCachedData } from "./Storage";


// Gets user token
export const getUserToken = async () => {
    token = await getCachedData('token');
    token = JSON.parse(token);
    // Check if token has expired
    if (token && new Date(token.expiry) <= Date.now()) {
        removeUserToken();
        throw new Error('Token has expired');
    }
    return token;
}

// Sets or updates user token
export const setUserToken = async (token) => {
    return await setCachedData('token', JSON.stringify(token));
};

// Removes user token
export const removeUserToken = () => {
    return removeCachedData('token');
};
