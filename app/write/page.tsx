"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { createArticle, fetchCategories } from "@/lib/api"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dynamically import the editor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64 border rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
})

export default function WritePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories()
        setCategories(categoriesData)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load categories:", error)
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !categoryId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newArticle = await createArticle({
        title,
        content,
        categoryId,
        authorId: user?.id,
      })

      toast({
        title: "Article published",
        description: "Your article has been published successfully",
      })

      router.push(`/article/${newArticle.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish your article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Write a new article</h1>
          <p className="text-muted-foreground">Share your thoughts with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a captivating title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="px-6"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="px-6" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Article"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
