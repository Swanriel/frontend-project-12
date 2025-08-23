import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('auth.errors.usernameMin', { count: 3 }))
      .max(20, t('auth.errors.usernameMax', { count: 20 }))
      .required(t('auth.errors.usernameRequired')),
    password: Yup.string()
      .min(6, t('auth.errors.passwordMin', { count: 6 }))
      .required(t('auth.errors.passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('auth.errors.confirmPasswordMatch'))
      .required(t('auth.errors.confirmPasswordRequired'))
  });

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
        setError(t('auth.errors.userExists'));
      } else {
        setError(t('auth.errors.registrationError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

 return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>{t('auth.signup')}</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      
      
         <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="username">{t('auth.username')}:</label>
              <Field 
                type="text" 
                id="username" 
                name="username" 
                style={{ width: '100%', padding: '8px' }}
              />
              <ErrorMessage name="username" component="div" style={{ color: 'red' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="password">{t('auth.password')}:</label>
              <Field 
                type="password" 
                id="password" 
                name="password" 
                style={{ width: '100%', padding: '8px' }}
              />
              <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="confirmPassword">{t('auth.confirmPassword')}:</label>
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
              {isSubmitting ? t('chat.sending') : t('auth.signupButton')}
            </button>
          </Form>
        )}
      </Formik>

      <p style={{ textAlign: 'center' }}>
        {t('auth.haveAccount')} <Link to="/login">{t('auth.loginLink')}</Link>
      </p>
    </div>
  );
};

export default SignupPage;