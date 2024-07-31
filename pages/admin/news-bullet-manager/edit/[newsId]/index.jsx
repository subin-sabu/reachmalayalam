"use client"

import EditBullet from '@/components/NewsForm/EditBullet'
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/router';
import React from 'react'

function BulletEditPage() {

  const router = useRouter();
  const {newsId} = router.query;

  let decodedNewsId = newsId ? decodeURIComponent(newsId) : '';
  return (
    <div>
      <ProtectedRoute>
        <EditBullet id={decodedNewsId} />
      </ProtectedRoute>
    </div>
  )
}

export default BulletEditPage