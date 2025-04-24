"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get avatar URL
  const getAvatarUrl = () => {
    if (user?.profile_image) {
      return `https://res.cloudinary.com/dxf2c3jnr/${user.profile_image}`
    }
    return `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=random`
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "border-b shadow-sm" : ""}`}>
      <div className="bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <motion.span
                className="text-2xl font-bold bg-gradient-to-r from-[#5e9bff] to-[#c2a5ff] text-transparent bg-clip-text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                Minimal
              </motion.span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  isActive("/") ? "text-[#5e9bff]" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Home
              </Link>
              <Link
                href="/explore"
                className={`text-sm font-medium transition-colors ${
                  isActive("/explore") ? "text-[#5e9bff]" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Explore
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors ${
                  isActive("/about") ? "text-[#5e9bff]" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                About
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link href="/write">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#5e9bff] text-[#5e9bff] hover:bg-[#5e9bff]/10"
                    >
                      Write Article
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 relative group">
                    <Link href="/profile" className="flex items-center gap-2">
                      <img
                        src={getAvatarUrl() || "/placeholder.svg"}
                        alt={user?.username || "User"}
                        className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-[#5e9bff] transition-all"
                      />
                      <span className="text-sm font-medium">{user?.username}</span>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={logout} className="text-gray-500 hover:text-[#5e9bff]">
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#5e9bff] to-[#c2a5ff] hover:from-[#4d8bef] hover:to-[#b194ef] text-white"
                    >
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>

            <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 space-y-4 bg-white">
              <Link
                href="/"
                className={`block text-sm font-medium transition-colors ${
                  isActive("/") ? "text-[#5e9bff]" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/explore"
                className={`block text-sm font-medium transition-colors ${
                  isActive("/explore") ? "text-[#5e9bff]" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/about"
                className={`block text-sm font-medium transition-colors ${
                  isActive("/about") ? "text-[#5e9bff]" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link href="/write" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-[#5e9bff] text-[#5e9bff]">
                      Write Article
                    </Button>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={getAvatarUrl() || "/placeholder.svg"}
                        alt={user?.username || "User"}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium">{user?.username}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="text-gray-500"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-[#5e9bff] to-[#c2a5ff] hover:from-[#4d8bef] hover:to-[#b194ef] text-white">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
