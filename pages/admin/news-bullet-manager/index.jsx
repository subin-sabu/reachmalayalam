"use client"

import NewsBulletManager from '@/components/NewsBullets/NewBulletManager'
import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

function BulletsManagerPage() {
  return (
    <div>
      <ProtectedRoute>
        <NewsBulletManager />
      </ProtectedRoute>
    </div>
  )
}

export default BulletsManagerPage