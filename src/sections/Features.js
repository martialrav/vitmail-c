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
          <p className="text-center text-gray-600 mt-4">
            Just like Vitamin C boosts your immune system, Vitmail-C strengthens your domain&apos;s email infrastructure! 🍊
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center space-y-4 p-6 bg-gradient-to-br from-vitamin-50 to-vitamin-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-vitamin-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-vitamin-600">Domain Health Monitoring</h3>
            <p className="text-gray-600">
              Check your domains against all major spam houses and get real-time health scores. 
              No more surprises in your inbox!
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center space-y-4 p-6 bg-gradient-to-br from-vitamin-50 to-vitamin-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-vitamin-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-bold text-vitamin-600">Email Authentication</h3>
            <p className="text-gray-600">
              Monitor SPF, DKIM, DMARC, and MX records. Get alerts when something&apos;s not quite right 
              with your email setup.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center space-y-4 p-6 bg-gradient-to-br from-vitamin-50 to-vitamin-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-vitamin-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-vitamin-600">Weekly Reports</h3>
            <p className="text-gray-600">
              Get comprehensive weekly reports on all your domains. Track improvements, 
              spot issues, and keep your email reputation healthy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;