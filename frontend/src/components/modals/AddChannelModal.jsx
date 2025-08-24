import { Modal, Button, Form } from 'react-bootstrap'
import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { addChannel } from '../../store/slices/channelsSlice'
import { useTranslation } from 'react-i18next'

const AddChannelModal = ({ show, onHide }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const AddChannelSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(addChannel({ name: values.name })).unwrap()
      resetForm()
      onHide()
    } catch (error) {
      console.error(t('errors.internal.createChannelError'), error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.add')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={AddChannelSchema}
        onSubmit={handleSubmit}
        validateOnChange
        validateOnBlur
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
                {isSubmitting ? t('chat.sending') : t('channels.create')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddChannelModal
