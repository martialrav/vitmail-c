const Features = () => {
  return (
    <div id="features" className="w-full py-10">
      <div className="relative flex flex-col w-3/4 mx-auto space-y-5">
        <div className="flex flex-col items-center">
          <h6 className="font-bold text-center text-vitamin-600 uppercase">
            Features
          </h6>
          <h2 className="text-4xl font-bold text-center">
            <span className="block">A better way to monitor your domains</span>
          </h2>
          <p className="text-center text-gray-600">
            Comprehensive domain health monitoring with vitamin C-inspired immunity for your email infrastructure
          </p>
        </div>
        <div className="flex flex-col py-10 space-x-0 space-y-10 md:space-y-0 md:space-x-5 md:flex-row">
          <div className="flex flex-col items-center justify-start px-5 space-y-3 md:w-1/3">
            <div className="flex items-center justify-center w-16 h-16 bg-vitamin-100 rounded-full">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="text-lg font-bold">Spam House Detection</h3>
            <p className="text-center text-gray-400">
              Check if your domains are flagged across major spam databases and get instant alerts when issues arise.
            </p>
          </div>
          <div className="flex flex-col items-center justify-start px-5 space-y-3 md:w-1/3">
            <div className="flex items-center justify-center w-16 h-16 bg-vitamin-100 rounded-full">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-lg font-bold">Email Authentication</h3>
            <p className="text-center text-gray-400">
              Monitor SPF, DKIM, DMARC records and get recommendations to improve your email deliverability.
            </p>
          </div>
          <div className="flex flex-col items-center justify-start px-5 space-y-3 md:w-1/3">
            <div className="flex items-center justify-center w-16 h-16 bg-vitamin-100 rounded-full">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-bold">Weekly Health Reports</h3>
            <p className="text-center text-gray-400">
              Get comprehensive weekly reports on your domain&apos;s health status with actionable insights and recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;