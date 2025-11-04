import React, { useEffect, useState } from "react";

type Task = {
  id: number;
  titulo: string;
  descripcion?: string;
  estado: "pendiente" | "completada";
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState<number | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");

  async function fetchTasks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Error al obtener tareas");
      const data = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descripcion }),
      });
      if (!res.ok) throw new Error("No se pudo crear la tarea");
      setTitulo("");
      setDescripcion("");
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function toggleEstado(t: Task) {
    const nuevoEstado = t.estado === "pendiente" ? "completada" : "pendiente";
    await fetch(`/api/tasks/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...t, estado: nuevoEstado }),
    });
    fetchTasks();
  }

  async function eliminar(id: number) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  }

  async function guardarEdicion(id: number) {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: editTitulo,
        descripcion: editDescripcion,
      }),
    });
    setEditando(null);
    fetchTasks();
  }

  function activarEdicion(t: Task) {
    setEditando(t.id);
    setEditTitulo(t.titulo);
    setEditDescripcion(t.descripcion || "");
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "2rem auto",
        padding: "1rem 2rem",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 20, color: "#1a1a1a" }}>
        Gestor de Tareas
      </h1>

      <form
        onSubmit={createTask}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 30,
          background: "#fff",
          padding: 16,
          borderRadius: 10,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título de la tarea..."
          required
          style={{
            padding: "10px 12px",
            border: "1px solid #ddd",
            borderRadius: 6,
            fontSize: 16,
          }}
        />
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción..."
          style={{
            padding: "10px 12px",
            border: "1px solid #ddd",
            borderRadius: 6,
            fontSize: 16,
            minHeight: 60,
            resize: "none", 
          }}
        />
        <button
          type="submit"
          style={{
            alignSelf: "flex-start",
            background: "#2f3437",
            color: "#fff",
            padding: "8px 18px",
            border: "none",
            borderRadius: 6,
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.background = "#404547")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLButtonElement).style.background = "#2f3437")
          }
        >
          Crear tarea
        </button>
      </form>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tasks.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: "12px 16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {editando === t.id ? (
              <>
                <input
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  style={{
                    fontSize: 18,
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    padding: "6px 10px",
                  }}
                />
                <textarea
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  style={{
                    fontSize: 15,
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    padding: "6px 10px",
                    resize: "none",
                  }}
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => guardarEdicion(t.id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 6,
                      border: "none",
                      background: "#2f3437",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditando(null)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background: "#f6f6f6",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <strong
                    style={{
                      fontSize: 18,
                      textDecoration:
                        t.estado === "completada" ? "line-through" : "none",
                      color:
                        t.estado === "completada" ? "#7d7d7d" : "#1a1a1a",
                    }}
                  >
                    {t.titulo}
                  </strong>
                  <span
                    style={{
                      fontSize: 13,
                      color:
                        t.estado === "completada" ? "#5cb85c" : "#f0ad4e",
                      fontWeight: 600,
                    }}
                  >
                    {t.estado}
                  </span>
                </div>

                {t.descripcion && (
                  <p style={{ fontSize: 15, color: "#444", margin: "4px 0 8px" }}>
                    {t.descripcion}
                  </p>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => toggleEstado(t)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background: "#f6f6f6",
                      cursor: "pointer",
                    }}
                  >
                    {t.estado === "pendiente"
                      ? "Marcar completada"
                      : "Marcar pendiente"}
                  </button>
                  <button
                    onClick={() => activarEdicion(t)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(t.id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background: "#fff",
                      color: "#d9534f",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
