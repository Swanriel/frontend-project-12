import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { t } = useTranslation()

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, t('auth.errors.usernameMin', { count: 2 }))
      .max(20, t('auth.errors.usernameMax', { count: 20 }))
      .required(t('auth.errors.usernameRequired')),
    password: Yup.string()
      .required(t('auth.errors.passwordRequired')),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('')
      const response = await axios.post('/api/v1/login', values)
      const { token, username } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
      login(token, username)
      navigate('/')
    }
    catch (err) {
      const errorMessage = err.response?.status === 401
        ? t('auth.errors.invalidCredentials')
        : t('notifications.networkError')

      setError(errorMessage)
      if (err.response?.status !== 401) {
        toast.error(t('notifications.networkError'))
      }
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>{t('auth.login')}</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="username">
                {t('auth.username')}
                :
              </label>
              <Field
                type="text"
                id="username"
                name="username"
                style={{ width: '100%', padding: '8px' }}
                autoComplete="off"
              />
              <ErrorMessage name="username" component="div" style={{ color: 'red' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="password">
                {t('auth.password')}
                :
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                style={{ width: '100%', padding: '8px' }}
                autoComplete="off"
              />
              <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
            >
              {isSubmitting ? t('chat.sending') : t('auth.loginButton')}
            </button>
          </Form>
        )}
      </Formik>

      <p style={{ textAlign: 'center' }}>
        {t('auth.noAccount')}
        {' '}
        <Link to="/signup">
          {t('auth.registerLink')}
        </Link>
      </p>
    </div>
  )
}

export default LoginPage
