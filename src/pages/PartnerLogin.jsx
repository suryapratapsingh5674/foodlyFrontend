import React, { useState } from 'react'
import AuthPage from './AuthPage'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER

const PartnerLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { refreshAuth, setAuthUser } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/partner/login`, {
        email,
        password
      }, {withCredentials: true})

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('partnerEmail', email)
      }

      const payloadUser = response.data?.user
      if (payloadUser) {
        setAuthUser(payloadUser, 'partner')
      } else {
        await refreshAuth()
      }
      navigate('/dashboard')
    } catch (error) {
      console.error("login failed", error)
    }
    setEmail('')
    setPassword('')
  }

  return (
    <AuthPage
      badge="Food Partner"
      title="Partner sign in"
      subtitle="Access your partner dashboard to manage orders and menus."
      fields={[
        {
          id: 'partner-login-email',
          name: 'email',
          label: 'Business email',
          type: 'email',
          placeholder: 'contact@business.com',
          autoComplete: 'email',
          value:email,
          onChange:(e)=>setEmail(e.target.value)
        },
        {
          id: 'partner-login-password',
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your portal password',
          autoComplete: 'current-password',
          value:password,
          onChange:(e)=>setPassword(e.target.value)
        },
      ]}
      primaryActionLabel="Sign in"
      alternateLinks={[
        { label: 'Login as user', href: '/user/login' },
      ]}
      onSubmit={handleSubmit}
    />
  )
}

export default PartnerLogin
