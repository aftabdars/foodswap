import { makePostRequest } from "./Api";


// Verifies user account from the provided code
export async function postVerifyAccount(body) {
    const url = `/accounts/verify/`;
    return await makePostRequest(url, undefined, body);
}

// Logs user in and returns a user token
export async function postLogin(body) {
    const url = `/accounts/login/`;
    return await makePostRequest(url, undefined, body);
}

// Logs user out
export async function postLogout(token, body) {
    const url = `/accounts/logout/`;
    return await makePostRequest(url, token, body);
}

// Logs user out of all devices (removes all user tokens from database)
export async function postLogoutAll(token, body) {
    const url = `/accounts/logoutall/`;
    return await makePostRequest(url, token, body);
}