import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import Modal from "react-modal";

Modal.setAppElement("#root");

function NoteList({
  notes,
  deleteNote,
  editNote,
  pinNote,
}) {
  const [openNote, setOpenNote] =
    useState(null);
    const [isOpen, setIsOpen] =
  useState(false);

const [noteToDelete, setNoteToDelete] =
  useState(null);

 
  const toggleNote = (id) => {
    setOpenNote(
      openNote === id ? null : id
    );
  };

  return (
    <div>
      <Modal
  isOpen={isOpen}
  onRequestClose={() => setIsOpen(false)}
>
  <div className="delete-modal">
    <h2>⚠ Delete Note</h2>
    <p>Are you sure you want to delete this note?</p>

    <div className="modal-buttons">
      <button
        className="delete-btn"
        onClick={() => {
          deleteNote(noteToDelete);
          setIsOpen(false);
          setNoteToDelete(null);
        }}
      >
        Delete
      </button>

      <button
        className="cancel-btn"
        onClick={() => {
          setIsOpen(false);
          setNoteToDelete(null);
        }}
      >
        Cancel
      </button>
    </div>
  </div>
</Modal>
      {notes.map((note) => (
        <motion.div
  key={note.id}
  className="note-card"
  initial={{
    opacity: 0,
    y: 20
  }}
  animate={{
    opacity: 1,
    y: 0
  }}
  transition={{
    duration: 0.3
  }}
>
          <p className="category-tag">
            {note.category === "Study" &&
              "📚 Study"}

            {note.category === "Work" &&
              "💼 Work"}

            {note.category === "Personal" &&
              "🏠 Personal"}

            {note.category === "Ideas" &&
              "💡 Ideas"}
          </p>
{note.reminder && (
  <p>
    ⏰ Reminder:
    {new Date(
      note.reminder
    ).toLocaleString()}
  </p>
)}
          <h3
            className="note-title"
            onClick={() =>
              toggleNote(note.id)
            }
          >
            {openNote === note.id
              ? "▼"
              : "▶"}{" "}
            📝 {note.title}
          </h3>

          {openNote === note.id && (
            <>
              <div className="markdown-content">
                <ReactMarkdown>
                  {note.content}
                </ReactMarkdown>
              </div>

              {note.file_url && (
                <div
                  style={{
                    marginTop: "15px",
                  }}
                >
                  {note.file_url.match(
                    /\.(jpg|jpeg|png|gif|webp)$/i
                  ) ? (
                    <img
                      src={note.file_url}
                      alt="Attachment"
                      style={{
                        width: "100%",
                        maxWidth:
                          "500px",
                        borderRadius:
                          "12px",
                      }}
                    />
                  ) : (
                    <a
                      href={
                        note.file_url
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      📄 Open Attachment
                    </a>
                  )}
                </div>
              )}

              <p className="note-date">
                {new Date(
                  note.created_at
                ).toLocaleString(
                  "en-IN"
                )}
              </p>

              <button
                className="pin-btn"
                onClick={() =>
                  pinNote(note.id)
                }
              >
                {note.pinned
                  ? "📌 Unpin"
                  : "📍 Pin"}
              </button>

              <button
                className="edit-btn"
                onClick={() =>
                  editNote(note)
                }
              >
                Edit
              </button>

              <button
  className="delete-btn"
  onClick={() => {
    setNoteToDelete(note.id);
    setIsOpen(true);
  }}
>
  Delete
</button>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default NoteList;