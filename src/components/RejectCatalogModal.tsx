import { useState, type ChangeEvent } from 'react'
import { Button, Modal, TextArea } from '@veneer/core'

interface RejectCatalogModalProps {
  bundleName: string
  open: boolean
  onClose: () => void
  onReject: (reason: string) => void
}

function RejectCatalogModal({
  bundleName,
  open,
  onClose,
  onReject,
}: RejectCatalogModalProps) {
  const [reason, setReason] = useState('')

  const closeModal = () => {
    setReason('')
    onClose()
  }

  const rejectBundle = () => {
    const trimmedReason = reason.trim()
    if (!trimmedReason) return

    setReason('')
    onReject(trimmedReason)
  }

  const modalFooter = (
    <div className="modal-actions">
      <Button appearance="secondary" onClick={closeModal} type="button">
        Cancel
      </Button>
      <Button
        appearance="primary"
        disabled={!reason.trim()}
        onClick={rejectBundle}
        type="button"
      >
        Reject
      </Button>
    </div>
  )

  return (
    <Modal
      aria-describedby="reject-description"
      closeButton
      closeOnBlur={false}
      i18n={{ close: 'Close' }}
      onClose={closeModal}
      show={open}
      title="Reject Catalog"
      footer={modalFooter}
    >
      <div className="reject-content">
        <p id="reject-description">
          Are you sure you would like to reject <strong>{bundleName}</strong>? Please provide a
          suitable reason to reject this soft bundle.
        </p>
        <TextArea
          label="Reason for rejection"
          required
          placeholder="Add your comments here"
          value={reason}
          onChange={(
            valueOrEvent: string | ChangeEvent<HTMLTextAreaElement>,
            event?: ChangeEvent<HTMLTextAreaElement>,
          ) =>
            setReason(
              typeof valueOrEvent === 'string'
                ? valueOrEvent
                : event?.target.value ?? valueOrEvent.target.value,
            )
          }
        />
      </div>
    </Modal>
  )
}

// Focus behavior is unverified for the pinned Veneer v3.101.0 Modal.
export default RejectCatalogModal