import EmptyState from "../components/EmptyState/EmptyState.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function NotFound() {
  useDocumentTitle("Page not found");
  return (
    <EmptyState asH1 fill icon="help" title="404 - Page not found" action={{ label: "Back to home", to: "/" }}>
      The page you are looking for doesn&rsquo;t exist.
    </EmptyState>
  );
}
