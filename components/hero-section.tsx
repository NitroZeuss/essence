"use client"

import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

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

interface HeroSectionProps {
  article: Article
  category: string
}

export function HeroSection({ article, category }: HeroSectionProps) {
  // Create excerpt from content (first 200 chars)
  const excerpt = article.content
    ? article.content.replace(/<[^>]*>/g, "").substring(0, 200) + (article.content.length > 200 ? "..." : "")
    : "No content available"

  // Determine image URL
  const imageUrl = article.image
    ? `https://res.cloudinary.com/dxf2c3jnr/${article.image}`
    : `https://source.unsplash.com/random/1200x600/?abstract,minimal`

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-sm font-medium text-primary-foreground/80 mb-2 bg-primary/80 inline-block px-3 py-1 rounded-full">
            {category}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">{article.title}</h1>
          <p className="text-white/80 text-lg mb-6 line-clamp-3">{excerpt}</p>

          <div className="flex items-center gap-4 text-white/80 mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-white font-medium">
                {article.author?.name?.charAt(0) || "A"}
              </div>
              <span className="ml-2">{article.author?.name || "Anonymous"}</span>
            </div>
            <span>•</span>
            <time dateTime={article.createdAt}>{formatDate(article.createdAt)}</time>
          </div>

          <Link href={`/article/${article.id}`}>
            <Button size="lg" className="group">
              Read Article
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
