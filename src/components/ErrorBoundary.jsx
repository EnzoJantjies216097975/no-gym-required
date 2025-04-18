import React from "react";
import { View, Text, StyleSheet } from "react-native";

class ErrorBoundry extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false , error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log('Error caught by boundary:',error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>Something went wrong</Text>
                    <Text style={styles.text}>{this.state.error?.toString()}</Text>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: '#f8f8f8'
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    error: {
        color: "red",
    }
});

export default ErrorBoundry;