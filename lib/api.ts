// API utility functions to connect to the backend

const BASE_URL = "https://hypo-backend-1.onrender.com/def"

// Helper function for API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`

  // Get token from localStorage if available
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

// Articles
export async function fetchArticles() {
  return apiRequest<any[]>("/article")
}

export async function fetchArticleById(id: string) {
  return apiRequest<any>(`/article/${id}`)
}

export async function createArticle(data: {
  title: string
  content: string
  categoryId: string
  authorId?: string
}) {
  return apiRequest<any>("/article", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function likeArticle(articleId: string) {
  return apiRequest<any>(`/article/${articleId}/like`, {
    method: "POST",
  })
}

// Categories
export async function fetchCategories() {
  return apiRequest<any[]>("/category")
}

// Comments
export async function fetchComments() {
  return apiRequest<any[]>("/comments")
}

export async function postComment(data: {
  articleId: string
  text: string
  authorId?: string
}) {
  return apiRequest<any>("/comments", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Authentication
export async function loginUser(credentials: { username: string; password: string }) {
  return apiRequest<{ token: string; user: any }>("/user-info", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export async function registerUser(userData: {
  username: string
  password: string
  email: string
  first_name: string
  last_name: string
  bio: string
  profile_image: null
}) {
  return apiRequest<any>("/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

// User
export async function getUserInfo() {
  return apiRequest<any>("/user-info")
}
