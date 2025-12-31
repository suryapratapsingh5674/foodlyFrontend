import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER

const AuthContext = createContext(null)

const deriveAccountType = (payloadUser, payload) => {
  if (!payloadUser) {
    return null
  }

  const hintedType = payload?.accountType || payload?.role || payloadUser.role || payloadUser.accountType
  if (hintedType) {
    return hintedType
  }

  if (payloadUser.contactName || payloadUser.address) {
    return 'partner'
  }

  return 'user'
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [checking, setChecking] = useState(false)

  const refreshAuth = useCallback(async () => {
    setChecking(true)
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/me`, {
        withCredentials: true,
      })
      const payloadUser = response.data?.user || null
      const accountType = deriveAccountType(payloadUser, response.data)
      setUser(payloadUser ? { ...payloadUser, accountType } : null)
    } catch (error) {
      setUser(null)
    } finally {
      setInitializing(false)
      setChecking(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setChecking(true)
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
        withCredentials: true,
      })
      setUser(null)
      return response?.data
    } catch (error) {
      throw error
    } finally {
      setInitializing(false)
      setChecking(false)
    }
  }, [])

  const setAuthUser = useCallback((nextUser, accountType) => {
    if (!nextUser) {
      setUser(null)
      setInitializing(false)
      return
    }

    const inferredType = accountType || deriveAccountType(nextUser, { user: nextUser })
    setUser({ ...nextUser, accountType: inferredType })
    setInitializing(false)
  }, [])

  useEffect(() => {
    refreshAuth()
  }, [refreshAuth])

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isLoading: initializing || checking,
    refreshAuth,
    setAuthUser,
    logout,
  }), [user, initializing, checking, refreshAuth, setAuthUser, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
