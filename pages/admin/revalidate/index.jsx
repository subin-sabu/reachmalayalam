// pages/admin/revalidate/index.js

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

function RevalidateRoutes() {
  const [category, setCategory] = useState('');
  const [id, setId] = useState('');

  const revalidateHomePage = async () => {
    try {
      const response = await fetch('/api/revalidate/home', {
        method: 'POST',
      });
      if (response.ok) {
        alert('Home page revalidated');
      } else {
        alert('Failed to revalidate home page');
      }
    } catch (error) {
      console.error('Error revalidating home page:', error);
      alert('Error revalidating home page');
    }
  };

  const revalidateAllPages = async () => {
    try {
      const response = await fetch('/api/revalidate/all', {
        method: 'POST',
      });
      if (response.ok) {
        alert('All pages revalidated');
      } else {
        alert('Failed to revalidate all pages');
      }
    } catch (error) {
      console.error('Error revalidating all pages:', error);
      alert('Error revalidating all pages');
    }
  };

  const revalidateCategory = async () => {
    try {
      const response = await fetch('/api/revalidate/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      });
      if (response.ok) {
        alert('Category page revalidated');
      } else {
        alert('Failed to revalidate category page');
      }
    } catch (error) {
      console.error('Error revalidating category page:', error);
      alert('Error revalidating category page');
    }
  };

  const revalidateCategoryWithHome = async () => {
    try {
      const response = await fetch('/api/revalidate/category-with-home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      });
      if (response.ok) {
        alert('Category and home pages revalidated');
      } else {
        alert('Failed to revalidate category and home pages');
      }
    } catch (error) {
      console.error('Error revalidating category and home pages:', error);
      alert('Error revalidating category and home pages');
    }
  };

  const revalidateArticle = async () => {
    try {
      const response = await fetch('/api/revalidate/article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, id }),
      });
      if (response.ok) {
        alert('Article page revalidated');
      } else {
        alert('Failed to revalidate article page');
      }
    } catch (error) {
      console.error('Error revalidating article page:', error);
      alert('Error revalidating article page');
    }
  };

  return (
    <div>
      <button onClick={revalidateHomePage}>Revalidate home page</button>
      <button onClick={revalidateAllPages}>Revalidate all pages</button>
      <div>
        <input 
          type="text" 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category"
        />
        <button onClick={revalidateCategory}>Revalidate category</button>
        <button onClick={revalidateCategoryWithHome}>Revalidate category with home</button>
      </div>
      <div>
        <input 
          type="text" 
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter article ID"
        />
        <button onClick={revalidateArticle}>Revalidate article</button>
      </div>
    </div>
  );
}

export default RevalidateRoutes;
