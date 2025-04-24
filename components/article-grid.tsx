"use client"

import { motion } from "framer-motion"
import { ArticleCard } from "@/components/article-card"

interface Article {
  id: string
  title: string
  content: string
  author?: {
    name?: string
  }
  createdAt: string
  image?: string
  categoryId?: string
}

interface ArticleGridProps {
  articles: Article[]
  categoryMap: Record<string, string>
}

export function ArticleGrid({ articles, categoryMap }: ArticleGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          category={categoryMap[article.categoryId || ""] || "Uncategorized"}
        />
      ))}
    </motion.div>
  )
}
