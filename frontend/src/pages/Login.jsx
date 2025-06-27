import React from 'react'
import AuthGuard from '../components/auth/AuthGuard'
import LoginForm from '../components/auth/LoginForm'

const Login = () => {
  return (
    <AuthGuard>
      <LoginForm />
    </AuthGuard>
  )
}

export default Login