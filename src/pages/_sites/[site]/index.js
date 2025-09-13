import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import DefaultErrorPage from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Meta from '@/components/Meta';

const Site = () => {
  const router = useRouter();
  const { site } = router.query;
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (site) {
      // Check if this is a main domain request (should not be handled by this page)
      const isMainDomain = site.includes('vercel.app') || site.includes('localhost') || site === 'vitmail-c.vercel.app' || site === 'vitmail-c';
      
      if (isMainDomain) {
        // Redirect to main page for main domain requests
        window.location.href = '/';
        return;
      }

      // Only fetch workspace data for actual workspace subdomains
      if (site && !isMainDomain) {
        fetch(`/api/workspace/site/${site}`)
          .then(res => {
            if (res.ok) {
              return res.json();
            }
            throw new Error(`HTTP ${res.status}`);
          })
          .then(data => {
            setWorkspace(data.workspace);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching workspace:', error);
            // Set workspace to null to show 404 page
            setWorkspace(null);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [site]);

  if (loading) {
    return (
      <main className="relative flex flex-col items-center justify-center h-screen space-y-10 text-gray-800 bg-gray-50">
        <Meta title="Loading..." />
        <div className="flex flex-col items-center justify-center p-10 space-y-5 text-center">
          <h1 className="text-4xl font-bold">Loading workspace...</h1>
        </div>
      </main>
    );
  }

  return workspace ? (
    <main className="relative flex flex-col items-center justify-center h-screen space-y-10 text-gray-800 bg-gray-50">
      <Meta title={workspace.name} />
      <div className="flex flex-col items-center justify-center p-10 space-y-5 text-center ">
        <h1 className="text-4xl font-bold">
          Welcome to your workspace&apos;s subdomain!
        </h1>
        <h2 className="text-2xl">
          This is the workspace of <strong>{workspace.name}.</strong>
        </h2>
        <p>You can also visit these links:</p>
        <Link
          href={`https://${workspace.hostname}`}
          className="flex space-x-3 text-blue-600 hover:underline"
          target="_blank"
        >
          <span>{`${workspace.hostname}`}</span>
          <ArrowTopRightOnSquareIcon className="w-5 h-5" />
        </Link>
        {workspace.domains?.map((domain, index) => (
          <Link
            key={index}
            href={`https://${domain.name}`}
            className="flex space-x-3 text-blue-600 hover:underline"
            target="_blank"
          >
            <span>{domain.name}</span>
            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
          </Link>
        ))}
      </div>
    </main>
  ) : (
    <>
      <Meta noIndex />
      <DefaultErrorPage statusCode={404} />
    </>
  );
};

export default Site;
