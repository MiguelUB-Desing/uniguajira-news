import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me-in-prod';

export function issueToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

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