import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addMessage } from '../store/slices/messagesSlice';

const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('❌ Токен не найден, WebSocket не подключен');
      return;
    }

    console.log('Подключение к WebSocket для получения сообщений');
    
    socketRef.current = io('/', {
      auth: {
        token: token
      }
    });

    socketRef.current.on('connect', () => {
      console.log('✅ WebSocket подключен для получения сообщений');
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ WebSocket отключен');
    });

    socketRef.current.on('connect_error', (error) => {
      console.log('❌ Ошибка подключения WebSocket:', error);
    });

    socketRef.current.on('newMessage', (message) => {
      console.log('✅ Получено новое сообщение через WebSocket:', message);
      dispatch(addMessage(message));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [dispatch]);

  return {};
};

export default useSocket;