"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getUserInfo } from "@/lib/api"

interface UserInfo {
  id: string
  username: string
  email: string
  bio?: string
  avatarUrl?: string
  createdAt: string
}

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      try {
        const data = await getUserInfo()
        setUserInfo(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user information",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [isAuthenticated, router, toast])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 tracking-tight">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white text-xl font-medium">
                  {userInfo?.username?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{userInfo?.username}</h3>
                  <p className="text-gray-500">{userInfo?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                  <p>{userInfo?.bio || "No bio provided"}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Member since</h4>
                  <p>{new Date(userInfo?.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => router.push("/dashboard/edit-profile")}
                >
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/change-password")}>
                Change Password
              </Button>

              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/notifications")}>
                Notification Settings
              </Button>

              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
