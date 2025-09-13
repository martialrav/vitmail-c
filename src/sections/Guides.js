const Guides = () => {
  return (
    <div className="w-full py-10">
      <div className="relative flex flex-col px-5 mx-auto space-y-5 md:w-3/4">
        <div className="flex flex-col items-center">
          <h6 className="font-bold text-center text-vitamin-600 uppercase">
            Quick Start
          </h6>
          <h2 className="text-4xl font-bold text-center">
            <span className="block">Protect your domains in 3 easy steps</span>
          </h2>
          <p className="text-center text-gray-600">
            Get started with domain health monitoring in minutes
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-3">
          <div className="p-5 space-y-5 transition rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-vitamin-50 to-vitamin-100">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-vitamin-600 rounded-full">
              <span className="text-2xl text-white font-bold">1</span>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-vitamin-600">
                Enter Your Domain
              </h3>
              <h2 className="text-2xl font-bold">
                Simply type your domain name
              </h2>
              <p className="mt-2 text-gray-600">
                No registration required. Just enter your domain and click verify.
              </p>
            </div>
          </div>
          <div className="p-5 space-y-5 transition rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-vitamin-50 to-vitamin-100">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-vitamin-600 rounded-full">
              <span className="text-2xl text-white font-bold">2</span>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-vitamin-600">Instant Analysis</h3>
              <h2 className="text-2xl font-bold">
                Get comprehensive health report
              </h2>
              <p className="mt-2 text-gray-600">
                We check spam databases, email authentication, and more instantly.
              </p>
            </div>
          </div>
          <div className="p-5 space-y-5 transition rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-vitamin-50 to-vitamin-100">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-vitamin-600 rounded-full">
              <span className="text-2xl text-white font-bold">3</span>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-vitamin-600">Take Action</h3>
              <h2 className="text-2xl font-bold">
                Fix issues and monitor ongoing
              </h2>
              <p className="mt-2 text-gray-600">
                Get specific recommendations and set up continuous monitoring.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guides;
