import axios from "axios";
import { BACKEND_API_ENDPOINT, NO_IF_MODIFIED_SINCE, TOKEN_KEYWORD } from "../config";
//import { removeUserToken } from "../../storage/Token";


export async function makeGetRequest(url, token = undefined, params = undefined, ifModifiedSince = undefined) {
    const fullUrl = `${BACKEND_API_ENDPOINT}${url}`;
    console.log(`Making API GET request to: ${fullUrl}`);

    const headers = {
        'Content-Type': 'application/json',
        'If-Modified-Since': ifModifiedSince? ifModifiedSince.toUTCString() : NO_IF_MODIFIED_SINCE,
    };

    if (token) {
        headers['Authorization'] = `${TOKEN_KEYWORD} ${token}`;
    }

    try {
        const response = await axios.get(fullUrl, { headers, params });
        return response
    } catch (error) {
        console.error(`Error making GET request to ${BACKEND_API_ENDPOINT}${url}`, error);

        // Handle invalid token
        /*
        const detail = error.response.data['detail']? error.response.data['detail'] : undefined;
        if (detail && typeof detail == "string" && detail.toLowerCase() == 'invalid token.') {
            removeUserToken();
        }*/

        throw error
    }
}

export async function makePostRequest(url, token = undefined, body = {}, contentType = 'application/json') {
    const fullUrl = `${BACKEND_API_ENDPOINT}${url}`;
    console.log(`Making API POST request to: ${fullUrl}`);

    const headers = {
        'Content-Type': contentType,
        'X-CSRFToken': await getCSRFToken(), //"guUhQZzjOwyEQ3q7k5byTAIT8FqW3MFY",
    };

    if (token) {
        headers['Authorization'] = `${TOKEN_KEYWORD} ${token}`;
    }

    try {
        const response = await axios.post(fullUrl, body, { headers });
        return response
    } catch (error) {
        console.error(`Error making POST request to ${BACKEND_API_ENDPOINT}${url}`, error);
        throw error
    }
}

export async function makePutRequest(url, token = undefined, body = {}, contentType = 'application/json') {
    const fullUrl = `${BACKEND_API_ENDPOINT}${url}`;
    console.log(`Making API PUT request to: ${fullUrl}`);

    const headers = {
        'Content-Type': contentType,
        'X-CSRFToken': await getCSRFToken(),
    };

    if (token) {
        headers['Authorization'] = `${TOKEN_KEYWORD} ${token}`;
    }

    try {
        const response = await axios.put(fullUrl, body, { headers });
        return response
    } catch (error) {
        console.error(`Error making PUT request to ${BACKEND_API_ENDPOINT}${url}`, error);
        throw error
    }
}

export async function makeDeleteRequest(url, token = undefined, body = {}) {
    const fullUrl = `${BACKEND_API_ENDPOINT}${url}`;
    console.log(`Making API DELETE request to: ${fullUrl}`);

    const headers = {
        'X-CSRFToken': await getCSRFToken(),
    };

    if (token) {
        headers['Authorization'] = `${TOKEN_KEYWORD} ${token}`;
    }

    try {
        const response = await axios.delete(fullUrl, { headers: headers, data: body });
        return response
    } catch (error) {
        console.error(`Error making DELETE request to ${fullUrl}`, error);
        throw error
    }
}


const getCSRFToken = async () => {
    try {
      const response = await axios.get(`${BACKEND_API_ENDPOINT}/get_csrf_token/`);
      return response.headers['x-csrftoken'];
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export default getCSRFToken;