"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { likeArticle } from "@/lib/api"
import { Heart, Share, Bookmark } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ArticleActionsProps {
  articleId: string
}

export function ArticleActions({ articleId }: ArticleActionsProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
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

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark articles",
        variant: "destructive",
      })
      return
    }

    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "Bookmark removed" : "Article bookmarked",
      description: isBookmarked
        ? "This article has been removed from your bookmarks"
        : "This article has been added to your bookmarks",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Article link has been copied to clipboard",
      })
    }
  }

  return (
    <div className="flex items-center justify-between border-t border-b border-border/40 py-6 my-8">
      <TooltipProvider>
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                disabled={isLiked || isLoading}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={isLiked ? "fill-current" : ""} />
                <span className="sr-only">Like</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLiked ? "Liked" : "Like this article"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className={isBookmarked ? "text-primary" : ""}
              >
                <Bookmark className={isBookmarked ? "fill-current" : ""} />
                <span className="sr-only">Bookmark</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isBookmarked ? "Bookmarked" : "Bookmark this article"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share />
              <span className="sr-only">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share this article</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
