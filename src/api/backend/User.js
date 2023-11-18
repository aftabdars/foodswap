import {
    makeGetRequest, 
    makePostRequest,
    makePutRequest,
    makeDeleteRequest
} 
from "./Api";


// Creates user account and returns user object
export async function postSignup(body) {
    const url = `/accounts/signup/`;
    const contentType = 'multipart/form-data';
    return await makePostRequest(url, undefined, body, contentType);
}

// Gets client user profile
export async function getProfile(token) {
    const url = `/accounts/profile/`;
    return await makeGetRequest(url, token);
}

// Gets all users matching params
export async function getUsers(params) {
    const url = `/accounts/`;
    return await makeGetRequest(url, undefined, params);
}

// Gets a user's data
export async function getUser(id) {
    const url = `/accounts/${id}`;
    return await makeGetRequest(url);
}

// Deletes a user
export async function deleteUser(id, token) {
    const url = `/accounts/${id}`;
    return await makeDeleteRequest(url, token);
}

// Updates a user
export async function updateUser(id, token, body) {
    const url = `/accounts/${id}`;
    const contentType = 'multipart/form-data';
    return await makePutRequest(url, token, body, contentType);
}

// Get user stats
export async function getUserStats(id) {
    const url = `/accounts/stats/${id}`;
    return await makeGetRequest(url);
}

// Get user settings
export async function getUserSettings(id) {
    const url = `/accounts/settings/${id}`;
    return await makeGetRequest(url);
}

// Update user settings
export async function updateUserSettings(id, token, body) {
    const url = `/accounts/settings/${id}`;
    return await makePutRequest(url, token, body);
}
