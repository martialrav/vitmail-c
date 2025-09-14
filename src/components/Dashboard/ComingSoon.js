import { useState } from 'react';
import {
    RocketLaunchIcon,
    ChartBarIcon,
    BellIcon,
    DocumentTextIcon,
    CogIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

const ComingSoon = () => {
    const [selectedFeature, setSelectedFeature] = useState(0);

    const features = [
        {
            icon: <ChartBarIcon className="w-8 h-8" />,
            title: "Advanced Analytics",
            description: "Detailed health trends, performance metrics, and predictive insights for your domains.",
            status: "In Development",
            eta: "Q2 shortly"
        },
        {
            icon: <BellIcon className="w-8 h-8" />,
            title: "Smart Alerts",
            description: "Real-time notifications when domains are flagged or health scores drop below thresholds.",
            status: "Coming Soon",
            eta: "Q1 shortly"
        },
        {
            icon: <DocumentTextIcon className="w-8 h-8" />,
            title: "Automated Reports",
            description: "Weekly and monthly health reports delivered directly to your inbox with actionable insights.",
            status: "Planned",
            eta: "Q2 shortly"
        },
        {
            icon: <CogIcon className="w-8 h-8" />,
            title: "API Integration",
            description: "Connect Vitmail-C with your existing tools and workflows via our comprehensive API.",
            status: "Planned",
            eta: "Q3 shortly"
        },
        {
            icon: <UserGroupIcon className="w-8 h-8" />,
            title: "Team Collaboration",
            description: "Share domain health insights with your team and assign tasks for fixing issues.",
            status: "Planned",
            eta: "Q2 shortly"
        },
        {
            icon: <RocketLaunchIcon className="w-8 h-8" />,
            title: "AI Recommendations",
            description: "Get personalized recommendations powered by AI to improve your domain's health score.",
            status: "Future",
            eta: "Q4 shortly"
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Development':
                return 'bg-blue-100 text-blue-800';
            case 'Coming Soon':
                return 'bg-vitamin-100 text-vitamin-800';
            case 'Planned':
                return 'bg-yellow-100 text-yellow-800';
            case 'Future':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-gradient-to-br from-vitamin-50 to-orange-50 rounded-2xl p-8 border border-vitamin-200">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                    <RocketLaunchIcon className="w-12 h-12 text-vitamin-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    🚀 Coming Soon to Vitmail-C
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We&apos;re working hard to bring you even more powerful domain health monitoring features.
                    Here&apos;s what&apos;s brewing in our development kitchen!
                </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`p-6 bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer ${selectedFeature === index
                            ? 'border-vitamin-300 shadow-lg transform scale-105'
                            : 'border-gray-200 hover:border-vitamin-200 hover:shadow-md'
                            }`}
                        onClick={() => setSelectedFeature(index)}
                    >
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-vitamin-100 rounded-lg text-vitamin-600">
                                {feature.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}>
                                        {feature.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                                <p className="text-xs text-vitamin-600 font-medium">ETA: {feature.eta}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected Feature Details */}
            <div className="bg-white rounded-xl p-6 border border-vitamin-200">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-vitamin-100 rounded-lg text-vitamin-600">
                        {features[selectedFeature].icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{features[selectedFeature].title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(features[selectedFeature].status)}`}>
                            {features[selectedFeature].status}
                        </span>
                    </div>
                </div>
                <p className="text-gray-600 mb-4">{features[selectedFeature].description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Expected Release:</span>
                        <span className="font-semibold text-vitamin-600">{features[selectedFeature].eta}</span>
                    </div>
                    <button className="px-4 py-2 bg-vitamin-600 text-white rounded-lg hover:bg-vitamin-700 transition-colors text-sm">
                        Get Notified
                    </button>
                </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-8 text-center">
                <div className="bg-white rounded-xl p-6 border border-vitamin-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        🍊 Stay Updated with Vitmail-C
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Be the first to know when new features are released!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitamin-500 focus:border-vitamin-500"
                        />
                        <button className="px-6 py-2 bg-vitamin-600 text-white rounded-lg hover:bg-vitamin-700 transition-colors font-medium">
                            Subscribe
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        No spam, just vitamin C for your inbox! 🍊
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
