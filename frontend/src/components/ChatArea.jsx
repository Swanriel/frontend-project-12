import { useState, useEffect } from 'react';
import { sendNewMessage, fetchMessages } from '../store/slices/messagesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const ChatArea = () => {
  const dispatch = useDispatch();
  const { items: channels, currentChannelId } = useSelector(state => state.channels);
  const { items: messages, sending } = useSelector(state => state.messages);
  const [newMessage, setNewMessage] = useState('');
  const { t } = useTranslation();

  const currentChannel = channels.find(channel => channel.id === currentChannelId);
  const channelMessages = messages.filter(message => message.channelId === currentChannelId);

  useEffect(() => {
    console.log('🔍 ДИАГНОСТИКА ChatArea:');
    console.log('📊 Все сообщения:', messages.length);
    console.log('🎯 Текущий канал ID:', currentChannelId);
    console.log('🏷️ Текущий канал:', currentChannel?.name);
    console.log('📨 Сообщения этого канала:', channelMessages.length);
    
    channelMessages.forEach((msg, index) => {
      console.log(`   ${index + 1}. [${msg.username}]: ${msg.body}`);
    });
    
    const howAreYouMessage = channelMessages.find(m => 
      m.body && m.body.toLowerCase().includes('how are you')
    );
    console.log('🔎 Найдено "How are you":', howAreYouMessage);
    
  }, [messages, currentChannelId, channelMessages, currentChannel]);

  useEffect(() => {
    if (!currentChannelId) return;
    
    console.log('🔄 Запуск принудительного обновления сообщений');
    const interval = setInterval(() => {
      dispatch(fetchMessages());
    }, 3000);
    
    return () => {
      console.log('🧹 Очистка интервала обновления');
      clearInterval(interval);
    };
  }, [dispatch, currentChannelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChannelId || sending) return;

    try {
      console.log('🚀 Отправка сообщения:', {
        body: newMessage.trim(),
        channelId: currentChannelId,
        channelName: currentChannel?.name
      });
      
      await dispatch(sendNewMessage({
        body: newMessage.trim(),
        channelId: currentChannelId
      })).unwrap();
      
      console.log('✅ Сообщение отправлено успешно');
      setNewMessage('');
      
      setTimeout(() => {
        dispatch(fetchMessages());
      }, 100);
      
    } catch (error) {
      console.error('❌ Ошибка отправки сообщения:', error);
    }
  };

  if (!currentChannel) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>{t('chat.noChannel')}</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <h3># {currentChannel.name} ({channelMessages.length})</h3>
        <div style={{ fontSize: '12px', color: '#666' }}>
          ID: {currentChannel.id} | Сообщений: {channelMessages.length}
        </div>
      </div>
      
      <div 
        id="messages-container"
        style={{ flex: 1, overflowY: 'auto', padding: '10px' }}
      >
        {channelMessages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            {t('chat.noMessages')}
          </div>
        ) : (
          channelMessages.map(message => (
            <div 
              key={message.id} 
              className="message-item"
              style={{ 
                marginBottom: '10px', 
                padding: '5px',
                border: message.body.includes('How are you') ? '2px solid green' : 'none'
              }}
            >
              <strong>{message.username}:</strong> {message.body}
              <div style={{ fontSize: '10px', color: '#999' }}>
                ID: {message.id} | Channel: {message.channelId}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder={t('chat.messagePlaceholder')}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1, padding: '8px' }}
            disabled={sending}
            aria-label="Новое сообщение"
            id="message-input"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim() || sending}
            style={{ padding: '8px 16px' }}
          >
            {sending ? t('chat.sending') : t('chat.send')}
          </button>
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Канал: {currentChannel.name} (ID: {currentChannelId})
        </div>
      </form>
    </div>
  );
};

export default ChatArea;