import { useEffect, useRef, useState } from "react"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"

const getWsUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api"
  return apiUrl.replace(/\/api$/, "/ws")
}

export const useStudyGroupWebSocket = (studyGroupId, onMessageReceived) => {
  const stompClientRef = useRef(null)
  const [connected, setConnected] = useState(false)

  // Keep latest callback ref to prevent reconnects when callback identity changes
  const onMessageReceivedRef = useRef(onMessageReceived)
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived
  }, [onMessageReceived])

  useEffect(() => {
    if (!studyGroupId) return

    const wsUrl = getWsUrl()
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket Connected successfully to study group:", studyGroupId)
        setConnected(true)
        client.subscribe(`/topic/group/${studyGroupId}`, (message) => {
          if (message.body) {
            try {
              const msgData = JSON.parse(message.body)
              if (onMessageReceivedRef.current) {
                onMessageReceivedRef.current(msgData)
              }
            } catch (err) {
              console.error("Error parsing websocket message body:", err)
            }
          }
        })
      },
      onDisconnect: () => {
        console.log("WebSocket Disconnected")
        setConnected(false)
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"])
        console.error("Additional details: " + frame.body)
      },
    })

    client.activate()
    stompClientRef.current = client

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate()
        console.log("WebSocket connection deactivated for study group:", studyGroupId)
      }
    }
  }, [studyGroupId])

  return { connected }
}

export default useStudyGroupWebSocket
