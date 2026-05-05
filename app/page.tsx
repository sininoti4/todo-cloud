'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [todos, setTodos] = useState<any[]>([])
  const [taskTitle, setTaskTitle] = useState('')

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('task')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setTodos(data)
    if (error) console.error(error)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle.trim()) return

    const { error } = await supabase
      .from('task')
      .insert([{ title: taskTitle }])

    if (error) {
      alert('追加エラー: ' + error.message)
    } else {
      setTaskTitle('')
      await fetchTodos()
    }
  }

  // --- これが削除用の関数です ---
  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('task')
      .delete()
      .eq('id', id)

    if (error) {
      alert('削除エラー: ' + error.message)
    } else {
      await fetchTodos() 
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">TODO LIST</h1>
        
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Enter." 
            className="flex-1 border border-gray-300 rounded px-4 py-2 text-black outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">追加</button>
        </form>

        <ul className="space-y-3">
          {todos.length === 0 ? (
            <p className="text-gray-400 text-center">タスクはありません</p>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className="p-3 bg-gray-50 rounded border border-gray-100 text-gray-700 flex justify-between items-center">
                <span>{todo.title}</span>
                {/* --- ここにボタンを追加しました --- */}
                <button 
                  onClick={() => handleDelete(todo.id)}
                  className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-2 py-1 rounded bg-white"
                >
                  削除
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  )
}
