import React, { Component, type ReactNode } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error(error, info);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Ops! Ocorreu um erro no aplicativo</Text>
          <ScrollView style={styles.errorBox}>
            <Text style={styles.errorText}>
              {this.state.error?.message || String(this.state.error)}
            </Text>
            {this.state.error?.stack && (
              <Text style={styles.stackText}>{this.state.error.stack}</Text>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.btn} onPress={this.handleRestart}>
            <Text style={styles.btnText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E04842",
    marginBottom: 16,
    textAlign: "center",
  },
  errorBox: {
    maxHeight: 300,
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
    marginBottom: 8,
  },
  stackText: {
    fontSize: 11,
    color: "#6B7280",
  },
  btn: {
    backgroundColor: "#58B741",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

