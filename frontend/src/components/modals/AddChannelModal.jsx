import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addChannel } from '../../store/slices/channelsSlice';

const AddChannelSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Минимум 3 символа')
    .max(20, 'Максимум 20 символов')
    .required('Обязательное поле')
});

const AddChannelModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { items: channels } = useSelector(state => state.channels);
  const { loading } = useSelector(state => state.channels);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(addChannel({ name: values.name })).unwrap();
      resetForm();
      onHide();
    } catch (error) {
      console.error('Ошибка создания канала:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
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
                <Form.Label>Имя канала</Form.Label>
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
                Отмена
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Создание...' : 'Создать'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddChannelModal;