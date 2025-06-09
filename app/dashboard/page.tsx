"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { Send, History, Settings, ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [user, setUser] = useState(null)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [color, setColor] = useState("#5865F2")
  const [isLoading, setIsLoading] = useState(false)
  const [webhookHistory, setWebhookHistory] = useState([])
  const [lastResult, setLastResult] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "send"

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
      if (!userData) {
        router.push("/auth")
        return
      }
      setUser(JSON.parse(userData))
    }

    const history = localStorage.getItem("webhook_history")
    if (history) {
      setWebhookHistory(JSON.parse(history))
    }
  }, [session, router])

  const sendWebhook = async () => {
    if (!webhookUrl || !message) {
      setLastResult({ success: false, message: "Please fill in webhook URL and message" })
      return
    }

    setIsLoading(true)
    setLastResult(null)

    try {
      const payload = {
        content: message,
        username: username || user?.username || "Webhook Bot",
        avatar_url: avatarUrl || undefined,
        embeds: [
          {
            description: message,
            color: Number.parseInt(color.replace("#", ""), 16),
            timestamp: new Date().toISOString(),
            footer: {
              text: `Sent by ${user?.username || "Unknown User"}`,
            },
          },
        ],
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const newWebhook = {
        id: Date.now(),
        message,
        username: username || user?.username,
        timestamp: new Date().toISOString(),
        status: response.ok ? "success" : "failed",
        statusCode: response.status,
        webhookUrl: webhookUrl.split("/").slice(-2).join("/"),
      }

      const updatedHistory = [newWebhook, ...webhookHistory].slice(0, 50)
      setWebhookHistory(updatedHistory)
      localStorage.setItem("webhook_history", JSON.stringify(updatedHistory))

      if (response.ok) {
        setLastResult({ success: true, message: "Webhook sent successfully!" })
        setMessage("")
      } else {
        const errorText = await response.text()
        setLastResult({
          success: false,
          message: `Failed to send webhook: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ""}`,
        })
      }
    } catch (error) {
      const newWebhook = {
        id: Date.now(),
        message,
        username: username || user?.username,
        timestamp: new Date().toISOString(),
        status: "error",
        error: error.message,
        webhookUrl: webhookUrl.split("/").slice(-2).join("/"),
      }

      const updatedHistory = [newWebhook, ...webhookHistory].slice(0, 50)
      setWebhookHistory(updatedHistory)
      localStorage.setItem("webhook_history", JSON.stringify(updatedHistory))

      setLastResult({ success: false, message: `Error: ${error.message}` })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("discord_user")
    localStorage.removeItem("webhook_history")
    router.push("/")
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {(user.id === "808641359006400512" || user.isAdmin) && (
                <Link href="/admin">
                  <Button variant="outline">Admin Panel</Button>
                </Link>
              )}
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <img
                  src={user.avatar || "/placeholder.svg?height=24&width=24"}
                  alt={user.username}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium text-gray-900 dark:text-white">{user.username}</span>
                {user.isAdmin && <Badge variant="secondary">Admin</Badge>}
              </div>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your Discord webhooks</p>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 dark:bg-gray-800">
            <TabsTrigger value="send" className="dark:data-[state=active]:bg-gray-700">
              <Send className="mr-2 h-4 w-4" />
              Send Webhook
            </TabsTrigger>
            <TabsTrigger value="history" className="dark:data-[state=active]:bg-gray-700">
              <History className="mr-2 h-4 w-4" />
              History ({webhookHistory.length})
            </TabsTrigger>
            <TabsTrigger value="settings" className="dark:data-[state=active]:bg-gray-700">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Send Discord Webhook</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Send a message to your Discord channel via webhook
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {lastResult && (
                  <Alert
                    className={
                      lastResult.success
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                        : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                    }
                  >
                    <AlertDescription
                      className={
                        lastResult.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                      }
                    >
                      {lastResult.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="webhook-url" className="dark:text-white">
                    Webhook URL *
                  </Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="dark:text-white">
                      Custom Username
                    </Label>
                    <Input
                      id="username"
                      placeholder={user?.username || "Webhook Bot"}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar" className="dark:text-white">
                      Avatar URL
                    </Label>
                    <Input
                      id="avatar"
                      placeholder="https://example.com/avatar.png"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="dark:text-white">
                    Embed Color
                  </Label>
                  <Select value={color} onValueChange={setColor}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="#5865F2">Discord Blue</SelectItem>
                      <SelectItem value="#57F287">Green</SelectItem>
                      <SelectItem value="#FEE75C">Yellow</SelectItem>
                      <SelectItem value="#ED4245">Red</SelectItem>
                      <SelectItem value="#EB459E">Pink</SelectItem>
                      <SelectItem value="#9B59B6">Purple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="dark:text-white">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <Button
                  onClick={sendWebhook}
                  disabled={!webhookUrl || !message || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Webhook
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Webhook History</CardTitle>
                <CardDescription className="dark:text-gray-400">Your recent webhook activities</CardDescription>
              </CardHeader>
              <CardContent>
                {webhookHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">No webhooks sent yet</div>
                ) : (
                  <div className="space-y-4">
                    {webhookHistory.map((webhook) => (
                      <div
                        key={webhook.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-700/50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(webhook.status)}
                            <span className="font-medium text-gray-900 dark:text-white">{webhook.username}</span>
                            <Badge variant={webhook.status === "success" ? "default" : "destructive"}>
                              {webhook.status}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(webhook.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">{webhook.message}</p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <p>Webhook: .../{webhook.webhookUrl}</p>
                          {webhook.statusCode && <p>Status Code: {webhook.statusCode}</p>}
                          {webhook.error && <p className="text-red-600 dark:text-red-400">Error: {webhook.error}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Account Settings</CardTitle>
                <CardDescription className="dark:text-gray-400">Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <img
                    src={user.avatar || "/placeholder.svg?height=48&width=48"}
                    alt={user.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{user.username}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Discord ID: {user.id}</p>
                    {user.isAdmin && <Badge className="mt-1">Administrator</Badge>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Webhook History</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      You have sent {webhookHistory.length} webhooks
                    </p>
                    <Button
                      onClick={() => {
                        localStorage.removeItem("webhook_history")
                        setWebhookHistory([])
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Clear History
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button onClick={handleLogout} variant="destructive" className="w-full">
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
