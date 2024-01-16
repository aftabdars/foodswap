import { postLogout } from "../api/backend/Auth";
import { removeProfile, removeStats } from "../storage/User";
import { getUserToken, removeUserToken } from "../storage/UserToken";

export const logoutUser = async (navigation, showLoading, hideLoading) => {
    showLoading();
    const token = (await getUserToken()).token;
    await postLogout(token)
        .then(response => { // Response status 204 if deleted
            console.log(response.status);
            console.log(response.data);

            // Clears some data from user storage
            removeProfile();
            removeStats();
            removeUserToken();
            //removeUserTheme();

            // Navigate to initial page like Login
            navigation.navigate('Login');
        })
        .catch(error => {
            console.log(error);
            hideLoading();
        })
}