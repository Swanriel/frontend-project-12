import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, setCurrentChannel } from '../store/slices/channelsSlice';
import { fetchMessages, sendNewMessage } from '../store/slices/messagesSlice';
import useSocket from '../hooks/useSocket';

const MainPage = () => {
  const dispatch = useDispatch();
  const { items: channels, currentChannelId } = useSelector(state => state.channels);
  const { items: messages, sending } = useSelector(state => state.messages);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  const currentChannel = channels.find(channel => channel.id === currentChannelId);
  const channelMessages = messages.filter(message => message.channelId === currentChannelId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChannelId || sending) return;

    try {
      await dispatch(sendNewMessage({
        body: newMessage.trim(),
        channelId: currentChannelId
      })).unwrap();
      
      setNewMessage('');
      console.log('✅ Сообщение отправлено через POST');
    } catch (error) {
      console.error('❌ Ошибка отправки сообщения:', error);
      alert('Ошибка отправки сообщения: ' + (error.message || 'Неизвестная ошибка'));
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Список каналов */}
      <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px' }}>
        <h3>Каналы</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {channels.map(channel => (
            <li 
              key={channel.id} 
              style={{ 
                padding: '8px', 
                cursor: 'pointer',
                backgroundColor: channel.id === currentChannelId ? '#e3f2fd' : 'transparent'
              }}
              onClick={() => dispatch(setCurrentChannel(channel.id))}
            >
              # {channel.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Чат */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
          <h3># {currentChannel?.name || 'Выберите канал'}</h3>
        </div>
        
        {/* Сообщения */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {channelMessages.map(message => (
            <div key={message.id} style={{ marginBottom: '10px' }}>
              <strong>{message.username}:</strong> {message.body}
            </div>
          ))}
        </div>

        {/* Форма отправки сообщения */}
        <form onSubmit={handleSubmit} style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
              disabled={!currentChannelId || sending}
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim() || !currentChannelId || sending}
              style={{ padding: '8px 16px' }}
            >
              {sending ? 'Отправка...' : 'Отправить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MainPage;