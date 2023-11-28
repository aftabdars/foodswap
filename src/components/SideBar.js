import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

const SideBar = (props)=> {
    //Theme
    const colors = props.colors;
    const styles = createStyles(colors);

    const navigation = useNavigation();

    const findUsersPressed = () => {
        navigation.navigate('Search', {userSearch: true})
    }

    return (
        <View style={styles.container}>
            <Button 
                title="Find Users"
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.button}
                onPress={findUsersPressed}
            />
        </View>
    )
}

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            backgroundColor: colors.background, 
            flex:1, 
            justifyContent: 'space-evenly', 
            alignItems: 'center'
        },
        buttonContainer: {
            
        },
        button: {
            backgroundColor: colors.highlight2
        }
    });
}

export default SideBar