import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface TodoItem {
  id: string | number;
  name?: string;
  title?: string;
  task?: string;
  is_complete?: boolean;
  inserted_at?: string;
}

export default async function TodosPage() {
  const cookieStore = await cookies();
  let todos: TodoItem[] | null = null;
  let errorMessage: string | null = null;

  try {
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.from("todos").select();
    if (error) {
      errorMessage = error.message;
    } else if (data) {
      todos = data as unknown as TodoItem[];
    }
  } catch (err: unknown) {
    errorMessage = err instanceof Error ? err.message : "Failed to initialize Supabase client.";
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0d0f12",
      color: "#e2e8f0",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "3rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{
        maxWidth: "600px",
        width: "100%",
        backgroundColor: "#161b22",
        borderRadius: "12px",
        border: "1px solid #30363d",
        padding: "2rem",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src="/goat.png" alt="Goatie AI" width={36} height={36} style={{ borderRadius: "50%" }} />
            <h1 style={{ fontSize: "1.4rem", fontWeight: "600", margin: 0 }}>
              Goatie AI — Supabase Todos
            </h1>
          </div>
          <Link href="/" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "0.875rem" }}>
            ← Back to Home
          </Link>
        </div>

        {errorMessage ? (
          <div style={{
            padding: "1rem",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            color: "#fca5a5",
            fontSize: "0.875rem"
          }}>
            <strong>Connection note:</strong> {errorMessage}
            <div style={{ marginTop: "0.5rem", color: "#94a3b8", fontSize: "0.8rem" }}>
              (If the <code>todos</code> table has not been created yet in your Supabase SQL editor, create it to see items listed here.)
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginBottom: "1rem" }}>
              Successfully connected to Supabase!
            </p>
            {todos && todos.length > 0 ? (
              <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", margin: 0, lineHeight: "1.8" }}>
                {todos.map((todo: any) => (
                  <li key={todo.id}>{todo.name ?? JSON.stringify(todo)}</li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#64748b", fontStyle: "italic", margin: 0 }}>
                No todos found in table. Insert rows in your Supabase table to view them.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
