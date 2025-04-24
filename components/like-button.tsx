"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { likeArticle } from "@/lib/api"

interface LikeButtonProps {
  articleId: string
  initialLikes: number
}

export function LikeButton({ articleId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like articles",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await likeArticle(articleId)
      setLikes((prev) => prev + 1)
      setIsLiked(true)
      toast({
        title: "Article liked",
        description: "You've successfully liked this article",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like the article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLiked || isLoading || !isAuthenticated}
      className={`group ${isLiked ? "text-pink-600" : "text-gray-500 hover:text-pink-600"}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </Button>
  )
}
