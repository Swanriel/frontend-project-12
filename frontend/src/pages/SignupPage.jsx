import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Минимум 3 символа')
    .max(20, 'Максимум 20 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Обязательное поле')
});

const SignupPage = () => {
const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

const handleSubmit = async (values, { setSubmitting }) => {
  try {
    setError('');
    const response = await axios.post('/api/v1/signup', {
      username: values.username,
      password: values.password
    });
    
    // Сохраняем токен
    const { token } = response.data;
    localStorage.setItem('token', token);
    
    // Вызываем login из AuthContext чтобы обновить состояние
    login(token);
    
    // Редирект на главную страницу чата
    navigate('/');
    
  } catch (err) {
    if (err.response?.status === 409) {
      setError('Пользователь с таким именем уже существует');
    } else {
      setError('Ошибка регистрации. Попробуйте еще раз');
    }
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Регистрация</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
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

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="confirmPassword">Подтверждение пароля:</label>
              <Field 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                style={{ width: '100%', padding: '8px' }}
              />
              <ErrorMessage name="confirmPassword" component="div" style={{ color: 'red' }} />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </Form>
        )}
      </Formik>

      <p style={{ textAlign: 'center' }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
};

export default SignupPage;