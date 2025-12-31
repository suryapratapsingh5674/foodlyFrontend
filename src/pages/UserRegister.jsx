import React, { useState } from 'react'
import AuthPage from './AuthPage'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER

const UserRegister = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const { refreshAuth, setAuthUser } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/user/register`, {
        fullName,
        email,
        password,
      }, {withCredentials: true})
      const payloadUser = response.data?.user
      if (payloadUser) {
        setAuthUser(payloadUser, 'user')
      } else {
        await refreshAuth()
      }
      navigate('/')
    } catch (error) {
      console.error('User registration failed', error)
    }
    setEmail('')
    setFullName('')
    setPassword('')
  }

  return (
    <AuthPage
      badge="User Access"
      title="Create your account"
      subtitle="Join the marketplace to discover curated meals near you."
      fields={[
        {
          id: 'user-full-name',
          name: 'fullName',
          label: 'Full name',
          placeholder: 'Jane Doe',
          autoComplete: 'name',
          value: fullName,
          onChange: (event) => setFullName(event.target.value),
        },
        {
          id: 'user-email',
          name: 'email',
          label: 'Email address',
          type: 'email',
          placeholder: 'jane@email.com',
          autoComplete: 'email',
          value: email,
          onChange: (event) => setEmail(event.target.value),
        },
        {
          id: 'user-password',
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'Create a secure password',
          autoComplete: 'new-password',
          value: password,
          onChange: (event) => setPassword(event.target.value),
        },
      ]}
      primaryActionLabel="Create account"
      secondaryText="Already have an account?"
      secondaryLink={{ label: 'Sign in', href: '/user/login' }}
      alternateLinks={[
        { label: 'Register as food partner', href: '/partner/register' },
      ]}
      onSubmit={handleSubmit}
    />
  )
}

export default UserRegister
