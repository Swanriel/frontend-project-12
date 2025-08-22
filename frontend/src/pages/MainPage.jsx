import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { fetchChannels, setCurrentChannel } from '../store/slices/channelsSlice'; // Добавить setCurrentChannel
import { fetchMessages } from '../store/slices/messagesSlice';
import ChannelDropdown from '../components/ChannelDropdown';
import AddChannelModal from '../components/modals/AddChannelModal';
import RemoveChannelModal from '../components/modals/RemoveChannelModal';
import RenameChannelModal from '../components/modals/RenameChannelModal';
import ChatArea from '../components/ChatArea';

const MainPage = () => {
  const dispatch = useDispatch();
  const { items: channels, currentChannelId } = useSelector(state => state.channels);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  const handleSelectChannel = (channel) => {
    dispatch(setCurrentChannel(channel.id));
  };

  const handleRenameChannel = (channel) => {
    setSelectedChannel(channel);
    setShowRenameModal(true);
  };

  const handleRemoveChannel = (channel) => {
    setSelectedChannel(channel);
    setShowRemoveModal(true);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Список каналов */}
      <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3>Каналы</h3>
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
                backgroundColor: channel.id === currentChannelId ? '#e3f2fd' : 'transparent',
                borderRadius: '4px',
                marginBottom: '4px'
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

      {/* Область чата */}
      <ChatArea />

      {/* Модальные окна */}
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
  );
};

export default MainPage;