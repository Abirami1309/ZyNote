require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db");
const authRoutes = require("./routes/authRoutes");
const multer = require("multer");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

app.use(
  "/uploads",
  express.static("uploads")
);

app.post(
  "/upload",
  upload.single("file"),
  (req, res) => {
    res.json({
  fileUrl:
    "http://localhost:5000/uploads/" +
    req.file.filename,
});
  }
);

app.post("/notes", authMiddleware, (req, res) => {
  const {
    title,
    content,
    category,
    file_url,
    file_name,
    reminder,
  } = req.body;

  const userId = req.user.id;

  const sql =
    "INSERT INTO notes (title, content, category, file_url, file_name, reminder, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [
      title,
      content,
      category,
      file_url,
      file_name,
      reminder,
      userId,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.send("Note Added");
    }
  );
});

app.put("/notes/:id", authMiddleware, (req, res) => {
  const {
    title,
    content,
    category,
    file_url,
    file_name,
    reminder,
  } = req.body;

  const id = req.params.id;

  const sql =
    "UPDATE notes SET title=?, content=?, category=?, file_url=?, file_name=?, reminder=? WHERE id=? AND user_id=?";

  db.query(
    sql,
    [
      title,
      content,
      category,
      file_url,
      file_name,
      reminder,
      id,
      req.user.id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.send("Note Updated");
    }
  );
});

app.delete("/notes/:id", authMiddleware, (req, res) => {
  const id = req.params.id;

  const sql =
    "DELETE FROM notes WHERE id=? AND user_id=?";

  db.query(
    sql,
    [id, req.user.id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.send("Note Deleted");
    }
  );
});

app.put(
  "/notes/pin/:id",
  authMiddleware,
  (req, res) => {
    const id = req.params.id;

    const sql =
      `UPDATE notes
       SET pinned =
       CASE
         WHEN pinned = 1 THEN 0
         ELSE 1
       END
       WHERE id = ?
       AND user_id = ?`;

    db.query(
      sql,
      [id, req.user.id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }

        res.send("Pin Updated");
      }
    );
  }
);

app.get("/notes", authMiddleware, (req, res) => {
   //console.log("GET /notes called");
  const sql =
    "SELECT * FROM notes WHERE user_id = ? ORDER BY pinned DESC, created_at DESC";

  db.query(
    sql,
    [req.user.id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.json(result);
    }
  );
});

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});