"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { postComment } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"

interface Comment {
  id: string
  text: string
  articleId: string
  author?: {
    name?: string
    profile_image?: string
  }
  createdAt: string
}

interface CommentSectionProps {
  articleId: string
  initialComments: Comment[]
}

export function CommentSection({ articleId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to post a comment",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      const comment = await postComment({
        articleId,
        text: newComment,
        authorId: user?.id,
      })

      setComments([comment, ...comments])
      setNewComment("")
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAvatarUrl = (comment: Comment) => {
    if (comment.author?.profile_image) {
      return `https://res.cloudinary.com/dxf2c3jnr/${comment.author.profile_image}`
    }
    return null
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

      <form onSubmit={handleSubmitComment} className="mb-8">
        <Textarea
          placeholder={isAuthenticated ? "Share your thoughts..." : "Please log in to comment"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] mb-4 resize-none"
          disabled={!isAuthenticated || isSubmitting}
        />
        <Button type="submit" disabled={!isAuthenticated || isSubmitting || !newComment.trim()}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </Button>
        {!isAuthenticated && <p className="text-sm text-muted-foreground mt-2">Please log in to post a comment</p>}
      </form>

      <AnimatePresence>
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                className="border-b border-border/40 pb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Avatar>
                    <AvatarImage src={getAvatarUrl(comment) || undefined} />
                    <AvatarFallback>{comment.author?.name?.charAt(0) || "A"}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{comment.author?.name || "Anonymous"}</span>
                  <span className="text-muted-foreground/50 text-sm">•</span>
                  <time dateTime={comment.createdAt} className="text-sm text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </time>
                </div>
                <p className="text-foreground">{comment.text}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </AnimatePresence>
    </section>
  )
}
