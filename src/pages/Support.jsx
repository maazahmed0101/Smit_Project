import useDocumentTitle from "../hooks/useDocumentTitle.js";

const faqs = [
  ["How do I like or follow?", "Log in (or continue as the demo user) and use the Like and Follow buttons on a video or channel page."],
  ["Where are my playlists?", "Use Save on a video to add it to Watch later or your own playlists. Open them from Collection."],
  ["Why is my data gone?", "Everything is stored in this browser (localStorage). Clearing site data or using Settings > Reset removes it."],
  ["Can I upload videos?", "Uploading is not part of this demo."],
];

export default function Support() {
  useDocumentTitle("Support");
  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <div className="page__head">
        <h1 className="page__title">Support</h1>
      </div>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {faqs.map(([q, a]) => (
          <details key={q} style={{ border: "1px solid var(--border)", padding: "12px 16px" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>{q}</summary>
            <p style={{ marginTop: 8, color: "#d0d5dd", fontSize: 14, lineHeight: "20px" }}>{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
