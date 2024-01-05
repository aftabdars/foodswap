import { getCachedData, setCachedData, removeCachedData } from "./Storage";
import { getUserToken } from "./UserToken";
import { getClientProfile, getClientStats, getClientSettings } from "../api/backend/User"; // Dependent on API

//==========================User Profile================================//

// Gets user profile
export const getProfile = async () => {
    let profile = await getCachedData('profile');
    profile = JSON.parse(profile);
    if (profile && profile !== null) {
        // Check if the profile is modified at server, if so then update in storage
        const token = await getUserToken();
        await getClientProfile(token.token, new Date(profile.timestamp))
            .then(response => {
                if (response.status === 200) { // Data was modified and body is returned
                    // Update the stored data with returned modified data and return that data
                    setProfile(response.data);
                    return response.data;
                }
                else if (response.status === 304) { // Status 304, Not Modified
                    // Same data will be returned in last return statement
                    console.log('Profile is not modified at backend');
                }
            })
            .catch(error => {
                console.log(error);
                if(error.response) console.log(error.response.status);
                //throw new Error('Error getting client profile from server');
            })
        return JSON.parse(profile.profile);
    }
    return JSON.parse(profile);
};

// Sets or updates user profile
export const setProfile = async (profile) => {
    return await setCachedData('profile', JSON.stringify({
        'profile': JSON.stringify(profile),
        'timestamp': new Date()
    }));
};

// Removes user profile
export const removeProfile = () => {
    return removeCachedData('profile');
};

//==========================User Stats================================//

export const getStats = async () => {
    let stats = await getCachedData('stats');
    stats = JSON.parse(stats);
    if (stats && stats !== null) {
        // Check if the stats is modified at server, if so then update in storage
        const token = await getUserToken();
        await getClientStats(token.token, new Date(stats.timestamp))
            .then(response => {
                if (response.status === 200) { // Data was modified and body is returned
                    // Update the stored data with returned modified data and return that data
                    setStats(response.data);
                    return response.data;
                }
                else if (response.status === 304) { // Status 304, Not Modified
                    console.log('Stats is not modified at backend');
                }
            })
            .catch(error => {
                console.log(error);
                if(error.response) console.log(error.response.status);
                //throw new Error('Error getting client stats from server');
            })
        return JSON.parse(stats.stats);
    }
    return JSON.parse(stats);
};

// Sets or updates user stats
export const setStats = async (stats) => {
    return await setCachedData('stats', JSON.stringify({
        'stats': JSON.stringify(stats),
        'timestamp': new Date()
    }));
};

// Removes user stats
export const removeStats = () => {
    return removeCachedData('stats');
};
