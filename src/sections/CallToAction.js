import Link from 'next/link';

const CallToAction = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-vitamin-600 to-vitamin-700">
      <div className="relative flex flex-col px-5 mx-auto space-y-5 md:w-3/4">
        <div className="flex flex-col space-y-3 text-white">
          <div className="flex items-center justify-center mb-4">
            <span className="text-6xl">🍊</span>
          </div>
          <h2 className="text-4xl font-extrabold text-center md:text-6xl">
            <span className="block">Ready to protect your domains?</span>
          </h2>
          <h2 className="text-2xl font-bold text-center md:text-4xl">
            <span className="block">Start monitoring for free today</span>
          </h2>
          <p className="text-center text-vitamin-100 text-lg">
            No credit card required • Instant domain health checks • 3 domains free
          </p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <a
            href="#domain-checker"
            className="px-10 py-4 text-xl text-center text-vitamin-600 bg-white rounded-lg shadow-lg hover:bg-vitamin-50 transition-all duration-200 font-semibold"
          >
            Check Domain Now
          </a>
                  <Link
                    href="/auth/login"
                    className="px-10 py-4 text-xl text-center text-white border-2 border-white rounded-lg hover:bg-white hover:text-vitamin-600 transition-all duration-200 font-semibold"
                  >
                    Create Dashboard
                  </Link>
        </div>
        <div className="flex items-center justify-center space-x-8 mt-8 text-vitamin-100">
          <div className="text-center">
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm">Domains Protected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">99.9%</div>
            <div className="text-sm">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm">Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
