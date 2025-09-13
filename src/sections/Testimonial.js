const Testimonial = () => {
  return (
    <div className="w-full py-10 bg-gradient-to-r from-vitamin-50 to-vitamin-100">
      <div className="relative flex flex-col px-5 mx-auto space-y-5 md:w-3/4">
        <div className="flex flex-col items-center justify-center mx-auto space-y-5 md:w-3/5">
          <div className="flex items-center mb-4">
            <span className="text-4xl">🍊</span>
            <span className="ml-2 text-2xl font-bold text-vitamin-600">Vitmail-C</span>
          </div>
          <h3 className="text-2xl leading-10 text-center text-gray-700">
                  &quot;Vitmail-C saved our email deliverability! We discovered our domain was flagged
            in 3 spam databases and our SPF record was misconfigured. Within hours of fixing
            the issues, our email open rates improved by 40%.&quot;
          </h3>
          <div className="flex flex-row items-center justify-center space-x-5">
            <h4 className="font-bold text-gray-800">Sarah Chen</h4>
            <span className="text-2xl font-extrabold text-vitamin-600">/</span>
            <h4 className="text-gray-600">Marketing Director at TechStart</h4>
          </div>
          <div className="flex items-center space-x-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-xl">⭐</span>
            ))}
            <span className="ml-2 text-gray-600">4.9/5 from 500+ users</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
