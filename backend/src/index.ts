import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks';
import { initDB } from './db';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);

const PORT = process.env.PORT || 4000;

initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error('Error inicializando BD:', err);
    process.exit(1);
  });