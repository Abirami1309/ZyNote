const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }

        if (result.length > 0) {
          return res.status(400).json({
            message: "Email already exists",
          });
        }

        // Hash password
        const hashedPassword =
          await bcrypt.hash(password, 10);

        // Insert new user
        const sql =
          "INSERT INTO users(name,email,password) VALUES(?,?,?)";

        db.query(
          sql,
          [name, email, hashedPassword],
          (err, result) => {
            if (err) {
              return res.status(500).send(err);
            }

            res.send("User Registered");
          }
        );
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (result.length === 0) {
      return res
        .status(400)
        .json({ message: "User not found" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
});

router.put("/profile", authMiddleware, (req, res) => {
  const { name, email } = req.body;

  const sql =
    "UPDATE users SET name=?, email=? WHERE id=?";

  db.query(
    sql,
    [name, email, req.user.id],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.json({
        message: "Profile Updated"
      });
    }
  );
});

router.put(
  "/change-password",
  authMiddleware,
  async (req, res) => {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const sql =
      "SELECT * FROM users WHERE id=?";

    db.query(
      sql,
      [req.user.id],
      async (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }

        const user = result[0];

        const isMatch =
          await bcrypt.compare(
            currentPassword,
            user.password
          );

        if (!isMatch) {
          return res.status(400).json({
            message:
              "Current password is incorrect",
          });
        }

        const hashedPassword =
          await bcrypt.hash(
            newPassword,
            10
          );

        db.query(
          "UPDATE users SET password=? WHERE id=?",
          [hashedPassword, req.user.id],
          (err) => {
            if (err) {
              return res.status(500).send(err);
            }

            res.json({
              message:
                "Password Updated",
            });
          }
        );
      }
    );
  }
);
module.exports = router;