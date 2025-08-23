import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addChannel } from '../../store/slices/channelsSlice';
import { useTranslation } from 'react-i18next';

const AddChannelModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { items: channels } = useSelector(state => state.channels);
  const { loading } = useSelector(state => state.channels);
  const { t } = useTranslation();

  const AddChannelSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('channels.errors.nameMin', { count: 3 }))
      .max(20, t('channels.errors.nameMax', { count: 20 }))
      .required(t('channels.errors.nameRequired')),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(addChannel({ name: values.name })).unwrap();
      resetForm();
      onHide();
    } catch (error) {
      console.error(t('errors.internal.createChannelError'), error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.add')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={AddChannelSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>{t('channels.channelName')}</Form.Label>
                <Field 
                  name="name" 
                  as={Form.Control}
                  type="text"
                  autoFocus
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
  );
};

export default AddChannelModal;