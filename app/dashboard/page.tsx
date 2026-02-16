"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function Dashboard() {

  const router = useRouter()

  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(true)

  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/")
        return
      }

      loadBookmarks()
      setLoading(false)
    }

    checkUser()
  }, [])

  
  const loadBookmarks = async () => {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false })

  console.log("DATA:", data)
  console.log("ERROR:", error)

  if (error) return

  setBookmarks(data || [])
}

  
  useEffect(() => {
    const channel = supabase
      .channel("realtime bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => loadBookmarks()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  
  const addBookmark = async () => {
  if (!url || !title) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase.from("bookmarks").insert({
    url,
    title,
    user_id: user?.id
  })

  if (error) {
    console.error("Insert error:", error)
    return
  }

  
  await loadBookmarks()

  setUrl("")
  setTitle("")
}


  
  const deleteBookmark = async (id:string) => {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)

  if (error) console.error("Delete error:", error)

  
  await loadBookmarks()
}

  
  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

 return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">

      <div className="max-w-2xl mx-auto">

        {/* Glass card */}
        <div className="backdrop-blur-lg border border-white/10 shadow-xl rounded-3xl p-6 bg-black/40">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              Smart Bookmarks
            </h1>

            <button
              onClick={logout}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
            >
              Logout
            </button>
          </div>

          {/* Add form */}
          <div className="flex gap-2 mb-6">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-white/10 text-white placeholder-white/50 outline-none"
            />

            <input
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-white/10 text-white placeholder-white/50 outline-none"
            />

            <button
              onClick={addBookmark}
              className="bg-white text-black px-5 rounded-xl hover:scale-105 transition font-medium"
            >
              Add
            </button>
          </div>

          {/* Bookmark list */}
          {bookmarks.length === 0 ? (
            <p className="text-center opacity-70 mt-6">
              No bookmarks yet - add your first one
            </p>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl flex justify-between items-center bg-white/10 hover:bg-white/20 transition"
                >
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {b.title}
                  </a>

                  <button
                    onClick={() => deleteBookmark(b.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
