import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/theme.css'
import '../styles/auth.css'

const AuthPage = ({
  badge,
  title,
  subtitle,
  fields,
  primaryActionLabel,
  secondaryText,
  secondaryLink,
  alternateLinks,
  onSubmit,
  size = 'default',
  notice,
}) => {
  const formId = `${title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'auth'}-form`
  const formEnctype = fields?.some((field) => field.type === 'file') ? 'multipart/form-data' : undefined
  const handleFormSubmit = (event) => {
    event.preventDefault()
    if (onSubmit) {
      onSubmit(event)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        {badge ? <span className="auth-shell__badge">{badge}</span> : null}

        <section
          className={`auth-card${size === 'compact' ? ' auth-card--compact' : ''}`}
          aria-labelledby={`${formId}-title`}
        >
          <header className="auth-card__header">
            <h1 id={`${formId}-title`} className="auth-card__title">
              {title}
            </h1>
            {subtitle ? (
              <p className="auth-card__subtitle">{subtitle}</p>
            ) : null}
          </header>

          <form
            id={formId}
            className="auth-card__form"
            onSubmit={handleFormSubmit}
            encType={formEnctype}
          >
            {fields?.map((field) => {
              const {
                id,
                name,
                label,
                placeholder,
                autoComplete,
                fullWidth,
                as,
                rows,
                type,
                inputMode,
                required,
                value,
                onChange,
                accept,
                multiple,
              } = field

              const commonProps = {
                id,
                name: name || id,
                placeholder,
                autoComplete,
                required: required !== false,
                inputMode,
                ...(value !== undefined ? { value } : {}),
                ...(onChange ? { onChange } : {}),
                ...(accept ? { accept } : {}),
                ...(multiple ? { multiple } : {}),
              }

              return (
                <div
                  key={id}
                  className={`auth-form-group${fullWidth ? ' auth-form-group--full' : ''}`}
                >
                  <label htmlFor={id}>{label}</label>
                  {as === 'textarea' ? (
                    <textarea
                      {...commonProps}
                      rows={rows || 3}
                    />
                  ) : (
                    <input
                      {...commonProps}
                      type={type || 'text'}
                    />
                  )}
                </div>
              )
            })}
          </form>

          {notice ? (
            <div className="auth-card__notice" role="alert">
              {notice}
            </div>
          ) : null}

          <div className="auth-card__actions">
            <button type="submit" form={formId} className="auth-submit">
              {primaryActionLabel}
            </button>
          </div>

          {secondaryText && secondaryLink ? (
            <footer className="auth-card__footer">
              <span>{secondaryText}</span>
              <Link to={secondaryLink.href}>{secondaryLink.label}</Link>
            </footer>
          ) : null}

          {alternateLinks?.length ? (
            <footer className="auth-card__alt-links" aria-label="Alternate options">
              {alternateLinks.map((link) => (
                <Link key={link.href} to={link.href} className="auth-card__alt-link">
                  {link.label}
                </Link>
              ))}
            </footer>
          ) : null}
        </section>
      </div>
    </main>
  )
}

export default AuthPage
