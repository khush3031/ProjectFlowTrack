import { useState, useCallback, useRef } from 'react'

export const useForm = ({
  initialValues,
  schema,
  onSubmit,
}) => {
  const [values, setValues]   = useState(initialValues)
  const [errors, setErrors]   = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const submitCount = useRef(0)

  const validate = useCallback(async (vals) => {
    try {
      if (!schema) return {}
      await schema.validate(vals, { abortEarly: false })
      return {}
    } catch (yupErr) {
      if (!yupErr.inner) return {}
      return yupErr.inner.reduce((acc, e) => {
        acc[e.path] = e.message
        return acc
      }, {})
    }
  }, [schema])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setValues(prev => ({ ...prev, [name]: val }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (apiError) setApiError(null)
  }, [errors, apiError])

  const handleBlur = useCallback(async (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const errs = await validate(values)
    if (errs[name]) {
      setErrors(prev => ({ ...prev, [name]: errs[name] }))
    }
  }, [values, validate])

  const setFieldError = useCallback((field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }))
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  const setFieldErrors = useCallback((fieldErrors) => {
    if (!fieldErrors) return
    Object.entries(fieldErrors).forEach(([field, msg]) => {
      setFieldError(field, msg)
    })
  }, [setFieldError])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setApiError(null)
    setLoading(false)
    submitCount.current = 0
  }, [initialValues])

  const handleSubmit = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault()
    submitCount.current += 1

    const allTouched = Object.keys(values).reduce(
      (acc, k) => ({ ...acc, [k]: true }), {}
    )
    setTouched(allTouched)

    const errs = await validate(values)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setApiError(null)

    try {
      await onSubmit(values, { setFieldError, setFieldErrors, setApiError })
    } catch (err) {
      console.error('[useForm] Unhandled submit error', err)
    } finally {
      setLoading(false)
    }
  }, [values, validate, onSubmit, setFieldError, setFieldErrors])

  const getFieldProps = (name) => ({
    name,
    value:    values[name] ?? '',
    onChange: handleChange,
    onBlur:   handleBlur,
    error:    touched[name] ? errors[name] : '',
  })

  const hasError = (name) =>
    Boolean(touched[name] && errors[name])

  return {
    values,
    errors,
    touched,
    loading,
    apiError,
    setApiError,
    setValues,
    setFieldError,
    setFieldErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
    hasError,
    reset,
    isValid: Object.keys(errors).length === 0,
  }
}
