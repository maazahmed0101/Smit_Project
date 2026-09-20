import { useState } from "react";
import Avatar from "../Avatar/Avatar.jsx";
import Button from "../Button/Button.jsx";
import Icon from "../Icon/Icon.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLibrary } from "../../context/LibraryContext.jsx";
import { seedComments } from "../../data/comments.js";
import { formatMinutesAgo } from "../../utils/format.js";
import "./CommentSection.css";

// Comments under a video: seed comments + the ones the viewer added (localStorage).
export default function CommentSection({ videoId, baseCount = 0 }) {
  const { user, requireAuth } = useAuth();
  const { comments, addComment, deleteComment } = useLibrary();
  const [text, setText] = useState("");

  const mine = comments[videoId] || [];
  const all = [...mine, ...seedComments];
  const total = baseCount + mine.length;

  const submit = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    requireAuth((u) => {
      if (addComment(videoId, value, u)) setText("");
    }, "Log in to post a comment.");
  };

  return (
    <section className="comments" aria-labelledby="comments-title">
      <h2 id="comments-title" className="comments__title">
        {total} {total === 1 ? "Comment" : "Comments"}
      </h2>

      <form className="comments__form" onSubmit={submit}>
        <label htmlFor="comment-input" className="sr-only">
          Add a comment
        </label>
        <input
          id="comment-input"
          className="input input--round"
          placeholder="Add a Comment"
          value={text}
          maxLength={1000}
          onChange={(e) => setText(e.target.value)}
          autoComplete="off"
        />
        {text.trim() && (
          <div className="comments__buttons">
            <Button variant="ghost" size="sm" onClick={() => setText("")}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Comment
            </Button>
          </div>
        )}
      </form>

      <ul className="comments__list">
        {all.map((c) => {
          const minutes = c.createdAt ? (Date.now() - c.createdAt) / 60000 : c.minutesAgo;
          const own = user && c.authorId && c.authorId === user.id;
          return (
            <li key={c.id} className="comment">
              <Avatar src={c.avatar} name={c.authorName} size={40} />
              <div className="comment__body">
                <p className="comment__head">
                  <span className="comment__name">{c.authorName}</span>
                  <span className="comment__time">{formatMinutesAgo(minutes)}</span>
                </p>
                <p className="comment__handle">{c.handle}</p>
                <p className="comment__text">{c.text}</p>
              </div>
              {c.online && <span className="comment__online" role="img" aria-label="online" />}
              {own && (
                <button type="button" className="comment__delete" aria-label="Delete your comment" onClick={() => deleteComment(videoId, c.id)}>
                  <Icon name="trash" size={16} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
