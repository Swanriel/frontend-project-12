import { Modal, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { removeChannel } from '../../store/slices/channelsSlice'
import { useTranslation } from 'react-i18next'

const RemoveChannelModal = ({ show, onHide, channel }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.channels)
  const { t } = useTranslation()

  const handleRemove = async () => {
    try {
      await dispatch(removeChannel(channel.id)).unwrap()
      onHide()
    }
    catch (error) {
      console.error('Ошибка удаления канала:', error)
    }
  }

  if (!channel) return null

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.remove')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('channels.removeConfirmation', { channelName: channel.name })}</p>
        <p className="text-danger">{t('channels.removeWarning')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('channels.cancel')}
        </Button>
        <Button
          variant="danger"
          onClick={handleRemove}
          disabled={loading}
        >
          {loading ? t('chat.sending') : t('channels.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RemoveChannelModal
