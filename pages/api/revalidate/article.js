// pages/api/revalidate/article.js

import pages from '@/components/Navbar/Categories'; // Assuming you have a categories list here

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { category, id } = req.body;

  console.log('Received category:', category);
  console.log('Received ID:', id);
  console.log('Available categories:', pages.slice(1).map(page => page.english));

  // Validate category
  if (!category || !pages.slice(1).some(page => page.english === category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    // Revalidate article path
    const articlePath = `/${category}/${id}`;

    await res.revalidate(articlePath);
    console.log(`Revalidated ${articlePath}`);

    return res.json({ revalidated: true });
  } catch (err) {
    console.error(`Error revalidating ${articlePath}:`, err);
    return res.status(500).json({ message: 'Error revalidating article' });
  }
}
