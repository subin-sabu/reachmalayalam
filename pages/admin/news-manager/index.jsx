// pages/admin/news-manager/index.js


import NewsManager from '@/components/Pages/NewsManager'
import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

function NewsManagerPage() {
  return (
    <div>
      <ProtectedRoute>
        <NewsManager />
      </ProtectedRoute>
    </div>
  )
}

export default NewsManagerPage