import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomModalButton = (props) => {
    const colors = props.colors;
    const styles = createStyles(colors);

    return (
        <TouchableOpacity style={[styles.modalButton, props.style]} onPress={props.onPress}>
            <Text style={styles.modalButtonText}>{props.children}</Text>
        </TouchableOpacity>
    )
}

function createStyles(colors) {
    return StyleSheet.create({
        modalButton: {
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.foreground,
            flexDirection: 'row',
            justifyContent: 'center'
        },
        modalButtonText: {
            color: colors.foreground,
        },
    });
}

export default CustomModalButton;