import pool from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      success: false,
      message: "Missing credentials"
    });
  }

  try {
    const result = await pool.query(
      "SELECT username, role FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "Invalid credentials"
      });
    }

    return res.json({
      success: true,
      username: result.rows[0].username,
      role: result.rows[0].role
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}