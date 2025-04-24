"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Menu, X, Search, Sun, Moon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

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
    return null
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border/40 bg-background/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <motion.span
              className="text-2xl font-bold text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Essence
            </motion.span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className={`text-sm font-medium transition-colors ${
                isActive("/explore") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Explore
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                isActive("/about") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              About
            </Link>

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/write">
                  <Button variant="outline" size="sm">
                    Write Article
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
                      <Avatar>
                        <AvatarImage src={getAvatarUrl() || undefined} />
                        <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden border-t border-border/40"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 space-y-4 bg-background">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Search className="h-5 w-5" />
                </Button>

                {isAuthenticated && (
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={getAvatarUrl() || undefined} />
                      <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user?.username}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/"
                  className={`block py-2 text-sm font-medium transition-colors ${
                    isActive("/") ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/explore"
                  className={`block py-2 text-sm font-medium transition-colors ${
                    isActive("/explore") ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explore
                </Link>
                <Link
                  href="/about"
                  className={`block py-2 text-sm font-medium transition-colors ${
                    isActive("/about") ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </div>

              {isAuthenticated ? (
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <Link href="/write" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Write Article</Button>
                  </Link>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Profile
                    </Button>
                  </Link>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign up</Button>
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
