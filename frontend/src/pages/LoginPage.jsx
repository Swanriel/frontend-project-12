import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Слишком короткое имя')
    .max(20, 'Слишком длинное имя')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(5, 'Пароль должен быть не менее 5 символов')
    .required('Обязательное поле')
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      const response = await axios.post('/api/v1/login', values);
      const { token } = response.data;
      
      login(token);
      navigate('/');
    } catch (err) {
      setError('Неверное имя пользователя или пароль');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Авторизация</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="username">Имя пользователя:</label>
              <Field 
                type="text" 
                id="username" 
                name="username" 
              />
              <ErrorMessage name="username" component="div" style={{ color: 'red' }} />
            </div>

            <div>
              <label htmlFor="password">Пароль:</label>
              <Field 
                type="password" 
                id="password" 
                name="password" 
              />
              <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Вход...' : 'Войти'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;