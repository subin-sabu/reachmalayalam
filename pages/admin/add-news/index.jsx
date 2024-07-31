

import React from 'react'
import NewsForm from '@/components/NewsForm/NewsForm'
import ProtectedRoute from '@/components/ProtectedRoute'



function Addnews() {
  return (
    <div>
      <ProtectedRoute>
        <NewsForm />
      </ProtectedRoute>
    </div>
  )
}

export default Addnews