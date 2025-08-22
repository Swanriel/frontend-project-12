import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels } from '../store/slices/channelsSlice';
import { fetchMessages } from '../store/slices/messagesSlice';

const MainPage = () => {
  const dispatch = useDispatch();
  const { items: channels, currentChannelId } = useSelector(state => state.channels);
  const { items: messages } = useSelector(state => state.messages);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  const currentChannel = channels.find(channel => channel.id === currentChannelId);
  const channelMessages = messages.filter(message => message.channelId === currentChannelId);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Список каналов */}
      <div style={{ width: '250px', borderRight: '1px solid #ccc' }}>
        <h3>Каналы</h3>
        <ul>
          {channels.map(channel => (
            <li key={channel.id}>
              {channel.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Чат */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3>{currentChannel?.name || 'Выберите канал'}</h3>
        
        {/* Сообщения */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {channelMessages.map(message => (
            <div key={message.id}>
              <strong>{message.username}:</strong> {message.body}
            </div>
          ))}
        </div>

        {/* Форма отправки сообщения */}
        <div>
          <input placeholder="Введите сообщение..." />
          <button>Отправить</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;