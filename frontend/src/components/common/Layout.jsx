import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation will go here */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">BlogApp</h1>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 BlogApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout