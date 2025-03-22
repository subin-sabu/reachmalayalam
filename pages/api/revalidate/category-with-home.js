// pages/api/revalidate/category-with-home.js

import pages from '@/components/Navbar/Categories';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { category } = req.body;
  console.log('Received category:', category);
  console.log('Available categories:', pages.slice(1).map(page => page.english));

  if (!category || !pages.slice(1).some(page => page.english === category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  try {
    await res.revalidate('/');
    await res.revalidate(`/${category}`);
    console.log(`Revalidated / and /${category}`);
    return res.json({ revalidated: true });
  } catch (err) {
    console.error(`Error revalidating / and /${category}:`, err);
    return res.status(500).json({ message: 'Error revalidating category and home page' });
  }
}

