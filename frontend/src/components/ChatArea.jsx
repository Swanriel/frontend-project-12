import { useState } from 'react';
import { sendNewMessage } from '../store/slices/messagesSlice';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChannelId || sending) return;

    try {
      await dispatch(sendNewMessage({
        body: newMessage.trim(),
        channelId: currentChannelId
      })).unwrap();
      
      setNewMessage('');
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
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
        <h3># {currentChannel.name}</h3>
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
            placeholder={t('chat.messagePlaceholder')}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1, padding: '8px' }}
            disabled={sending}
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim() || sending}
            style={{ padding: '8px 16px' }}
          >
            {sending ? t('chat.sending') : t('chat.send')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatArea;