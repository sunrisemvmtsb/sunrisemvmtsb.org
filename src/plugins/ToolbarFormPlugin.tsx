import React from 'react'
import { useForm, useCMS, Form, usePlugins, Modal, PopupModal, ModalHeader, ModalBody, FormOptions, ModalActions, ActionButton, FieldMeta, Input, TextArea, Plugin, Field } from 'tinacms'
import { FormView } from '@tinacms/react-forms'
import { Button } from '@tinacms/styles'
import { css } from 'styled-components'

function ToolbarFormAction<T>({
  form,
}: {
  form: Form<T>
}) {
  const [ active, setActive ] = React.useState(false)
  const open = () => setActive(true)
  const close = () => setActive(false)

  React.useEffect(() => {
    return form.finalForm.subscribe((...args) => {
      close()
    }, {
      submitSucceeded: true,
      submitFailed: true,
    })
  }, [form])

  return (
    <>
      <Button onClick={open}>
        {form.label}
      </Button>
      {active && (
        <Modal >
          <PopupModal>
            <ModalHeader close={close}>{form.label} </ModalHeader>
            <ModalBody css={css`
              [class^=FieldError] {
                white-space: normal;
              }
            `}>
              <FormView activeForm={form} />
            </ModalBody>
          </PopupModal>
        </Modal>
      )}
    </>
  )
}

const createToolbarFormActionPlugin = (form: Form) => ({
  __type: 'toolbar:widget',
  name: `toolbar-form-action:${form.label}`,
  weight: 2,
  component: () => <ToolbarFormAction form={form} />,
})

export function useToolbarFormPlugin<T>(config: FormOptions<T>, enabled: () => boolean): [T, Form<T>] {
  const [values, form] = useForm(config)
  const plugin = React.useMemo(() => createToolbarFormActionPlugin(form), [form])
  usePlugins(
    enabled() ?
      [plugin] :
      []
  )
  return [values, form]
}
