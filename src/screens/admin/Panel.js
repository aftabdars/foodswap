import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { getColors, ThemeContext } from '../../assets/Theme';
import MaterialButtonSuccess from "../../components/MaterialButtonSuccess";


const AdminPanel = () => {
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    const navigation = useNavigation();

    const buttonPressed = (name, routeParams = {}) => {
        navigation.navigate(name, routeParams);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Admin Panel</Text>
                <Text style={styles.headerTextVersion}>v1.0</Text>
            </View>

            <MaterialButtonSuccess style={styles.button}
                onPress={() => buttonPressed('AdminManageUser')}>
                <Text style={styles.buttonText}>Manage User</Text>
            </MaterialButtonSuccess>

            <MaterialButtonSuccess style={styles.button}
                onPress={() => buttonPressed('AdminManageFood')}>
                <Text style={styles.buttonText}>Manage Food</Text>
            </MaterialButtonSuccess>

            <MaterialButtonSuccess style={styles.button}
                onPress={() => buttonPressed('AdminManageTheme')}>
                <Text style={styles.buttonText}>Manage Theme</Text>
            </MaterialButtonSuccess>

            <MaterialButtonSuccess style={styles.button}
                onPress={() => buttonPressed('AdminBugReports')}>
                <Text style={styles.buttonText}>Bug Reports</Text>
            </MaterialButtonSuccess>

            <MaterialButtonSuccess style={styles.button}
                onPress={() => buttonPressed('AdminAppFeedbacks')}>
                <Text style={styles.buttonText}>App Feedbacks</Text>
            </MaterialButtonSuccess>

        </View>
    );
};

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'baseline',
            marginBottom: 20,
        },
        headerText: {
            fontSize: 36,
            fontWeight: 'bold',
            color: colors.foreground,
            letterSpacing: 1,
            marginRight: 3,
        },
        headerTextVersion: {
            fontWeight: 'bold',
            color: colors.foreground,
        },
        button: {
            width: '100%',
            paddingVertical: 20,
            borderRadius: 20,
            marginBottom: 16,
            backgroundColor: colors.highlight1,
            elevation: 14, // Add elevation
            borderWidth: 2,
            borderColor: colors.highlight2,
        },
        buttonText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.foreground,
            textAlign: 'center',
        },
    });
}


export default AdminPanel;