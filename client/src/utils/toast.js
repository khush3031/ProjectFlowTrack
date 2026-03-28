let _setToast = null

export const registerToastSetter = (fn) => { _setToast = fn }

export const toast = {
  success: (msg) => _setToast?.({ msg, type: 'success' }),
  error:   (msg) => _setToast?.({ msg, type: 'error' }),
  info:    (msg) => _setToast?.({ msg, type: 'info' }),
}
