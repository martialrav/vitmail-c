import { CheckIcon } from '@heroicons/react/24/outline';

const Pricing = () => {
  return (
    <div id="pricing" className="w-full py-10">
      <div className="relative flex flex-col px-5 mx-auto space-y-5 md:w-3/4">
        <div className="flex flex-col items-center">
          <h6 className="font-bold text-center text-vitamin-600 uppercase">
            Pricing
          </h6>
          <h2 className="text-4xl font-bold text-center">
            <span className="block">
              The right plan for your domain health needs
            </span>
          </h2>
          <p className="text-center text-gray-600">
            Choose the perfect plan to monitor and protect your email infrastructure
          </p>
        </div>
        <div className="flex flex-col p-10 space-x-0 space-y-5 bg-gray-200 rounded-lg md:space-y-0 md:space-x-5 md:flex-row">
          <div className="flex flex-col items-start overflow-hidden bg-white border rounded-lg md:w-1/2">
            <div className="w-full p-10 space-y-5">
              <span className="px-5 py-1 text-sm text-vitamin-600 uppercase bg-vitamin-100 rounded-full">
                Starter
              </span>
              <h2 className="space-x-2 text-6xl">
                <span className="font-extrabold">Free</span>
                <small className="text-lg text-gray-400">forever!</small>
              </h2>
            </div>
            <div className="flex flex-col w-full h-full p-10 space-y-5 bg-gray-100 border-t">
              <a
                className="px-10 py-3 text-lg text-center text-vitamin-600 bg-white rounded shadow hover:bg-vitamin-50"
                href="#!"
              >
                Start Monitoring Free
              </a>
              <div className="space-y-5">
                <h6 className="uppercase">What&apos;s Included</h6>
                <ul className="leading-10 list-none list-inside">
                  <li className="flex items-center space-x-5">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>Up to 3 domains</span>
                  </li>
                  <li className="flex items-center space-x-5">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>Basic spam house checks</span>
                  </li>
                  <li className="flex items-center space-x-5">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>SPF/DKIM validation</span>
                  </li>
                  <li className="flex items-center space-x-5">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>Weekly health reports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start overflow-hidden bg-white border rounded-lg md:w-1/2">
            <div className="w-full p-10 space-y-5">
              <span className="px-5 py-1 text-sm text-vitamin-600 uppercase bg-vitamin-100 rounded-full">
                Pro
              </span>
              <h2 className="space-x-2 text-6xl">
                <span className="font-extrabold">$29</span>
                <small className="text-lg text-gray-400">per month</small>
              </h2>
            </div>
            <div className="flex flex-col w-full h-full p-10 space-y-5 bg-gray-100 border-t">
              <a
                className="px-10 py-3 text-lg text-center text-vitamin-600 bg-white rounded shadow hover:bg-vitamin-50"
                href="#!"
              >
                Upgrade to Pro
              </a>
              <div className="space-y-5">
                <h6 className="uppercase">What&apos;s Included</h6>
                <ul className="leading-10 list-disc list-inside">
                  <li className="flex items-center space-x-5">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>Everything in Starter</span>
                  </li>
                  <li className="flex items-center space-x-5">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>Unlimited domains</span>
                  </li>
                  <li className="flex items-center space-x-5">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>Advanced DMARC analysis</span>
                  </li>
                  <li className="flex items-center space-x-5">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>Real-time monitoring</span>
                  </li>
                  <li className="flex items-center space-x-5">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center space-x-5">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>Custom health reports</span>
                  </li>
                  <li className="flex items-center space-x-5">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>API access</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
