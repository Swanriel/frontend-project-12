import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { removeChannel } from '../../store/slices/channelsSlice';

const RemoveChannelModal = ({ show, onHide, channel }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.channels);

  const handleRemove = async () => {
    try {
      await dispatch(removeChannel(channel.id)).unwrap();
      onHide();
    } catch (error) {
      console.error('Ошибка удаления канала:', error);
    }
  };

  if (!channel) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Вы уверены, что хотите удалить канал "{channel.name}"?</p>
        <p className="text-danger">Все сообщения в этом канале будут удалены.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button 
          variant="danger" 
          onClick={handleRemove} 
          disabled={loading}
        >
          {loading ? 'Удаление...' : 'Удалить'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;