import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ChannelDropdown = ({ channel, onSelect, onRename, onRemove }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { t } = useTranslation();

  const handleAction = (action) => {
    setShowDropdown(false);
    switch (action) {
      case 'rename':
        onRename(channel);
        break;
      case 'remove':
        onRemove(channel);
        break;
      default:
        break;
    }
  };

  if (!channel) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span
        onClick={() => onSelect(channel)}
        style={{ 
          cursor: 'pointer',
          flexGrow: 1,
          padding: '8px',
        }}
      >
        # {channel.name}
      </span>
      {channel.removable && (
        <Dropdown show={showDropdown} onToggle={setShowDropdown}>
          <Dropdown.Toggle 
            variant="link" 
            id={`dropdown-${channel.id}`}
            className="text-decoration-none text-dark p-0 border-0 bg-transparent"
            style={{ cursor: 'pointer' }}
          />
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleAction('rename')}>
              {t('channels.rename')}
            </Dropdown.Item>
            <Dropdown.Item 
              onClick={() => handleAction('remove')}
              className="text-danger"
            >
              {t('channels.remove')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};

export default ChannelDropdown;