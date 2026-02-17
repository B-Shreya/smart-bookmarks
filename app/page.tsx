"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function Home() {

  const router = useRouter()

  
 useEffect(() => {
  let mounted = true

  const checkSession = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user && mounted) {
      router.replace("/dashboard")
    }
  }

  checkSession()

  return () => { mounted = false }
}, [])


 
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`

      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800">

      {/* Glass card */}
      <div className="backdrop-blur-lg border border-white/10 shadow-xl rounded-3xl p-8 w-full max-w-md bg-black/40 text-white">

        <h1 className="text-3xl font-bold mb-3">
           Smart Bookmarks
        </h1>

        <p className="opacity-80 mb-6">
          Save and sync your favorite links securely.
        </p>

        <button
          onClick={login}
          className="w-full bg-white text-black py-3 rounded-xl hover:scale-105 transition shadow-lg font-medium"
        >
          Sign in with Google
        </button>

      </div>
    </div>
  )
}
