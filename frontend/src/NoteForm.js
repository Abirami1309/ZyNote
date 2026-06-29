import React, { useState, useEffect, useRef} from "react";
import axios from "axios";

function NoteForm({
  addNote,
  updateNote,
  editingNote,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Personal");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [reminder, setReminder] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);

      setCategory(
        editingNote.category ||
          "Personal"
      );

      setFileUrl(
        editingNote.file_url || ""
      );

      setFileName(
        editingNote.file_name || ""
      );

      setReminder(
        editingNote.reminder || ""
      );
    }
  }, [editingNote]);

  const handleFileUpload = async (
    e
  ) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData =
      new FormData();

    formData.append("file", file);

    try {
      const res =
        await axios.post(
          "http://localhost:5000/upload",
          formData
        );

      setFileUrl(
        res.data.fileUrl
      );

      setFileName(file.name);
    } catch (err) {
      console.error(err);
      alert("File Upload Failed");
    }
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    const noteData = {
      title,
      content,
      category,
      file_url: fileUrl,
      file_name: fileName,
      reminder,
    };

    try {
      if (editingNote) {
        await updateNote(
          editingNote.id,
          noteData
        );
      } else {
        await addNote(noteData);
      }

      // Clear Form
      setTitle("");
      setContent("");
      setCategory("Personal");
      setFileUrl("");
      setFileName("");
      setReminder("");

      // Clear file input
      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value
          )
        }
        required
      />

      <textarea
        placeholder="Enter Content"
        value={content}
        onChange={(e) =>
          setContent(
            e.target.value
          )
        }
        required
      />

      <select
        value={category}
        onChange={(e) =>
          setCategory(
            e.target.value
          )
        }
      >
        <option value="Study">
          📚 Study
        </option>

        <option value="Work">
          💼 Work
        </option>

        <option value="Personal">
          🏠 Personal
        </option>

        <option value="Ideas">
          💡 Ideas
        </option>
      </select>

      <input
        type="datetime-local"
        value={reminder}
        onChange={(e) =>
          setReminder(
            e.target.value
          )
        }
      />

      <div className="upload-box">
        <label htmlFor="fileUpload">
          📎 Click to Upload File
        </label>

        <input
          ref={fileInputRef}
          id="fileUpload"
          type="file"
          accept=".pdf,.doc,.docx,.txt,image/*"
          hidden
          onChange={
            handleFileUpload
          }
        />

        {fileUrl && (
          <p>
            ✅ {fileName} Uploaded
          </p>
        )}

        {fileUrl &&
          fileUrl.match(
            /\.(jpg|jpeg|png|gif|webp)$/i
          ) && (
            <img
              src={fileUrl}
              alt="Preview"
              style={{
                width: "250px",
                borderRadius:
                  "10px",
                marginTop:
                  "10px",
              }}
            />
          )}
      </div>

      <button type="submit">
        {editingNote
          ? "Update Note"
          : "Add Note"}
      </button>
    </form>
  );
}

export default NoteForm;