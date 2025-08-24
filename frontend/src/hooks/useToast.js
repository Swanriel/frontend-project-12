import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const useToast = () => {
  const { t } = useTranslation()

  const showError = useCallback((message) => {
    toast.error(message || t('notifications.error'))
  }, [t])

  const showSuccess = useCallback((message) => {
    toast.success(message)
  }, [])

  const showNetworkError = useCallback(() => {
    toast.error(t('notifications.networkError'))
  }, [t])

  return {
    showError,
    showSuccess,
    showNetworkError,
  }
}

export default useToast
