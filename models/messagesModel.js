import pool from "../db/pool.js";

const createMessage = async (message) => {
  const { title, text, user_id } = message;
  const query = `INSERT INTO messages (title, text, user_id)
    VALUES ($1, $2, $3)
    RETURNING *`;
  const values = [title, text, user_id];
  const result = await pool.query(query, values);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};

const getAllMessagesWithAuthors = async () => {
  const query = `
  SELECT 
    m.id,
    m.title, 
    m.text,
    m.created_at,
    u.first_name,
    u.last_name
  FROM messages m
  JOIN users u ON m.user_id = u.id
  ORDER BY m.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    text: row.text,
    created_at: row.created_at,
    author: {
      first_name: row.first_name,
      last_name: row.last_name,
    },
  }));
};

const deleteMessage = async (id) => {
  const query = `DELETE FROM messages WHERE id = $1 RETURNING *`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export { createMessage, getAllMessagesWithAuthors, deleteMessage };
