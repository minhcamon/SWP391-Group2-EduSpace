import { useEffect, useRef, useState, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import notificationService from "@/services/notificationService"
import { toast } from "sonner"

const getWsUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api"
  return apiUrl.replace(/\/api$/, "/ws")
}

export const useNotifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const stompClientRef = useRef(null)
  const [trigger, setTrigger] = useState(0)

  const fetchNotifications = useCallback(() => {
    setTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    let active = true
    const load = async () => {
      if (!user) return
      setLoading(true)
      try {
        const data = await notificationService.getNotifications()
        if (active) {
          setNotifications(data || [])
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách thông báo:", err)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }
    load()
    return () => {
      active = false
    }
  }, [user, trigger])

  // Mark single as read
  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)),
      )
    } catch (err) {
      toast.error(err.message || "Không thể đánh dấu đã đọc")
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
      toast.success("Đã đánh dấu đọc tất cả thông báo")
    } catch (err) {
      toast.error(err.message || "Không thể đánh dấu đọc tất cả")
    }
  }

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user) return

    const wsUrl = getWsUrl()
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket Connected for notifications of user:", user.id)

        // 1. Subscribe to personal notifications
        client.subscribe(`/topic/user/${user.id}/notifications`, (message) => {
          handleIncomingNotification(message)
        })

        // 2. Subscribe to role-specific notifications
        if (user.role) {
          const rolePath = user.role.toLowerCase()
          client.subscribe(`/topic/role/${rolePath}/notifications`, (message) => {
            handleIncomingNotification(message)
          })

          if (user.role === "ADMIN") {
            client.subscribe(`/topic/admin/notifications`, (message) => {
              handleIncomingNotification(message)
            })
          }
        }
      },
      onDisconnect: () => {
        console.log("WebSocket Disconnected from notifications")
      },
      onStompError: (frame) => {
        console.error("STOMP notification connection error: " + frame.headers["message"])
      },
    })

    const handleIncomingNotification = (message) => {
      if (message.body) {
        try {
          const newNotif = JSON.parse(message.body)
          // Add to notifications list
          setNotifications((prev) => {
            // Avoid duplicate message IDs
            if (prev.some((n) => n.id === newNotif.id)) return prev
            return [newNotif, ...prev]
          })
          // Display Toast notification
          toast.info("Thông báo mới", {
            description: newNotif.message,
            duration: 5000,
          })
        } catch (err) {
          console.error("Error parsing incoming notification:", err)
        }
      }
    }

    client.activate()
    stompClientRef.current = client

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate()
        console.log("WebSocket deactivating notification connection for user:", user.id)
      }
    }
  }, [user])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  }
}

export default useNotifications
