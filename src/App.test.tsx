import { fireEvent, render, screen, within } from '@testing-library/react'
import type { ComponentProps, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('@veneer/theme', () => ({
  useTheme: () => ({
    color: {
      light: {
        background: { default: '#fafafa', container: '#ffffff' },
        foreground: { default: '#212121', medium: '#404040' },
        stroke: { default: '#d9d9d9' },
        primary: { base: { default: '#0073a8' } },
      },
    },
    layout: {
      size1: '4px', size2: '8px', size3: '12px', size4: '16px',
      size5: '20px', size6: '24px', size7: '28px', size8: '32px',
    },
    borderRadius2: '4px',
    borderRadius3: '8px',
    typography: { size2: '14px', size3: '16px', size5: '24px', lineHeight3: '24px' },
  }),
}))

vi.mock('@veneer/core', () => {
  type MockButtonProps = ComponentProps<'button'> & {
    appearance?: string
    colorScheme?: string
  }

  const MockButton = ({ appearance, colorScheme, ...props }: MockButtonProps) => {
    void appearance
    void colorScheme
    return <button {...props} />
  }

  const MockModal = ({
    children,
    closeButton,
    footer,
    i18n,
    onClose,
    show,
    title,
  }: {
    children: ReactNode
    closeButton?: boolean
    footer?: ReactNode
    i18n?: { close?: string }
    onClose?: () => void
    show?: boolean
    title?: string
  }) => show ? (
    <section aria-labelledby="test-modal-title" role="dialog">
      <h2 id="test-modal-title">{title}</h2>
      {closeButton && <button aria-label={i18n?.close} onClick={onClose} type="button" />}
      {children}
      {footer}
    </section>
  ) : null

  const MockTextArea = ({
    label,
    required,
    ...props
  }: ComponentProps<'textarea'> & { label: string; required?: boolean }) => (
    <label>
      {label}{required && ' *'}
      <textarea aria-required={required} required={required} {...props} />
    </label>
  )

  return { Button: MockButton, Modal: MockModal, TextArea: MockTextArea }
})

describe('Reject Catalog flow', () => {
  it('requires a reason before enabling Reject', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }))

    const dialog = screen.getByRole('dialog', { name: 'Reject Catalog' })
    expect(screen.getByRole('main')).toHaveAttribute('inert')
    expect(screen.getByRole('heading', { name: 'Soft Bundle Details' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'ODMs' })).toBeInTheDocument()
    expect(within(dialog).getByLabelText(/Reason for rejection/)).toBeRequired()
    expect(within(dialog).getByPlaceholderText('Add your comments here')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Reject' })).toBeDisabled()

    fireEvent.change(within(dialog).getByLabelText(/Reason for rejection/), {
      target: { value: 'Missing required package details' },
    })
    expect(within(dialog).getByRole('button', { name: 'Reject' })).toBeEnabled()
  })

  it('saves the trimmed reason and closes the modal on rejection', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }))

    const dialog = screen.getByRole('dialog', { name: 'Reject Catalog' })
    fireEvent.change(within(dialog).getByLabelText(/Reason for rejection/), {
      target: { value: '  Incomplete metadata  ' },
    })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Reject' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Rejection saved: Incomplete metadata')
  })

  it('discards the reason when the close icon is used', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }))

    const dialog = screen.getByRole('dialog', { name: 'Reject Catalog' })
    fireEvent.change(within(dialog).getByLabelText(/Reason for rejection/), {
      target: { value: 'Do not save this reason' },
    })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByRole('main')).not.toHaveAttribute('inert')
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }))
    expect(screen.getByRole('dialog').querySelector('textarea')).toHaveValue('')
  })
})