"use client"

import React from 'react'
import AdminPage from '@/components/Admin Page/AdminPage'
import ProtectedRoute from '@/components/ProtectedRoute'


function page() {
  return (
    <div>
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    </div>
  )
}

export default page