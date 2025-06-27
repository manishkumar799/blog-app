import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth)

  // Redirect to home if already authenticated
  if (isInitialized && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AuthGuard