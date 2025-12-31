import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER

const Profile = () => {
  const { profile: partnerId } = useParams()
  const navigate = useNavigate()
  const [partner, setPartner] = useState(null)
  const [videos, setVideos] = useState([])
  const [error, setError] = useState('')
  const [activeVideo, setActiveVideo] = useState(null)

  useEffect(() => {
    if (!partnerId) {
      setError('Partner identifier missing in the URL.')
      return
    }

    const fetchProfile = async () => {
      try {
        setError('')
        const response = await axios.get(`${BASE_URL}/api/food/partner/${partnerId}`)
        setPartner(response.data?.partner || null)
        setVideos(response.data?.videos || [])
      } catch (err) {
        console.error('not able to fetch profile', err)
        setError('Unable to load partner profile right now.')
      }
    }

    fetchProfile()
  }, [partnerId])

  const initials = useMemo(() => {
    if (!partner?.fullName) {
      return 'FP'
    }
    return partner.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0]?.toUpperCase() || '')
      .join('') || 'FP'
  }, [partner])

  const avatarSrc = partner?.avatarUrl || partner?.avatar || partner?.profileImageUrl

  return (
    <main className="profile-page" aria-label="Partner profile">
      <button
        type="button"
        className="page-back-button"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <header className="profile-hero">
        {avatarSrc ? (
          <img className="profile-avatar" src={avatarSrc} alt={`${partner?.fullName || 'Partner'} avatar`} />
        ) : (
          <div className="profile-avatar" aria-hidden="true">{initials}</div>
        )}

        <div className="profile-hero__meta">
          <div className="profile-tags">
            <span className="profile-tag">{partner?.fullName || 'Business name'}</span>
            <span className="profile-tag profile-tag--accent">{partner?.address || 'Address pending'}</span>
          </div>

          <dl className="profile-contact" aria-label="Partner contact details">
            <div>
              <dt>Contact name</dt>
              <dd>{partner?.contactName || '—'}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{partner?.phone || '—'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{partner?.email || '—'}</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="profile-stats" aria-label="Performance metrics">
        <div className="profile-stat">
          <span className="profile-stat__label">Total meals</span>
          <span className="profile-stat__value">{videos.length}</span>
        </div>
        
      </section>

      <div className="profile-divider" role="presentation" />

      {error ? (
        <p className="profile-error" role="alert">{error}</p>
      ) : null}

      <section className="profile-gallery" aria-label="Recent videos">
        {videos.map((item) => {
          const source = item?.video || item?.url || item
          if (!source) {
            return null
          }

          const key = item?._id || item?.id || source
          const title = item?.name || item?.title || 'Dish preview'

          return (
            <button
              key={key}
              type="button"
              className="profile-gallery__item profile-gallery__item--video"
              title={title}
              aria-label={`Play ${title}`}
              onClick={() => setActiveVideo({ src: source, title })}
            >
              <div className="profile-gallery__video-wrapper">
                <video
                  src={source}
                  className="profile-gallery__video"
                  playsInline
                  muted
                  preload="metadata"
                  loop
                />
              </div>
              <div className="profile-gallery__caption">{title}</div>
            </button>
          )
        })}
      </section>

      {activeVideo ? (
        <div
          className="profile-video-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title || 'Expanded video view'}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setActiveVideo(null)
            }
          }}
          tabIndex={-1}
        >
          <button
            className="profile-video-dialog__backdrop"
            type="button"
            onClick={() => setActiveVideo(null)}
            aria-label="Close video overlay"
          ></button>
          <div className="profile-video-dialog__content">
            <button
              className="profile-video-dialog__close"
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setActiveVideo(null)
              }}
              aria-label="Close video"
            >
              X
            </button>
            <video
              src={activeVideo.src}
              className="profile-video-dialog__video"
              controls
              autoPlay
              onClick={(event) => event.stopPropagation()}
              playsInline
            >
              Your browser does not support the video tag.
            </video>
            <div className="profile-video-dialog__title">{activeVideo.title}</div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default Profile