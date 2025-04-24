import { ArticleGrid } from "@/components/article-grid"
import { fetchArticles, fetchCategories } from "@/lib/api"
import { HeroSection } from "@/components/hero-section"

export default async function Home() {
  const articles = await fetchArticles()
  const categories = await fetchCategories()

  // Create a map of category IDs to category names
  const categoryMap = categories.reduce(
    (acc, category) => {
      acc[category.id] = category.name
      return acc
    },
    {} as Record<string, string>,
  )

  // Get featured article (first article or null)
  const featuredArticle = articles.length > 0 ? articles[0] : null

  // Get remaining articles
  const remainingArticles = articles.slice(1)

  return (
    <div className="min-h-screen">
      {featuredArticle && (
        <HeroSection article={featuredArticle} category={categoryMap[featuredArticle.categoryId] || "Uncategorized"} />
      )}

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">Latest Articles</h2>
        <ArticleGrid articles={remainingArticles} categoryMap={categoryMap} />
      </div>
    </div>
  )
}
