// pages/admin/news-manager/edit-news/[newsId]/index.js

import EditForm from '@/components/NewsForm/EditForm'
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/router';
import React from 'react'


function NewsEditPage() {

  const router = useRouter();
  const {newsId} = router.query;
  console.log(`params of edit news is ${newsId} and its type of ${typeof newsId}`)
  let decodedNewsId = newsId ? decodeURIComponent(newsId) : '';
  
  

  return (
    <div>
      <ProtectedRoute>
        <EditForm id={decodedNewsId} />
      </ProtectedRoute>
    </div>
  )
}

export default NewsEditPage