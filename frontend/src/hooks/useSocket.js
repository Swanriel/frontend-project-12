import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { addMessage, fetchMessages } from '../store/slices/messagesSlice'

const useSocket = () => {
  const socketRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
  
    if (!token) {
      return
    }

    socketRef.current = io('https://frontend-project-12-2-g7v5.onrender.com', {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    })

    socketRef.current.on('connect', () => {
    })

    socketRef.current.on('disconnect', (reason) => {
    })

    socketRef.current.on('connect_error', (error) => {
    })

    socketRef.current.on('authenticated', () => {
    })

    socketRef.current.on('unauthorized', (error) => {
    })

    socketRef.current.on('newMessage', (message) => {
      dispatch(addMessage(message))
      dispatch(fetchMessages())
    })

    socketRef.current.on('newChannel', () => {
    })

    socketRef.current.on('removeChannel', () => {
    })

    socketRef.current.on('renameChannel', () => {
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [dispatch])

  return {}
}

export default useSocket
