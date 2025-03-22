// pages/api/revalidate/all.js

import pages from '@/components/Navbar/Categories';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    // Revalidate the home page
    await res.revalidate('/');
    console.log('Successfully revalidated /');

    // Collect category paths for revalidation
    const categoryPaths = pages.slice(1).map(page => `/${page.english}`);
    
    // Revalidate each category path
    await Promise.all(categoryPaths.map(async (path) => {
      try {
        await res.revalidate(path);
        console.log(`Successfully revalidated ${path}`);
      } catch (err) {
        console.error(`Failed to revalidate ${path}:`, err);
        throw new Error(`Revalidation failed for ${path}`);
      }
    }));

    return res.json({ revalidated: true });
  } catch (err) {
    console.error('Error during revalidation process:', err);
    return res.status(500).json({ message: 'Error during revalidation' });
  }
}
