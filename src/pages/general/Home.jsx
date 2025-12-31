import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER

const Home = () => {

  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const videoRefs = useRef(new Map())
  const location = useLocation()

  useEffect(() => {
    if (typeof document === 'undefined') {
      setIsAuthenticated(false)
      return
    }

    const hasTokenCookie = () => (
      (document.cookie || '')
        .split(';')
        .map((cookie) => cookie.trim().toLowerCase())
        .some((cookie) =>
          cookie.startsWith('token=') ||
          cookie.startsWith('usertoken=') ||
          cookie.startsWith('partnertoken=')
        )
    )

    setIsAuthenticated(hasTokenCookie())
    const handleAuthChange = () => {
      setIsAuthenticated(hasTokenCookie())
    }

    window.addEventListener('authstatechange', handleAuthChange)

    return () => {
      window.removeEventListener('authstatechange', handleAuthChange)
    }
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!isAuthenticated) {
      setReels([])
      setLoading(false)
      videoRefs.current.clear()
      return
    }

    const fetchReels = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${BASE_URL}/api/food/`, { withCredentials: true })
        setReels(response.data.foodItem || [])
      } catch (error) {
        console.error('failed to fetch data: ', error)
        setReels([])
      } finally {
        setLoading(false)
      }
    }

    fetchReels()
  }, [isAuthenticated])

  useEffect(() => {
    if (!videoRefs.current.size) {
      return
    }

    // Play a reel only when it is mostly visible in the viewport.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target
        if (!(video instanceof HTMLVideoElement)) {
          return
        }

        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      })
    }, { threshold: [0.6] })

    videoRefs.current.forEach((video) => observer.observe(video))

    return () => {
      videoRefs.current.forEach((video) => observer.unobserve(video))
      observer.disconnect()
    }
  }, [reels])

  if (!isAuthenticated) {
    return (
      <main className="home-hero" aria-label="Foodly introduction">
        <div className="home-hero__content">
          <h1>Your City’s Home Kitchens, One Scroll Away.</h1>
          <p>
            Discover handcrafted dishes from local food partners and bring restaurant-quality meals home.
            Sign in to unlock your personalized reel of culinary stories.
          </p>
          <div className="home-hero__actions">
            <Link className="home-hero__button home-hero__button--primary" to="/user/login">Log in</Link>
            <Link className="home-hero__button" to="/user/register">Create user account</Link>
            <Link className="home-hero__button" to="/partner/register">Become a partner</Link>
          </div>
        </div>
        <div className="home-hero__preview">
          <div className="home-hero__card">
            <span className="home-hero__badge">Instant Preview</span>
            <h2>Keep loyal customers engaged with mini food clips.</h2>
            <p>Upload short videos that showcase your kitchen, dishes, and story in seconds.</p>
          </div>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="home-placeholder" aria-label="Loading reels">
        <div className="home-placeholder__spinner" />
        <p>Loading your personalized food reel…</p>
      </main>
    )
  }

  if (!reels.length) {
    return (
      <main className="home-placeholder" aria-label="No reels available">
        <div className="home-placeholder__card">
          <h2>No dishes yet</h2>
          <p>
            We are onboarding new partners in your area. Check back soon or invite a local kitchen to join Foodly.
          </p>
          <Link className="home-hero__button home-hero__button--primary" to="/partner/register">Invite a partner</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="reel-feed" aria-label="Featured kitchens">
      {reels.map((reel) => (
        <article key={reel._id} className="reel">
          <div className="reel__content">
            <video
              className="reel__video"
              src={reel.video}
              playsInline
              loop
              muted
              ref={(node) => {
                if (!node) {
                  videoRefs.current.delete(reel._id)
                  return
                }
                videoRefs.current.set(reel._id, node)
              }}
            />
            <div className="reel__overlay">
              <p className="reel__description">{reel.name}</p>
              <Link to={'/partner/' + reel.foodPartner} className="reel__cta">Visit Store</Link>
            </div>
          </div>
        </article>
      ))}
    </main>
  )
}

export default Home