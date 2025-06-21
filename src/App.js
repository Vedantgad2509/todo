import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { TimePicker } from "timepick-kit-react";
import { Toaster, toast } from 'sonner';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");

  const fetchTodos = async () => {
    const res = await fetch("http://localhost:5000/");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!task) return;
    await fetch("http://localhost:5000/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, time }),
    });
    setTask("");
    setTime("");
    fetchTodos();
  };

  const toggleTodo = async (index) => {
    const current = todos[index];
    await fetch(`http://localhost:5000/toggle/${index}`);
    fetchTodos();
    if (!current.done) {
      toast.success(`Completed: "${current.task}"`);
    }
  };

  const deleteTodo = async (index) => {
    const current = todos[index];
    await fetch(`http://localhost:5000/delete/${index}`);
    toast.warning(`Deleted: "${current.task}"`);
    fetchTodos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-700 p-4">
      <Toaster position="top-right" richColors />
      <div className="absolute inset-0 bg-noise z-0" />
      <div className="max-w-xl mx-auto p-4 rounded-xl shadow-lg bg-white/20 border border-white/30 backdrop-blur-md transition duration-300">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">Todo List</h1>

        <div className="space-y-3 mb-10">
          {todos.map((todo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex justify-between items-center p-3 bg-white/90 backdrop-blur-md shadow rounded"
            >
              <div>
                <div className={todo.done ? "line-through text-gray-500" : ""}>
                  {todo.task}
                </div>
                <small className="text-gray-400 text-sm">{todo.time}</small>
              </div>
              <div className="flex gap-2">
                <Check
                  className="text-green-600 cursor-pointer"
                  onClick={() => toggleTodo(i)}
                />
                <X
                  className="text-red-600 cursor-pointer"
                  onClick={() => deleteTodo(i)}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 items-center border-t pt-4">
          <input
            className="flex-1 p-2 border rounded"
            placeholder="New task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
           <TimePicker
            value={time}
            onChange={(val) => {
              const formatted = `${val.hour}:${val.minute} ${val.period}`;
              setTime(formatted);
            }}
            className="w-28"
          /> 
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={addTodo}
          >
            Add
          </button>
        </div>
      </div>
     
    </div>
  );
}

export default App;
