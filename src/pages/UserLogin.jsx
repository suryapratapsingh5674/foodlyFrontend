import React, { useState } from 'react'
import AuthPage from './AuthPage'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER

const UserLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const { refreshAuth, setAuthUser } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/user/login`, {
        email,
        password
      }, {withCredentials: true})
      const payloadUser = response.data?.user
      if (payloadUser) {
        setAuthUser(payloadUser, 'user')
      } else {
        await refreshAuth()
      }
      navigate('/');
    } catch (error) {
      console.error("login failed", error);
    }
    setEmail('')
    setPassword('')
  }

  return (
    <AuthPage
      badge="User Access"
      title="Welcome back"
      subtitle="Sign in to continue exploring local food experiences."
      fields={[
        {
          id: 'user-login-email',
          name: 'email',
          label: 'Email address',
          type: 'email',
          placeholder: 'you@email.com',
          autoComplete: 'email',
          value: email,
          onChange: (event)=>setEmail(event.target.value)
        },
        {
          id: 'user-login-password',
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
          autoComplete: 'current-password',
          value: password,
          onChange: (event)=>setPassword(event.target.value)
        },
      ]}
      primaryActionLabel="Sign in"
      alternateLinks={[
        { label: 'Login as food partner', href: '/partner/login' },
      ]}
      onSubmit={handleSubmit}
    />
  )
}

export default UserLogin
