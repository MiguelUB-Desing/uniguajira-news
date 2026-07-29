import bcrypt from 'bcrypt';
import pool from '../config/db.js';

export async function authenticateUser(email, password) {
  const conn = await pool.getConnection();
  try {
    const users = await conn.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (users.length === 0) return null;
    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return null;
    return { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
  } finally {
    conn.release();
  }
}

export async function createUser(nombre, email, password, rol = 'lector') {
  const conn = await pool.getConnection();
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await conn.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, rol]
    );
    return { id: Number(result.insertId), nombre, email, rol };
  } finally {
    conn.release();
  }
}
