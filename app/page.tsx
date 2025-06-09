"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  MessageSquare,
  Shield,
  Users,
  Settings,
  Send,
  History,
  BarChart3,
  Zap,
  Clock,
  CheckCircle,
  TrendingUp,
  Star,
  Globe,
  Smartphone,
  ArrowRight,
  Play,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalWebhooks: 0,
    todayWebhooks: 0,
    successRate: 0,
  })

  useEffect(() => {
    // Check for session first, then fallback to localStorage
    if (session?.user) {
      const userData = {
        id: session.user.discordId,
        username: session.user.username,
        discriminator: session.user.discriminator,
        avatar: session.user.avatar
          ? `https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png`
          : "/placeholder.svg?height=24&width=24",
        isAdmin: session.user.discordId === "808641359006400512",
      }
      setUser(userData)
      localStorage.setItem("discord_user", JSON.stringify(userData))
    } else {
      // Fallback to localStorage for demo mode
      const userData = localStorage.getItem("discord_user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
  }, [session])

  useEffect(() => {
    if (user) {
      loadUserStats()
    }
  }, [user])

  const loadUserStats = () => {
    const history = localStorage.getItem("webhook_history")
    if (history) {
      const webhooks = JSON.parse(history)
      const today = new Date().toDateString()
      const todayWebhooks = webhooks.filter((w) => new Date(w.timestamp).toDateString() === today)
      const successfulWebhooks = webhooks.filter((w) => w.status === "success")

      setStats({
        totalWebhooks: webhooks.length,
        todayWebhooks: todayWebhooks.length,
        successRate: webhooks.length > 0 ? Math.round((successfulWebhooks.length / webhooks.length) * 100) : 0,
      })
    }
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Render different content for logged in users
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Discord Webhook Manager</h1>
              </div>

              <nav className="flex items-center space-x-4">
                <ThemeToggle />
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                {(user.id === "808641359006400512" || user.isAdmin) && (
                  <Link href="/admin">
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <img
                    src={user.avatar || "/placeholder.svg?height=24&width=24"}
                    alt={user.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</span>
                  {user.isAdmin && (
                    <Badge variant="secondary" className="text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content for Logged In Users */}
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user.username}!</h2>
            <p className="text-gray-600 dark:text-gray-400">Here's your webhook activity overview</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Webhooks</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalWebhooks}</p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Today's Webhooks</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.todayWebhooks}</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.successRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/dashboard?tab=send">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="text-center">
                  <Send className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <CardTitle className="text-lg dark:text-white">Send Webhook</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center dark:text-gray-400">
                    Send a new message to Discord
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard?tab=history">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="text-center">
                  <History className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <CardTitle className="text-lg dark:text-white">View History</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center dark:text-gray-400">
                    Check your webhook history
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard?tab=settings">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="text-center">
                  <Settings className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <CardTitle className="text-lg dark:text-white">Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center dark:text-gray-400">
                    Manage your account settings
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            {(user.id === "808641359006400512" || user.isAdmin) && (
              <Link href="/admin">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="text-center">
                    <Shield className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                    <CardTitle className="text-lg dark:text-white">Admin Panel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center dark:text-gray-400">
                      Manage users and system
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>

          {/* Recent Activity */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-white">
                <BarChart3 className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription className="dark:text-gray-400">Your latest webhook activities</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.totalWebhooks === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No webhooks sent yet</p>
                  <Link href="/dashboard?tab=send">
                    <Button>Send Your First Webhook</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Webhooks are working great!</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stats.successRate}% success rate across {stats.totalWebhooks} webhooks
                        </p>
                      </div>
                    </div>
                    <Link href="/dashboard?tab=history">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Discord Webhook Manager</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Made by{" "}
                <a
                  href="https://eqwzzx.fun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  eqwzzx
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // New landing page for non-logged in users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Discord Webhook Manager</h1>
            </motion.div>

            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <ThemeToggle />
              <Link href="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Play className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </Link>
            </motion.nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              ✨ Free & Open Source
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Manage Discord Webhooks
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                Like a Pro
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Send beautiful messages to Discord channels with custom embeds, track delivery status, and manage multiple
              webhooks from one powerful dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Start Managing Webhooks
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Everything You Need</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to make Discord webhook management simple and efficient.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Send className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
                title: "Custom Messages",
                description:
                  "Send rich embeds with custom colors, usernames, and avatars. Make your messages stand out.",
                color: "blue",
              },
              {
                icon: <History className="h-8 w-8 text-green-600 dark:text-green-400" />,
                title: "Track Everything",
                description: "View detailed history of all sent webhooks with delivery status and error handling.",
                color: "green",
              },
              {
                icon: <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
                title: "Team Management",
                description: "Invite team members, manage permissions, and collaborate on webhook management.",
                color: "purple",
              },
              {
                icon: <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />,
                title: "Admin Controls",
                description: "Advanced admin panel with user management, analytics, and system configuration.",
                color: "red",
              },
              {
                icon: <Globe className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
                title: "Multiple Servers",
                description: "Manage webhooks across multiple Discord servers from a single dashboard.",
                color: "indigo",
              },
              {
                icon: <Smartphone className="h-8 w-8 text-orange-600 dark:text-orange-400" />,
                title: "Mobile Ready",
                description: "Fully responsive design that works perfectly on desktop, tablet, and mobile devices.",
                color: "orange",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 border-0 shadow-lg">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-xl dark:text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Trusted by Teams Worldwide</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join thousands of users managing their Discord communications efficiently.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Webhooks Sent" },
              { number: "99.9%", label: "Uptime" },
              { number: "500+", label: "Active Users" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Streamline Your Discord Workflow?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already managing their Discord webhooks like professionals.
            </p>
            <Link href="/auth">
              <Button size="lg" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100">
                <MessageSquare className="h-5 w-5 mr-2" />
                Get Started for Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">Discord Webhook Manager</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                The most powerful and easy-to-use Discord webhook management platform. Built for teams who value
                efficiency.
              </p>
              <div className="flex items-center space-x-4">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Open Source & Free Forever</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Discord Server
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400">
              Made with ❤️ by{" "}
              <a
                href="https://eqwzzx.fun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                eqwzzx
              </a>
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-4 md:mt-0">
              © 2024 Discord Webhook Manager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
