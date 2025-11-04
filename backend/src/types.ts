export interface Task {
  id: number;
  titulo: string;
  descripcion?: string;
  estado: 'pendiente' | 'completada';
}