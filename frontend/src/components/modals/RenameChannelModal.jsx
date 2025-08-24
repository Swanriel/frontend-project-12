import { Modal, Button, Form } from 'react-bootstrap'
import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { renameChannel } from '../../store/slices/channelsSlice'
import { useTranslation } from 'react-i18next'

const RenameChannelModal = ({ show, onHide, channel }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  // Создаем схему валидации внутри компонента, чтобы использовать t
  const RenameChannelSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('channels.errors.nameMin', { count: 3 }))
      .max(20, t('channels.errors.nameMax', { count: 20 }))
      .required(t('channels.errors.nameRequired')),
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(renameChannel({
        id: channel.id,
        name: values.name,
      })).unwrap()
      resetForm()
      onHide()
    }
    catch (error) {
      console.error(t('errors.internal.renameChannelError'), error)
}
finally {
      setSubmitting(false)
    }
  }

  if (!channel) return null

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.rename')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: channel.name }}
        validationSchema={RenameChannelSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit: formikHandleSubmit, isSubmitting }) => (
          <Form onSubmit={formikHandleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>{t('channels.channelName')}</Form.Label>
                <Field
                  name="name"
                  as={Form.Control}
                  type="text"
                  autoFocus
                  aria-label="Имя канала"
                />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                {t('channels.cancel')}
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? t('chat.sending') : t('channels.save')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal
