import {
    makeGetRequest, 
    makePostRequest,
    makePutRequest,
    makeDeleteRequest
} 
from "./Api";


// Gets client user's all inbox latest messages
export async function getUserInbox(token, params) {
    const url = `/social/messages/inbox/`;
    return await makeGetRequest(url, token, params);
}

// Get messages matching paramss
export async function getMessages(token, params) {
    const url = `/social/messages/`;
    return await makeGetRequest(url, token, params);
}

// Posts a message
export async function postMessage(token, body) {
    const url = `/social/messages/`;
    const contentType = 'multipart/form-data';
    return await makePostRequest(url, token, body, contentType);
}