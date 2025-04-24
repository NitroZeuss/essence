"use client"

import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { motion } from "framer-motion"

interface Article {
  id: string
  title: string
  content: string
  author?: {
    name?: string
  }
  createdAt: string
  image?: string
}

interface ArticleCardProps {
  article: Article
  category: string
}

export function ArticleCard({ article, category }: ArticleCardProps) {
  // Create excerpt from content (first 100 chars)
  const excerpt = article.content
    ? article.content.replace(/<[^>]*>/g, "").substring(0, 100) + (article.content.length > 100 ? "..." : "")
    : "No content available"

  // Determine image URL
  const imageUrl = article.image
    ? `https://res.cloudinary.com/dxf2c3jnr/${article.image}`
    : `https://source.unsplash.com/random/400x250/?abstract,minimal`

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={item}>
      <Link href={`/article/${article.id}`}>
        <div className="group h-full flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card shadow-sm transition-all hover:shadow-md">
          <div className="relative h-48 overflow-hidden">
            <motion.div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
              {category}
            </div>
          </div>

          <div className="flex flex-col flex-1 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                {article.author?.name?.charAt(0) || "A"}
              </div>
              <span className="text-sm text-muted-foreground">{article.author?.name || "Anonymous"}</span>
              <span className="text-muted-foreground/50 text-sm">•</span>
              <time dateTime={article.createdAt} className="text-sm text-muted-foreground">
                {formatDate(article.createdAt)}
              </time>
            </div>

            <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>

            <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">{excerpt}</p>

            <div className="flex items-center justify-end mt-auto pt-4 border-t border-border/40">
              <span className="text-primary text-sm font-medium group-hover:underline">Read more</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
