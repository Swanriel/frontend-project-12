import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Слишком короткое имя')
    .max(20, 'Слишком длинное имя')
    .required('Обязательное поле'),
  password: Yup.string()
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
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Авторизация</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="username">Имя пользователя:</label>
              <Field 
                type="text" 
                id="username" 
                name="username" 
                style={{ width: '100%', padding: '8px' }}
              />
              <ErrorMessage name="username" component="div" style={{ color: 'red' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="password">Пароль:</label>
              <Field 
                type="password" 
                id="password" 
                name="password" 
                style={{ width: '100%', padding: '8px' }}
              />
              <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
            >
              {isSubmitting ? 'Вход...' : 'Войти'}
            </button>
          </Form>
        )}
      </Formik>

      <p style={{ textAlign: 'center' }}>
        Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
      </p>
    </div>
  );
};

export default LoginPage;