import { Component } from "react";
import EmptyState from "../EmptyState/EmptyState.jsx";

// Catches render errors so one broken page/data item does not blank the whole app.
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error("Page crashed:", error);
  }

  render() {
    if (this.state.failed) {
      return (
        <EmptyState
          asH1
          icon="help"
          title="Something went wrong"
          action={{ label: "Back to home", to: "/" }}
        >
          This page could not be displayed. Try going back to the home page.
        </EmptyState>
      );
    }
    return this.props.children;
  }
}
