import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addMessage, fetchMessages } from '../store/slices/messagesSlice';

const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    console.log('🔌 Инициализация WebSocket:', { token: !!token, username });
    
    if (!token) {
      console.log('❌ Токен не найден, WebSocket не подключен');
      return;
    }

    console.log('🌐 Подключение к WebSocket...');
    
    // Явно указываем URL для Render
    socketRef.current = io('https://frontend-project-12-2-g7v5.onrender.com', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'] // Добавляем оба транспорта
    });

    // Обработчики соединения
    socketRef.current.on('connect', () => {
      console.log('✅ WebSocket подключен');
      console.log('🆔 ID соединения:', socketRef.current.id);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ WebSocket отключен:', reason);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Ошибка подключения WebSocket:', error.message);
    });

    // Обработчик аутентификации
    socketRef.current.on('authenticated', () => {
      console.log('🔐 WebSocket аутентификация успешна');
    });

    socketRef.current.on('unauthorized', (error) => {
      console.error('❌ Ошибка аутентификации WebSocket:', error.message);
    });

    // Главный обработчик сообщений
    socketRef.current.on('newMessage', (message) => {
      console.log('📨 Получено новое сообщение:', {
        body: message.body,
        username: message.username,
        channelId: message.channelId
      });
      
      // Немедленно добавляем в Redux
      dispatch(addMessage(message));
      
      // Дополнительно обновляем весь список для синхронизации
      dispatch(fetchMessages());
    });

    // Подписка на другие события
    socketRef.current.on('newChannel', (channel) => {
      console.log('📦 Новый канал:', channel.name);
    });

    socketRef.current.on('removeChannel', (data) => {
      console.log('🗑️ Удален канал ID:', data.id);
    });

    socketRef.current.on('renameChannel', (channel) => {
      console.log('✏️ Переименован канал:', channel.name);
    });

    // Очистка при размонтировании
    return () => {
      if (socketRef.current) {
        console.log('🧹 Отключение WebSocket');
        socketRef.current.disconnect();
      }
    };
  }, [dispatch]);

  return {};
};

export default useSocket;