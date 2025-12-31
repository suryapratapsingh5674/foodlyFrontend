import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER

const Navbar = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, refreshAuth } = useAuth()
  const [statusMessage, setStatusMessage] = useState('')
  const statusTimerRef = useRef(null)
  const accountType = user?.accountType || (user?.contactName ? 'partner' : null)
  const showPartnerLogout = isAuthenticated && accountType === 'partner'
  const showUserLogout = isAuthenticated && !showPartnerLogout

  useEffect(() => {
    return () => {
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current)
      }
    }
  }, [])

  const scheduleStatusReset = () => {
    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current)
    }
    statusTimerRef.current = setTimeout(() => {
      setStatusMessage('')
    }, 5000)
  }

  const handleUserLogout = async () => {
    try {
      setStatusMessage('')
      await axios.post(`${BASE_URL}/api/auth/user/logout`, {}, { withCredentials: true })
      await refreshAuth()
      setStatusMessage('Signed out of user account.')
      scheduleStatusReset()
      navigate('/')
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to log out right now.'
      setStatusMessage(message)
      scheduleStatusReset()
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
      await refreshAuth()
      setStatusMessage('Signed out of partner account.')
      scheduleStatusReset()
      navigate('/partner/login')
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to log out right now.'
      setStatusMessage(message)
      scheduleStatusReset()
    }
  }

  return (
    <header className="navbar" role="banner">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Foodly home">
          Foodly
        </Link>
        {!isAuthenticated ? (
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
              {showUserLogout && (
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
              {showPartnerLogout && (
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
              {isAuthenticated && !showUserLogout && !showPartnerLogout && (
                <li>
                  <button
                    type="button"
                    className="navbar__button navbar__button--logout"
                    onClick={handleUserLogout}
                  >
                    Logout
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
