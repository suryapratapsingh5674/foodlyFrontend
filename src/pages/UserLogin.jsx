import React, { useState } from 'react'
import AuthPage from './AuthPage'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER

const UserLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await axios.post(`${BASE_URL}/api/auth/user/login`, {
        email,
        password
      }, {withCredentials: true})
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
