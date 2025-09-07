import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { fetchChannels, setCurrentChannel } from '../store/slices/channelsSlice'
import { fetchMessages } from '../store/slices/messagesSlice'
import ChannelDropdown from '../components/ChannelDropdown'
import AddChannelModal from '../components/modals/AddChannelModal'
import RemoveChannelModal from '../components/modals/RemoveChannelModal'
import RenameChannelModal from '../components/modals/RenameChannelModal'
import ChatArea from '../components/ChatArea'
import { useTranslation } from 'react-i18next'

const MainPage = () => {
  const dispatch = useDispatch()
  const { items: channels, currentChannelId } = useSelector(state => state.channels)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  const handleSelectChannel = (channel) => {
    dispatch(setCurrentChannel(channel.id))
  }

  const handleRenameChannel = (channel) => {
    setSelectedChannel(channel)
    setShowRenameModal(true)
  }

  const handleRemoveChannel = (channel) => {
    setSelectedChannel(channel)
    setShowRemoveModal(true)
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden', width: '100%', minWidth: '100%' }}>
      <div style={{ width: '20%', minWidth: '200px', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3>{t('channels.title')}</h3>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            +
          </Button>
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {channels.map(channel => (
            <li
              key={channel.id}
              style={{
                padding: '8px',
                cursor: 'pointer',
                backgroundColor: channel.id === currentChannelId ? '#007bff' : '#f8f9fa',
                color: channel.id === currentChannelId ? 'white' : 'black',
                borderRadius: '4px',
                marginBottom: '4px',
                transition: 'background-color 0.2s',
              }}
            >
              <ChannelDropdown
                channel={channel}
                onSelect={handleSelectChannel}
                onRename={handleRenameChannel}
                onRemove={handleRemoveChannel}
              />
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1, minWidth: '60%', width: '100%' }}>
        <ChatArea />
      </div>

      <AddChannelModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      />

      <RemoveChannelModal
        show={showRemoveModal}
        onHide={() => setShowRemoveModal(false)}
        channel={selectedChannel}
      />

      <RenameChannelModal
        show={showRenameModal}
        onHide={() => setShowRenameModal(false)}
        channel={selectedChannel}
      />
    </div>
  )
}

export default MainPage
