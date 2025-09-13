import { useState } from 'react';
import { Bars3Icon, XMarkIcon, HeartIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { status: sessionStatus } = useSession();
  const [showMenu, setMenuVisibility] = useState(false);

  const toggleMenu = () => setMenuVisibility(!showMenu);
  const { t } = useTranslation();

  // Floating health icons animation
  const healthIcons = ['🍊', '💊', '🥕', '🥬', '🫐', '🍎'];

  return (
    <div className="w-full py-10 bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {healthIcons.map((icon, index) => (
          <div
            key={index}
            className="absolute text-2xl opacity-20 animate-bounce"
            style={{
              left: `${10 + index * 15}%`,
              top: `${20 + (index % 3) * 20}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: '3s'
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      <div className="relative flex flex-col px-10 mx-auto space-y-8 md:w-3/4 z-10">
        {/* Header with Pill-like Navigation */}
        <header className="flex items-center justify-between space-x-3">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <span className="text-3xl font-black text-transparent bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text">
                Vitmail-C
              </span>
              <div className="absolute -top-1 -right-1 animate-pulse">🍊</div>
            </div>
            <span className="text-sm bg-orange-100 px-2 py-1 rounded-full text-orange-600 font-semibold">
              Daily Dose
            </span>
          </Link>

          <button className="md:hidden" onClick={toggleMenu}>
            {!showMenu ? (
              <Bars3Icon className="w-8 h-8 text-orange-600" />
            ) : (
              <XMarkIcon className="w-8 h-8 text-orange-600" />
            )}
          </button>

          <div
            className={[
              'items-center justify-center md:flex-row md:flex md:relative md:bg-transparent md:shadow-none md:top-0 md:backdrop-blur-none md:space-x-3',
              showMenu
                ? 'absolute z-50 flex flex-col py-5 space-x-0 rounded-2xl shadow-2xl md:py-0 left-8 right-8 bg-white/90 backdrop-blur-md top-20 space-y-3 md:space-y-0 px-5'
                : 'hidden',
            ].join(' ')}
          >
            <nav className="flex flex-col w-full space-x-0 space-y-3 text-center md:space-y-0 md:space-x-3 md:flex-row">
              <Link href="/check" className="px-5 py-2 rounded-full hover:bg-orange-100 transition-all duration-300 font-medium">
                🔍 Health Check
              </Link>
              <a href="#pricing" className="px-5 py-2 rounded-full hover:bg-orange-100 transition-all duration-300 font-medium">
                💰 Prescription Plans
              </a>
              <a href="#features" className="px-5 py-2 rounded-full hover:bg-orange-100 transition-all duration-300 font-medium">
                ⚡ Vitamin Features
              </a>
            </nav>
            <Link
              href={sessionStatus === 'authenticated' ? '/account' : '/auth/login'}
              className="w-full px-6 py-2 text-center text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              {sessionStatus === 'authenticated' ? '🏠 Health Dashboard' : '🔐 Get Your Dose'}
            </Link>
          </div>
        </header>

        {/* Main Hero Content - Modular Cards */}
        <div className="flex flex-col items-center justify-center pt-10 mx-auto md:w-4/5">
          {/* Catchy Health Warning Banner */}
          <div className="bg-gradient-to-r from-red-100 to-orange-100 border border-red-200 rounded-full px-6 py-2 mb-6 animate-pulse">
            <span className="text-red-600 font-semibold text-sm">
              ⚠️ WARNING: Your email domain might be malnourished!
            </span>
          </div>

          {/* Main Headline - Pill-shaped containers */}
          <div className="space-y-4 text-center">
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <div className="relative inline-block">
                <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                  Dose Up
                </span>
                <div className="absolute -top-2 -right-4 text-2xl animate-spin">💊</div>
              </div>
              <br />
              <span className="text-gray-700">Your Email</span>
              <br />
              <div className="relative inline-block">
                <span className="bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
                  Immunity
                </span>
                <div className="absolute -top-2 -right-4 text-2xl animate-bounce">🛡️</div>
              </div>
            </h1>
          </div>

          {/* Punny Subtitle */}
          <div className="mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-orange-200 max-w-2xl">
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              <span className="font-semibold text-orange-600">🍊 Don&apos;t let your emails catch a cold!</span>
              <br />
              Our daily dose of domain health checks will keep your inbox
              <span className="font-semibold text-green-600"> fit as a fiddle</span> and
              <span className="font-semibold text-blue-600"> spam-proof strong</span>!
            </p>
          </div>

          {/* Health Stats - Pill Modules */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-green-100 rounded-full px-6 py-3 flex items-center space-x-2">
              <HeartIcon className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-semibold">99.9% Healthy</span>
            </div>
            <div className="bg-blue-100 rounded-full px-6 py-3 flex items-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-semibold">Spam-Resistant</span>
            </div>
            <div className="bg-purple-100 rounded-full px-6 py-3 flex items-center space-x-2">
              <BoltIcon className="w-5 h-5 text-purple-600" />
              <span className="text-purple-700 font-semibold">Lightning Fast</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons - Medicine Bottle Style */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mt-8">
          <Link
            href="/check"
            className="group relative px-12 py-4 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10">🩺 Free Health Check</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <Link
            href="/check"
            className="group px-12 py-4 text-lg font-bold text-orange-600 bg-white border-2 border-orange-300 rounded-2xl shadow-lg hover:shadow-xl hover:bg-orange-50 transform hover:scale-105 transition-all duration-300"
          >
            <span>💊 Get Prescription</span>
          </Link>
        </div>

        {/* Fun Health Tips Ticker */}
        <div className="mt-12 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border border-yellow-200">
          <div className="text-center">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">💡 Email Health Tip:</span>
              <span className="ml-2 animate-pulse">&quot;An email checkup a day keeps the spam away!&quot;</span>
            </p>
          </div>
        </div>

        {/* Testimonial Pill */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white/90 backdrop-blur-sm rounded-full px-8 py-3 shadow-md border border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
              <span className="ml-2 italic">&quot;My emails went from sickly to superhealthy!&quot;</span>
              <span className="ml-2 font-semibold text-gray-800">- Happy Customer 🙂</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;