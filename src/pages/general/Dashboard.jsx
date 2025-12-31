import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

  const navigate = useNavigate()
  const [partnerEmail, setPartnerEmail] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setPartnerEmail('')
      return
    }

    const savedEmail = window.localStorage.getItem('partnerEmail') || ''
    setPartnerEmail(savedEmail)
    if (!savedEmail) {
      setError('Missing partner email.')
      setLoading(false)
    } else {
      setError(null)
    }
  }, [])

  useEffect(() => {
    if (partnerEmail === null) {
      return
    }

    if (!partnerEmail) {
      setError((prev) => prev || 'Missing partner email.')
      setDashboardData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const controller = new AbortController()
    const fetchDashboard = async () => {
      try {
        const query = new URLSearchParams({ email: partnerEmail })
        const response = await fetch(`http://localhost:3000/api/food/partner/dashboard?${query.toString()}`, {
          method: 'GET',
          signal: controller.signal,
          credentials: 'include',
        })

        if (!response.ok) {
          let details = 'Unable to load dashboard data.'
          try {
            const errorBody = await response.json()
            if (errorBody?.message) {
              details = errorBody.message
            }
          } catch (_) {
            // ignore parse errors, fall back to default message
          }
          throw new Error(details)
        }

        const payload = await response.json()
        setDashboardData(payload)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setDashboardData(null)
          setError(err.message || 'Something went wrong while loading the dashboard.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()

    return () => {
      controller.abort()
    }
  }, [partnerEmail])

  useEffect(() => {
    if (!selectedVideo) {
      return
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedVideo(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedVideo])

  const partnerProfile = dashboardData?.foodpartner?.[0]
  const foodItems = dashboardData?.foodData ?? []
  const totalFoodItems = foodItems.length

  if (loading) {
    return <div className="profile-page">Loading dashboard...</div>
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error">{error}</div>
      </div>
    )
  }

  if (!partnerProfile) {
    return (
      <div className="profile-page">
        <div className="profile-error">No partner profile found.</div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <img
          className="profile-avatar"
          src={partnerProfile.avatar}
          alt={`${partnerProfile.fullName} avatar`}
        />
        <div className="profile-hero__meta">
          <h1>{partnerProfile.fullName}</h1>
          <dl className="profile-contact">
            <div>
              <dt>Contact Name</dt>
              <dd>{partnerProfile.contactName || 'Not provided'}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{partnerProfile.phone || 'Not provided'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{partnerProfile.email}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{partnerProfile.address || 'Not provided'}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat__label">Total Food Items</span>
          <span className="profile-stat__value">{totalFoodItems}</span>
          <button
            type="button"
            className="reel__cta"
            onClick={() => navigate('/dashboard/create')}
          >
            Create New Food Item
          </button>
        </div>
      </section>

      <div className="profile-divider" />

      <section>
        <h2>Food Videos</h2>
        {totalFoodItems === 0 ? (
          <div className="profile-gallery">
            <div className="profile-gallery__item profile-gallery__placeholder">No videos yet</div>
          </div>
        ) : (
          <div className="profile-gallery">
            {foodItems.map((item) => (
              <button
                key={item._id}
                type="button"
                className="profile-gallery__item profile-gallery__item--video"
                title={item.name}
                aria-label={`Play ${item.name}`}
                onClick={() => setSelectedVideo(item)}
              >
                <div className="profile-gallery__video-wrapper">
                  <video
                    className="profile-gallery__video"
                    src={item.video}
                    preload="metadata"
                    muted
                    playsInline
                    loop
                  />
                </div>
                <div className="profile-gallery__caption">{item.name}</div>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedVideo && (
        <div className="profile-video-dialog" role="dialog" aria-modal="true" aria-label={selectedVideo.name}>
          <button
            type="button"
            className="profile-video-dialog__backdrop"
            onClick={() => setSelectedVideo(null)}
            aria-label="Close video"
          />
          <div className="profile-video-dialog__content">
            <button
              type="button"
              className="profile-video-dialog__close"
              onClick={() => setSelectedVideo(null)}
              aria-label="Close video"
            >
              X
            </button>
            <video
              className="profile-video-dialog__video"
              src={selectedVideo.video}
              controls
              autoPlay
              playsInline
            />
            <div className="profile-video-dialog__title">{selectedVideo.name}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard