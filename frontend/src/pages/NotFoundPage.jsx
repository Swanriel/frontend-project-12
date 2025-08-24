import { useTranslation } from 'react-i18next'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <div>
      <h2>{t('notFound.title')}</h2>
      <p>{t('notFound.message')}</p>
    </div>
  )
}

export default NotFoundPage
