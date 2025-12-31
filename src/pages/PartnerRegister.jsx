import React, { useState } from 'react'
import AuthPage from './AuthPage'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER

const PartnerRegister = () => {

  const [fullName, setFullName] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate();
  const { refreshAuth, setAuthUser } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!profileImage) {
      setErrorMessage('Please upload a profile image before submitting.')
      return
    }

    try {
      setErrorMessage('')
      const formData = new FormData()
      formData.append('fullName', fullName)
      formData.append('contactName', contactName)
      formData.append('phone', phone)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('address', address)
      formData.append('avatar', profileImage)

      const response = await axios.post(`${BASE_URL}/api/auth/partner/register`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const payloadUser = response.data?.user
      if (payloadUser) {
        setAuthUser(payloadUser, 'partner')
      } else {
        await refreshAuth()
      }
      navigate('/dashboard')
    } catch (error) {
      console.error("partner register is failed", error)
      const message = error.response?.data?.message || 'Unable to register partner. Please try again.'
      setErrorMessage(message)
    }
    setFullName('')
    setContactName('')
    setPhone('')
    setEmail('')
    setPassword('')
    setAddress('')
    setProfileImage(null)
  }

  return (
    <AuthPage
      badge="Food Partner"
      title="Partner onboarding"
      subtitle="Register your kitchen to reach new customers effortlessly."
      notice={errorMessage}
      fields={[
        {
          id: 'partner-business-name',
          name: 'businessName',
          label: 'Business name',
          placeholder: 'Your kitchen or brand name',
          autoComplete: 'organization',
          fullWidth: true,
          value:fullName,
          onChange:(e)=>setFullName(e.target.value)
        },
        {
          id: 'partner-contact-name',
          name: 'contactName',
          label: 'Primary contact name',
          placeholder: 'Full name of contact person',
          autoComplete: 'name',
          value: contactName,
          onChange: (e)=>setContactName(e.target.value)
        },
        {
          id: 'partner-phone',
          name: 'phone',
          label: 'Business phone',
          type: 'tel',
          placeholder: 'Reachable phone number',
          autoComplete: 'tel',
          inputMode: 'tel',
          value:phone,
          onChange: (e)=>setPhone(e.target.value)
        },
        {
          id: 'partner-email',
          name: 'email',
          label: 'Business email',
          type: 'email',
          placeholder: 'contact@business.com',
          autoComplete: 'email',
          value: email,
          onChange: (e)=>setEmail(e.target.value)
        },
        {
          id: 'partner-password',
          name: 'password',
          label: 'Portal password',
          type: 'password',
          placeholder: 'Create a secure password',
          autoComplete: 'new-password',
          value: password,
          onChange: (e)=>setPassword(e.target.value)
        },
        {
          id: 'partner-address',
          name: 'address',
          label: 'Business address',
          placeholder: 'Street, city, state',
          autoComplete: 'street-address',
          fullWidth: false,
          value:address,
          onChange:(e)=>setAddress(e.target.value)
        },
        {
          id: 'partner-profile-image',
          name: 'avatar',
          label: 'Upload profile image',
          type: 'file',
          accept: 'image/*',
          fullWidth: false,
          required: true,
          onChange: (e)=>setProfileImage(e.target.files?.[0] ?? null)
        },
      ]}
      primaryActionLabel="Create partner profile"
      secondaryText="Already part of the network?"
      secondaryLink={{ label: 'Sign in', href: '/partner/login' }}
      alternateLinks={[
        { label: 'Register as user', href: '/user/register' },
      ]}
      onSubmit={handleSubmit}
      size="compact"
    />
  )
}

export default PartnerRegister
