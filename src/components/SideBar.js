import { View, Text } from "react-native";

const SideBar = (props)=> {
    return (
        <View style={{backgroundColor: props.colors.background, flex:1, justifyContent: 'space-evenly', alignItems: 'center'}}>
            <Text style={{color: props.colors.foreground}}>1</Text>
        </View>
    )
}
export default SideBar