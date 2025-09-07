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

  const currentChannel = channels.find(channel => channel.id === currentChannelId)
  const channelMessages = messages.filter(message => message.channelId === currentChannelId)

    const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '60%' }}>
        <p>{t('chat.noChannel')}</p>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: '60%' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <h3>
          #
          {' '}
          {currentChannel.name}
          {' '}
          (
          {channelMessages.length}
          )
        </h3>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {channelMessages.length === 0
          ? (
              <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                {t('chat.noMessages', 'Нет сообщений')}
              </div>
            )
          : (
              channelMessages.map(message => (
                <div key={message.id} style={{ marginBottom: '10px', wordBreak: 'break-word' }}>
                  <strong>
                    {message.username}
                    :
                  </strong>
                  {' '}
                  {message.body}
                </div>
              ))
            )}
            <div ref={messagesEndRef} /> 
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '10px', borderTop: '1px solid #ccc', marginTop: 'auto' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder={t('chat.messagePlaceholder')}
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            style={{ flex: 1, padding: '8px', wordBreak: 'break-word' }}
            disabled={sending}
            aria-label="Новое сообщение"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {sending ? t('chat.sending') : t('chat.send')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatArea
