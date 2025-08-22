import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addMessage } from '../store/slices/messagesSlice';

const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    socketRef.current = io('/', {
      auth: {
        token: token
      }
    });

    // Обработка новых сообщений
    socketRef.current.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [dispatch]);

  const sendMessage = (messageData) => {
    return new Promise((resolve, reject) => {
      if (socketRef.current) {
        socketRef.current.emit('newMessage', messageData, (response) => {
          if (response.status === 'ok') {
            resolve(response);
          } else {
            reject(new Error(response.error));
          }
        });
      } else {
        reject(new Error('Socket not connected'));
      }
    });
  };

  return { sendMessage };
};

export default useSocket;