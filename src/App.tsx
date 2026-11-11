import { useState, type CSSProperties } from 'react'
import { Button } from '@veneer/core'
import { useTheme } from '@veneer/theme'
import RejectCatalogModal from './components/RejectCatalogModal'
import './App.css'

const bundle = {
  id: 'SB-2048-0176',
  name: 'Universal Print Driver Soft Bundle',
  version: '7.1.0.25570',
  publisher: 'HP Inc.',
  created: 'October 28, 2026',
  odms: ['HP Universal Printing PCL 6', 'HP Universal Printing PostScript'],
}

function App() {
  const theme = useTheme()
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [savedReason, setSavedReason] = useState('')
  const themeTokens: CSSProperties & Record<`--${string}`, string> = {
    '--canvas': theme.color.light.background.default,
    '--surface': theme.color.light.background.container,
    '--text': theme.color.light.foreground.default,
    '--muted': theme.color.light.foreground.medium,
    '--border': theme.color.light.stroke.default,
    '--primary': theme.color.light.primary.base.default,
    '--space-1': theme.layout.size1,
    '--space-2': theme.layout.size2,
    '--space-3': theme.layout.size3,
    '--space-4': theme.layout.size4,
    '--space-5': theme.layout.size5,
    '--space-6': theme.layout.size6,
    '--space-7': theme.layout.size7,
    '--space-8': theme.layout.size8,
    '--radius-2': theme.borderRadius2,
    '--radius-3': theme.borderRadius3,
    '--font-body': theme.typography.size3,
    '--font-small': theme.typography.size2,
    '--font-heading': theme.typography.size5,
    '--line-height': theme.typography.lineHeight3,
  }

  const handleReject = (trimmedReason: string) => {
    setSavedReason(trimmedReason)
    setIsRejectModalOpen(false)
  }

  return (
    <div className="app-shell" style={themeTokens}>
      <div className="page-context" inert={isRejectModalOpen}>
        <header className="topbar">
          <a className="brand" href="#home" aria-label="Switchboard Console home">
            <span className="brand-mark" aria-hidden="true">S</span>
            <span>Switchboard</span>
          </a>
          <div className="topbar-meta">
            <span>Catalog review</span>
            <span className="avatar" aria-label="Signed in as SD">SD</span>
          </div>
        </header>

        <main className="workspace">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="#catalog">Catalog</a>
            <span aria-hidden="true">/</span>
            <a href="#soft-bundles">Soft Bundles</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Bundle details</span>
          </nav>

          <section className="bundle-heading" aria-labelledby="bundle-name">
            <div className="bundle-heading-copy">
              <p className="eyebrow">Soft bundle</p>
              <h1 id="bundle-name">{bundle.name}</h1>
              <p className="bundle-id">Bundle ID <strong>{bundle.id}</strong></p>
            </div>
            <div className="bundle-actions">
              {savedReason && <span className="status-rejected">Rejected</span>}
              <Button appearance="secondary" type="button">Approve</Button>
              <Button
                appearance="primary"
                colorScheme="negative"
                disabled={Boolean(savedReason)}
                onClick={() => setIsRejectModalOpen(true)}
                type="button"
              >
                Reject
              </Button>
            </div>
          </section>

          {savedReason && (
            <p className="save-confirmation" role="status">
              Rejection saved: {savedReason}
            </p>
          )}

          <section className="content-section" aria-labelledby="details-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Catalog submission</p>
                <h2 id="details-title">Soft Bundle Details</h2>
              </div>
              <span className="review-state">Pending review</span>
            </div>
            <dl className="details-grid">
              <div className="detail-item">
                <dt>Bundle name</dt>
                <dd>{bundle.name}</dd>
              </div>
              <div className="detail-item">
                <dt>Version</dt>
                <dd>{bundle.version}</dd>
              </div>
              <div className="detail-item">
                <dt>Publisher</dt>
                <dd>{bundle.publisher}</dd>
              </div>
              <div className="detail-item">
                <dt>Submitted</dt>
                <dd>{bundle.created}</dd>
              </div>
            </dl>
          </section>

          <section className="content-section odm-section" aria-labelledby="odms-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Included packages</p>
                <h2 id="odms-title">ODMs</h2>
              </div>
              <span className="item-count">{bundle.odms.length} packages</span>
            </div>
            <ul className="odm-list">
              {bundle.odms.map((odm) => (
                <li key={odm}>
                  <span className="package-mark" aria-hidden="true">P</span>
                  <span>{odm}</span>
                  <span className="package-version">Included</span>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>

      <RejectCatalogModal
        bundleName={bundle.name}
        onClose={() => setIsRejectModalOpen(false)}
        onReject={handleReject}
        open={isRejectModalOpen}
      />
    </div>
  )
}

export default App
