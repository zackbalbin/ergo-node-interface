import React, { PureComponent } from 'react'
import { Formik, Field, Form } from 'formik'
import nodeApi from '../../../../api/api'
import { ApiKeyContext } from '../../../../context/context'
import customToast from '../../../../utils/toast'

const initialFormValues = {
  walletPassword: '',
  mnemonicPass: '',
  mnemonic: '',
}

class WalletInitializeForm extends PureComponent {
  static contextType = ApiKeyContext

  walletRestore = async ({ walletPassword, mnemonicPass, mnemonic }) => {
    return nodeApi.post(
      '/wallet/restore',
      { pass: walletPassword, mnemonicPass, mnemonic },
      {
        headers: {
          api_key: this.context.value,
        },
      },
    )
  }

  handleSubmit = (values, { setSubmitting, resetForm, setStatus }) => {
    setStatus({ status: 'submitting' })
    this.walletRestore(values)
      .then(() => {
        resetForm(initialFormValues)
        customToast('success', 'Your wallet success re-stored')
      })
      .catch(err => {
        const errMessage = err.data ? err.data.detail : err.message
        customToast('error', errMessage)
        setSubmitting(false)
      })
  }

  render() {
    return (
      <div className="col-4">
        <div className="card bg-white p-4 mb-4">
          <h2 className="h5 mb-3">Restore Wallet</h2>
          <Formik
            initialValues={initialFormValues}
            onSubmit={this.handleSubmit}
          >
            {({ status, isSubmitting }) => (
              <Form>
                {status && status.state === 'error' && (
                  <div className="alert alert-danger" role="alert">
                    {status.msg}
                  </div>
                )}
                {status && status.state === 'success' && (
                  <div className="alert alert-success">{status.msg}</div>
                )}
                <div className="form-group">
                  <label htmlFor="restore-mnemonic-input">Mnemonic</label>
                  <Field
                    name="mnemonic"
                    type="text"
                    id="restore-mnemonic-input"
                    className="form-control"
                    placeholder="Enter mnemonic"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="restore-wallet-password-input">
                    Wallet password
                  </label>
                  <Field
                    name="walletPassword"
                    type="password"
                    id="restore-wallet-password-input"
                    className="form-control"
                    placeholder="Enter wallet password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="restore-mnemonic-password-input">
                    Mnemonic password
                  </label>
                  <Field
                    name="mnemonicPass"
                    type="password"
                    id="restore-mnemonic-password-input"
                    className="form-control"
                    placeholder="Enter mnemonic password"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Send
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    )
  }
}

export default WalletInitializeForm