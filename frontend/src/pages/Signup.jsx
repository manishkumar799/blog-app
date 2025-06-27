import React from 'react'
import AuthGuard from '../components/auth/AuthGuard'
import SignupForm from '../components/auth/SignupForm'

const Signup = () => {
  return (
    <AuthGuard>
      <SignupForm />
    </AuthGuard>
  )
}

export default Signup