"use client"

import { NewsBulletForm } from '@/components/NewsForm/NewsBulletForm'
import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

function NewsBulletsPage() {
  return (
    <div>
      <ProtectedRoute>
        <NewsBulletForm />
      </ProtectedRoute>
    </div>
  )
}

export default NewsBulletsPage