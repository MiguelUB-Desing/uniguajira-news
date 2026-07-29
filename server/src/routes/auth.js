import { Router } from 'express';
import { authenticateUser, createUser } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
    const user = await authenticateUser(email, password);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ error: 'Todos los campos son requeridos' });
    const user = await createUser(nombre, email, password);
    res.status(201).json({ user });
  } catch (error) {
    if (error.message?.includes('UNIQUE')) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
