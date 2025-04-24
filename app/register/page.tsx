"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { registerUser } from "@/lib/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Cropper from "react-cropper"
import "cropperjs/dist/cropper.css"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
    profile_image: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState(null) // To store the uploaded image
  const [croppedImage, setCroppedImage] = useState(null) // To store the cropped image
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  const handleCrop = () => {
    const cropped = cropperRef?.current?.getCroppedCanvas().toDataURL()
    setCroppedImage(cropped)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // If a cropped image exists, include it in the formData
    const finalFormData = {
      ...formData,
      profile_image: croppedImage,
    }

    try {
      await registerUser(finalFormData)
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please log in.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const cropperRef = React.useRef(null)

  return (
    <div className="container max-w-lg mx-auto py-16 px-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your information to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us a little about yourself"
                value={formData.bio}
                onChange={handleChange}
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            {/* Profile Picture Upload and Cropper */}
            <div className="space-y-2">
              <Label htmlFor="profile_image">Profile Picture</Label>
              <Input
                id="profile_image"
                name="profile_image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="h-12"
              />
              {image && (
                <div className="my-4">
                  <Cropper
                    src={URL.createObjectURL(image)}
                    ref={cropperRef}
                    style={{ height: 400, width: "100%" }}
                    aspectRatio={1}
                    guides={false}
                    viewMode={1}
                    scalable={true}
                    zoomable={true}
                  />
                  <Button onClick={handleCrop} className="mt-4">Crop Image</Button>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
