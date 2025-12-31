import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER

const CreateFood = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const redirectTimer = useRef(null)

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current)
      }
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!name.trim()) {
      setStatusMessage('Please provide a food name before submitting.')
      return
    }

    if (!videoFile) {
      setStatusMessage('Please upload a video showcasing the dish.')
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('video', videoFile)

    try {
      setSubmitting(true)
      setStatusMessage('')

      const response = await axios.post(`${BASE_URL}/api/food/create`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setStatusMessage(response.data?.message || 'Dish created successfully.')
      setName('')
      setDescription('')
      setVideoFile(null)
      event.target.reset()

      redirectTimer.current = window.setTimeout(() => {
        navigate('/dashboard')
      }, 1200)
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to create food item. Please try again.'
      setStatusMessage(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="create-food-page">
      <section className="create-food-card">
        <button
          type="button"
          className="page-back-button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h1>Create New Dish</h1>
        <p className="create-food-subtitle">Share your latest culinary creation with Foodly customers.</p>

        <form className="create-food-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <label className="create-food-field">
            <span>Dish Name</span>
            <input
              type="text"
              name="name"
              placeholder="Enter dish name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={submitting}
              required
            />
          </label>

          <label className="create-food-field">
            <span>Description</span>
            <textarea
              name="description"
              placeholder="Describe the dish, ingredients, or special notes"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              disabled={submitting}
            />
          </label>

          <label className="create-food-field">
            <span>Promo Video</span>
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)}
              disabled={submitting}
              required
            />
          </label>

          <button
            className="reel__cta create-food-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Uploading...' : 'Create Dish'}
          </button>
        </form>

        {statusMessage && (
          <div className="create-food-status" role="status">{statusMessage}</div>
        )}
      </section>
    </main>
  )
}

export default CreateFood