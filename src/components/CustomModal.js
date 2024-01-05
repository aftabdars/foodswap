import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";


const CustomModal = (props) => {
    const colors = props.colors;
    const styles = createStyles(colors);

    return (
        <Modal
            visible={props.visible}
            animationType='fade'
            transparent={true}
            onRequestClose={props.onRequestClose}
        >
            <TouchableOpacity
                style={[styles.modalOverlay, props.style]}
                activeOpacity={1}
                onPress={props.onRequestClose}
            >
                <View style={[styles.modalContainer, props.style]}>
                    {props.children}
                </View>
            </TouchableOpacity>
        </Modal>
    )
}


function createStyles(colors) {
    return StyleSheet.create({
        modalContainer: {
            backgroundColor: colors.background2,
            padding: 10,
            margin: 10,
            marginTop: 45,
            borderRadius: 5,
            elevation: 5,
            width: '40%',
        },
        modalOverlay: {
            flex: 1,
            alignItems: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.0)', // Transparent
        },
    })
}

export default CustomModal;    