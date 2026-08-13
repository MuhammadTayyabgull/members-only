import pool from "../db/pool.js";

const createUser = async (user) => {
  const { firstname, lastname, email, password } = user;
  const query = `INSERT INTO users (first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING
        RETURNING *`;

  const values = [firstname, lastname, email, password];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
export { createUser, findUserByEmail, findUserById };
