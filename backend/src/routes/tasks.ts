import { Router } from 'express';
import pool from '../db';
import { Task } from '../types';

const router = Router();


router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'error interno' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, estado } = req.body as Partial<Task>;
    if (!titulo) return res.status(400).json({ error: 'titulo es requerido' });
    const result = await pool.query(
      'INSERT INTO tasks (titulo, descripcion, estado) VALUES ($1,$2,$3) RETURNING *',
      [titulo, descripcion || null, estado || 'pendiente']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'error interno' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tasks WHERE id=$1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'error interno' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado } = req.body as Partial<Task>;
    const result = await pool.query(
      'UPDATE tasks SET titulo=$1, descripcion=$2, estado=$3 WHERE id=$4 RETURNING *',
      [titulo, descripcion ?? null, estado ?? 'pendiente', id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'error interno' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'no encontrado' });
    res.json({ message: 'eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'error interno' });
  }
});

export default router;
