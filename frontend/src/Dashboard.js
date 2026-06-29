import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import NoteForm from "./NoteForm";
import NoteList from "./NoteList";
import logo from "./logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const token = localStorage.getItem("token");

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/";
};
const reminderSound = useRef(
  new Audio("/notification.mp3")
);
useEffect(() => {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}, []);

useEffect(() => {
  const interval = setInterval(() => {
    notes.forEach((note) => {

      if (
        note.reminder &&
        Notification.permission === "granted"
      ) {
        const reminderTime =
          new Date(note.reminder);

        const now = new Date();

        const diff =
          reminderTime.getTime() -
          now.getTime();

        if (
          diff <= 60000 &&
          diff > 0
        ) {
          new Notification(
            "🔔 ZyNote Reminder",
            {
              body: note.title,
            }
          );
          reminderSound.current.play();
        }
      }

    });
  }, 60000);

  return () =>
    clearInterval(interval);

}, [notes]);
  
const toggleTheme = () => {
  const newTheme = !darkMode;
  setDarkMode(newTheme);
  localStorage.setItem(
    "darkMode",newTheme );

  if (newTheme) {
    document.body.classList.add(
      "dark-mode"
    );
  } else {
    document.body.classList.remove(
      "dark-mode"
    );
  }
};


  const fetchNotes = async () => {
    console.log("Token:", token);
    console.log("Fetching notes...");
    const res = await axios.get(
  "http://localhost:5000/notes",
  {
    headers: {
      Authorization: token,
    },
  }
);
    setNotes(res.data);
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchNotes();

    const savedTheme =
      localStorage.getItem("darkMode");

    if (savedTheme === "true") {
      setDarkMode(true);
      document.body.classList.add(
        "dark-mode"
      );
    }
  }, []);

  const addNote = async (note) => {
    await axios.post(
  "http://localhost:5000/notes",
  note,
  {
    headers: {
      Authorization: token,
    },
  }
);
    toast.success("✅ Note Added");
    fetchNotes();
  };

  const updateNote = async (
    id,
    note
  ) => {
    await axios.put(
  `http://localhost:5000/notes/${id}`,
  note,
  {
    headers: {
      Authorization: token,
    },
  }
);
    toast.info("✏️ Note Updated");
    setEditingNote(null);
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(
  `http://localhost:5000/notes/${id}`,
  {
    headers: {
      Authorization: token,
    },
  }
);
toast.error("🗑️ Note Deleted");
fetchNotes();
  };

  const pinNote = async (id) => {
    await axios.put(
  `http://localhost:5000/notes/pin/${id}`,
  {},
  {
    headers: {
      Authorization: token,
    },
  }
);
    toast.success("📌 Note Updated");
    fetchNotes();
  };

  const editNote = (note) => {
    setEditingNote(note);
  };


  const filteredNotes = notes
  .filter((note) => {
    const matchesSearch =
      note.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      note.content
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      note.category === selectedCategory;

    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => b.pinned - a.pinned);
  const totalNotes = notes.length;

const pinnedNotes = notes.filter(
  (note) => note.pinned === 1
).length;

const studyNotes = notes.filter(
  (note) => note.category === "Study"
).length;

const workNotes = notes.filter(
  (note) => note.category === "Work"
).length;

const personalNotes = notes.filter(
  (note) => note.category === "Personal"
).length;

const ideaNotes = notes.filter(
  (note) => note.category === "Ideas"
).length;

  return (
    <motion.div
  className={`App ${darkMode ? "dark" : ""}`}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>

        <div className="top-controls">

          <button
  className="profile-nav-btn"
  onClick={() => navigate("/profile")}
>
  👤 Profile
</button>

  <button
    className="theme-btn"
    onClick={toggleTheme}
  >
    {darkMode ? "☀️ Light" : "🌙 Dark"}
  </button>

  <button
    className="logout-btn"
    onClick={handleLogout}
  >
    Logout
  </button>

</div>
      <div className="logo-container">
        <img
          src={logo}
          alt="ZyNote"
          className="logo"
        />

        <p className="tagline">Where your thoughts take shape.</p>
<h2 className="welcome-text"> Welcome, {user.name} 👋</h2>

        
      </div>

      <div className="welcome-card">
        <h2>
          ✨ Capture Your Ideas
        </h2>

        <p>
          Organize thoughts,
          tasks, recipes and
          everything important
          in one place.
        </p>
      </div>

      <div className="stats-container">

  <div className="stat-card">
    <h3>📚</h3>
    <p>Total Notes</p>
    <h2>{totalNotes}</h2>
  </div>

  <div className="stat-card">
    <h3>📌</h3>
    <p>Pinned</p>
    <h2>{pinnedNotes}</h2>
  </div>

  <div className="stat-card">
    <h3>📖</h3>
    <p>Study</p>
    <h2>{studyNotes}</h2>
  </div>

  <div className="stat-card">
    <h3>💼</h3>
    <p>Work</p>
    <h2>{workNotes}</h2>
  </div>

  <div className="stat-card">
    <h3>🏠</h3>
    <p>Personal</p>
    <h2>{personalNotes}</h2>
  </div>

  <div className="stat-card">
    <h3>💡</h3>
    <p>Ideas</p>
    <h2>{ideaNotes}</h2>
  </div>

</div>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search Notes..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="search-box"
        />
      </div>

      <div className="category-filter">
  <button
  className={
    selectedCategory === "All"
      ? "active-category"
      : ""
  }
  onClick={() => setSelectedCategory("All")}
>
  All
</button>

  <button
  className={
    selectedCategory === "Study"
      ? "active-category"
      : ""
  }
  onClick={() => setSelectedCategory("Study")}
>
  📚 Study
</button>

  <button
  className={
    selectedCategory === "Work"
      ? "active-category"
      : ""
  }
  onClick={() => setSelectedCategory("Work")}
>
  💼 Work
</button>

  <button
  className={
    selectedCategory === "Personal"
      ? "active-category"
      : ""
  }
  onClick={() => setSelectedCategory("Personal")}
>
  🏠 Personal 
</button>

  <button
  className={
    selectedCategory === "Ideas"
      ? "active-category"
      : ""
  }
  onClick={() => setSelectedCategory("Ideas")}
>
  💡 Ideas
</button>
</div>

      <NoteForm
        addNote={addNote}
        updateNote={updateNote}
        editingNote={editingNote}
      />

      <hr />

      <NoteList
        notes={filteredNotes}
        deleteNote={deleteNote}
        editNote={editNote}
        pinNote={pinNote}
      />

      <ToastContainer
        position="top-right"
        autoClose={2000}
      />
    </motion.div>
  );
}

export default Dashboard;