import {
    makeGetRequest, 
    makePostRequest,
    makePutRequest,
    makeDeleteRequest
} 
from "./Api";


// Gets all levels matching params
export async function getLevels(params) {
    const url = `/gamification/levels/`;
    return await makeGetRequest(url, undefined, params);
}

// Gets a level
export async function getLevel(id) {
    const url = `/gamification/levels/${id}`;
    return await makeGetRequest(url, undefined);
}
