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
export async function getClientProfile(token, ifModifiedSince) {
    const url = `/accounts/profile/`;
    return await makeGetRequest(url, token, undefined, ifModifiedSince);
}

// Gets client user stats
export async function getClientStats(token, ifModifiedSince) {
    const url = `/accounts/profile-stats/`;
    return await makeGetRequest(url, token, undefined, ifModifiedSince);
}

// Gets client user settings
export async function getClientSettings(token, ifModifiedSince) {
    const url = `/accounts/profile-settings/`;
    return await makeGetRequest(url, token, ifModifiedSince);
}

// Gets all users matching params
export async function getUsers(token, params) {
    const url = `/accounts/`;
    return await makeGetRequest(url, token, params);
}

// Gets a user's data
export async function getUser(id, token) {
    const url = `/accounts/${id}/`;
    return await makeGetRequest(url, token);
}

// Deletes a user
export async function deleteUser(id, token) {
    const url = `/accounts/${id}/`;
    return await makeDeleteRequest(url, token);
}

// Updates a user
export async function updateUser(id, token, body) {
    const url = `/accounts/${id}/`;
    const contentType = 'multipart/form-data';
    return await makePutRequest(url, token, body, contentType);
}

// Get user stats
export async function getUserStats(id, token) {
    const url = `/accounts/stats/${id}/`;
    return await makeGetRequest(url, token);
}

// Get user settings
export async function getUserSettings(id) {
    const url = `/accounts/settings/${id}/`;
    return await makeGetRequest(url);
}

// Update user settings
export async function updateUserSettings(id, token, body) {
    const url = `/accounts/settings/${id}/`;
    return await makePutRequest(url, token, body);
}

// Toggle client user's push-notification setting
export async function postTogglePushNotification(token, body) {
    const url = `/accounts/profile-settings/toggle/push-notifications`;
    return await makePostRequest(url, token, body);
}


// Gets client user's notifications
export async function getClientNotifications(token, params) {
    const url = `/accounts/notifications/`;
    return await makeGetRequest(url, token, params);
}

// Creates or Updates user push notification token
export async function postFCMToken(token, body) {
    const url = `/accounts/fcm-token/`;
    return await makePostRequest(url, token, body);
}
