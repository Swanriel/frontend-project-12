import { useState, useEffect, useRef } from 'react'
import { sendNewMessage, fetchMessages } from '../store/slices/messagesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const ChatArea = () => {
  const dispatch = useDispatch()
  const { items: channels, currentChannelId } = useSelector(state => state.channels)
  const { items: messages, sending } = useSelector(state => state.messages)
  const [newMessage, setNewMessage] = useState('')
  const { t } = useTranslation()
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const currentChannel = channels.find(channel => channel.id === currentChannelId)
  const channelMessages = messages.filter(message => message.channelId === currentChannelId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [channelMessages])

  useEffect(() => {
    if (!currentChannelId) return

    const interval = setInterval(() => {
      dispatch(fetchMessages())
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [dispatch, currentChannelId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentChannelId || sending) return

    try {
      await dispatch(sendNewMessage({
        body: newMessage.trim(),
        channelId: currentChannelId,
      })).unwrap()

      setNewMessage('')
      setTimeout(() => {
        dispatch(fetchMessages())
      }, 100)
    }
    catch (error) {
      console.error('Ошибка отправки сообщения:', error)
    }
  }

  if (!currentChannel) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <p style={{ color: '#6c757d' }}>{t('chat.noChannel')}</p>
      </div>
    )
  }

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      minWidth: '60%',
      height: '100%'
    }}>
      <div style={{ 
        padding: '10px 15px', 
        borderBottom: '1px solid #dee2e6',
        backgroundColor: '#f8f9fa',
        flexShrink: 0
      }}>
        <h4 style={{ margin: 0, color: '#495057', fontSize: '16px' }}>
          #
          {' '}
          {currentChannel.name}
          {' '}
          <small style={{ color: '#6c757d', fontSize: '0.9em' }}>
            ({channelMessages.length})
          </small>
        </h4>
      </div>

      <div 
        ref={messagesContainerRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          maxHeight: 'calc(100vh - 200px)'
        }}
      >
        {channelMessages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#adb5bd', 
            padding: '40px',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {t('chat.noMessages', 'Нет сообщений')}
          </div>
        ) : (
          <>
            {channelMessages.map(message => (
              <div 
                key={message.id} 
                style={{ 
                  marginBottom: '12px',
                  padding: '8px 12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  wordBreak: 'break-word'
                }}
              >
                <strong style={{ color: '#495057' }}>
                  {message.username}
                  :
                </strong>
                {' '}
                <span style={{ color: '#212529' }}>{message.body}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form 
        onSubmit={handleSubmit} 
        style={{ 
          padding: '12px 15px',
          borderTop: '1px solid #dee2e6',
          backgroundColor: '#f8f9fa',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder={t('chat.messagePlaceholder')}
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            style={{ 
              flex: 1, 
              padding: '10px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            disabled={sending}
            aria-label="Новое сообщение"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            style={{ 
              padding: '10px 20px',
              backgroundColor: newMessage.trim() && !sending ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: newMessage.trim() && !sending ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {sending ? t('chat.sending') : t('chat.send')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatArea
