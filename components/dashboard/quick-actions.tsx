"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, User, Heart, HelpCircle } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Browse Products",
      description: "Discover new items",
      icon: ShoppingBag,
      href: "/products",
      color: "text-blue-600",
    },
    {
      title: "Update Profile",
      description: "Manage your account",
      icon: User,
      href: "/profile",
      color: "text-green-600",
    },
    {
      title: "Wishlist",
      description: "View saved items",
      icon: Heart,
      href: "/wishlist",
      color: "text-red-600",
    },
    {
      title: "Help Center",
      description: "Get support",
      icon: HelpCircle,
      href: "/help",
      color: "text-purple-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button key={action.title} variant="outline" className="w-full justify-start h-auto p-4" asChild>
            <Link href={action.href}>
              <action.icon className={`mr-3 h-5 w-5 ${action.color}`} />
              <div className="text-left">
                <p className="font-medium">{action.title}</p>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
