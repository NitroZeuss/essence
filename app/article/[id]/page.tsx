import { fetchArticleById, fetchCategories, fetchComments } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { CommentSection } from "@/components/comment-section"
import { ArticleActions } from "@/components/article-actions"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RelatedArticles } from "@/components/related-articles"

// 🔥 Do NOT import any `PageProps` from somewhere else
// 👇 Use inline typing
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = await fetchArticleById(params.id)
  return {
    title: `${article.title} | Essence`,
    description: article.content.substring(0, 160).replace(/<[^>]*>/g, ""),
  }
}

// 👇 This also must match exactly — no `PageProps` type
export default async function Page({ params }: { params: { id: string } }) {
  const articleId = params.id

  try {
    const article = await fetchArticleById(articleId)
    const categories = await fetchCategories()
    const allComments = await fetchComments()

    const articleComments = allComments.filter((comment) => comment.articleId === articleId)
    const category = categories.find((cat) => cat.id === article.categoryId)

    const imageUrl = article.image
      ? `https://res.cloudinary.com/dxf2c3jnr/${article.image}`
      : `https://source.unsplash.com/random/1200x600/?abstract,minimal`

    return (
      <div className="bg-background">
        <div className="w-full h-[50vh] relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 h-full flex items-end pb-12 relative z-10">
            <div className="max-w-3xl">
              <div className="text-sm font-medium text-white/80 mb-2">
                {category?.name || "Uncategorized"}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {article.author?.name?.charAt(0) || "A"}
                  </div>
                  <span className="ml-2">{article.author?.name || "Anonymous"}</span>
                </div>
                <span>•</span>
                <time dateTime={article.createdAt}>{formatDate(article.createdAt)}</time>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div
              className="article-content mb-12"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            <ArticleActions articleId={articleId} />
            <CommentSection articleId={articleId} initialComments={articleComments} />
          </div>
        </div>

        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">More Articles</h2>
            <RelatedArticles
              currentArticleId={articleId}
              categoryId={article.categoryId}
            />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return notFound()
  }
}
