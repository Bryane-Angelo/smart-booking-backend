import pool from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username=$1 AND password=$2 AND role=$3",
      [username, password, role]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login success", role });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
