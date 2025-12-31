import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER

const Navbar = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const [authState, setAuthState] = useState({ user: false, partner: false })
  const [statusMessage, setStatusMessage] = useState('')
  const statusTimerRef = useRef(null)

  const checkAuthState = useCallback(() => {
    if (typeof document === 'undefined') {
      setAuthState({ user: false, partner: false })
      return
    }

    const cookies = document.cookie || ''
    const normalizedCookies = cookies
      .split(';')
      .map((cookie) => cookie.trim().toLowerCase())

    const hasUserToken = normalizedCookies.some((cookie) => cookie.startsWith('usertoken='))
    const hasPartnerToken = normalizedCookies.some((cookie) => cookie.startsWith('partnertoken='))
    const hasGenericToken = normalizedCookies.some((cookie) => cookie.startsWith('token='))

    setAuthState({
      user: hasUserToken || (!hasPartnerToken && hasGenericToken),
      partner: hasPartnerToken,
    })
  }, [])

  useEffect(() => {
    checkAuthState()
  }, [checkAuthState, location.pathname, location.search])

  useEffect(() => {
    return () => {
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current)
      }
    }
  }, [])

  const handleUserLogout = async () => {
    try {
      setStatusMessage('')
      await axios.post(`${BASE_URL}/api/auth/user/logout`, {}, { withCredentials: true })
      checkAuthState()
      setStatusMessage('Signed out of user account.')
      window.dispatchEvent(new Event('authstatechange'))
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current)
      }
      statusTimerRef.current = window.setTimeout(() => {
        setStatusMessage('')
      }, 5000)
      navigate('/')
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to log out right now.'
      setStatusMessage(message)
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current)
      }
      statusTimerRef.current = window.setTimeout(() => {
        setStatusMessage('')
      }, 5000)
    }
  }

  const handlePartnerLogout = async () => {
    try {
      setStatusMessage('')
      await axios.post(`${BASE_URL}/api/auth/partner/logout`, {}, { withCredentials: true })
      try {
        window.localStorage?.removeItem('partnerEmail')
      } catch (_) {
        // ignore storage issues
      }
      checkAuthState()
      setStatusMessage('Signed out of partner account.')
      window.dispatchEvent(new Event('authstatechange'))
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current)
      }
      statusTimerRef.current = window.setTimeout(() => {
        setStatusMessage('')
      }, 5000)
      navigate('/partner/login')
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to log out right now.'
      setStatusMessage(message)
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current)
      }
      statusTimerRef.current = window.setTimeout(() => {
        setStatusMessage('')
      }, 5000)
    }
  }

  return (
    <header className="navbar" role="banner">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Foodly home">
          Foodly
        </Link>
        {(!authState.user && !authState.partner) ? (
          <nav aria-label="Primary navigation">
            <ul className="navbar__menu">
              <li>
                <Link to="/user/login" className="navbar__link">Login</Link>
              </li>
              <li>
                <Link to="/user/register" className="navbar__link">Register</Link>
              </li>
              <li>
                <Link to="/partner/register" className="navbar__link navbar__link--accent">Become a Partner</Link>
              </li>
            </ul>
          </nav>
        ) : (
          <nav aria-label="Account navigation">
            <ul className="navbar__menu">
              {authState.user && (
                <li>
                  <button
                    type="button"
                    className="navbar__button navbar__button--logout"
                    onClick={handleUserLogout}
                  >
                    Logout (User)
                  </button>
                </li>
              )}
              {authState.partner && (
                <li>
                  <button
                    type="button"
                    className="navbar__button navbar__button--logout"
                    onClick={handlePartnerLogout}
                  >
                    Logout (Partner)
                  </button>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
      {statusMessage && (
        <div className="navbar__status" role="status">{statusMessage}</div>
      )}
    </header>
  )
}

export default Navbar
