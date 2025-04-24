"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { loginUser } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  isAuthenticated: boolean
  user: any | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user_data")

    if (token && userData) {
      setIsAuthenticated(true)
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Failed to parse user data", error)
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const { token, user } = await loginUser({ username, password })

      localStorage.setItem("auth_token", token)
      localStorage.setItem("user_data", JSON.stringify(user))

      setIsAuthenticated(true)
      setUser(user)

      return user
    } catch (error) {
      console.error("Login failed", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")

    setIsAuthenticated(false)
    setUser(null)

    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
  }

  if (isLoading) {
    return null // or a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
