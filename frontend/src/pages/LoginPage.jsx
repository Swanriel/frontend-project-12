import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Слишком короткое имя')
    .max(20, 'Слишком длинное имя')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .required('Обязательное поле')
});

const LoginPage = () => {
  const handleSubmit = (values) => {
    console.log('Форма отправлена:', values);
    // Здесь будет логика отправки формы
  };

  return (
    <div>
      <h2>Авторизация</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <label htmlFor="username">Имя пользователя:</label>
            <Field 
              type="text" 
              id="username" 
              name="username" 
            />
            <ErrorMessage name="username" component="div" />
          </div>

          <div>
            <label htmlFor="password">Пароль:</label>
            <Field 
              type="password" 
              id="password" 
              name="password" 
            />
            <ErrorMessage name="password" component="div" />
          </div>

          <button type="submit">Войти</button>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginPage;