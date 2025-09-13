import { getSiteWorkspace } from '@/prisma/services/site';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { site } = req.query;

  try {
    const siteWorkspace = await getSiteWorkspace(site, site.includes('.'));
    let workspace = null;

    if (siteWorkspace) {
      const { host } = new URL(process.env.APP_URL || 'http://localhost:3000');
      workspace = {
        domains: siteWorkspace.domains,
        name: siteWorkspace.name,
        hostname: `${siteWorkspace.slug}.${host}`,
      };
    }

    return res.status(200).json({ workspace });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    
    // Return a 404 for workspace not found, 500 for other errors
    if (error.message && error.message.includes('prepared statement')) {
      // This is a connection pooling issue, return 404 to avoid retries
      return res.status(404).json({ 
        message: 'Workspace not found',
        workspace: null 
      });
    }
    
    return res.status(500).json({ 
      message: 'Internal server error',
      workspace: null 
    });
  }
}
