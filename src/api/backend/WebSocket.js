import { BACKEND_WS_ENDPOINT } from '../config';

// Initiates a chat socket
export const WSChat = (chatRoom) => {
    return new WebSocket(`${BACKEND_WS_ENDPOINT}/chat/${chatRoom}/`);
}

// Initiates a foodswap socket
export const WSFoodSwap = (swapRoom) => {
    return new WebSocket(`${BACKEND_WS_ENDPOINT}/foodswap/${swapRoom}/`);
}
