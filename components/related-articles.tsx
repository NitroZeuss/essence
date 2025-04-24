"use client"

import { useEffect, useState } from "react"
import { fetchArticles } from "@/lib/api"
import { ArticleCard } from "@/components/article-card"
import { Loader2 } from "lucide-react"

interface RelatedArticlesProps {
  currentArticleId: string
  categoryId?: string
}

export function RelatedArticles({ currentArticleId, categoryId }: RelatedArticlesProps) {
  const [articles, setArticles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const allArticles = await fetchArticles()

        // Filter out current article and get articles with same category if possible
        let relatedArticles = allArticles.filter((article) => article.id !== currentArticleId)

        if (categoryId) {
          const sameCategory = relatedArticles.filter((article) => article.categoryId === categoryId)

          // If we have at least 3 articles with same category, use those
          // Otherwise, use a mix of same category and other articles
          if (sameCategory.length >= 3) {
            relatedArticles = sameCategory.slice(0, 3)
          } else {
            const otherArticles = relatedArticles.filter((article) => article.categoryId !== categoryId)
            relatedArticles = [...sameCategory, ...otherArticles].slice(0, 3)
          }
        } else {
          // If no category, just take first 3 articles
          relatedArticles = relatedArticles.slice(0, 3)
        }

        setArticles(relatedArticles)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load related articles:", error)
        setIsLoading(false)
      }
    }

    loadArticles()
  }, [currentArticleId, categoryId])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (articles.length === 0) {
    return <p className="text-center text-muted-foreground py-12">No related articles found</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} category={article.category || "Uncategorized"} />
      ))}
    </div>
  )
}
