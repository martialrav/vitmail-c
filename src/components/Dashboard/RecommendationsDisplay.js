import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExclamationTriangleIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    LightBulbIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    ServerIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';

const RecommendationsDisplay = ({ recommendations, domain }) => {
    const [expandedRecommendations, setExpandedRecommendations] = useState({});

    const toggleRecommendation = (index) => {
        setExpandedRecommendations(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'critical':
                return <XCircleIcon className="w-5 h-5 text-red-500" />;
            case 'high':
                return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
            case 'medium':
                return <InformationCircleIcon className="w-5 h-5 text-yellow-500" />;
            case 'low':
                return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
            default:
                return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'high':
                return 'bg-orange-50 border-orange-200 text-orange-800';
            case 'medium':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'low':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'SPF':
                return <ShieldCheckIcon className="w-5 h-5" />;
            case 'DKIM':
                return <DocumentTextIcon className="w-5 h-5" />;
            case 'DMARC':
                return <ShieldCheckIcon className="w-5 h-5" />;
            case 'MX':
                return <ServerIcon className="w-5 h-5" />;
            default:
                return <GlobeAltIcon className="w-5 h-5" />;
        }
    };

    if (!recommendations || (!recommendations.priority?.length && !recommendations.recommendations?.length)) {
        return (
            <motion.div
                className="bg-green-50 border border-green-200 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    <div>
                        <h3 className="text-lg font-semibold text-green-800">Great Job! 🎉</h3>
                        <p className="text-green-700">
                            Your domain's email infrastructure looks healthy. No critical issues found!
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    const allRecommendations = [
        ...(recommendations.priority || []),
        ...(recommendations.recommendations || [])
    ];

    return (
        <div className="space-y-6">
            {/* Summary */}
            <motion.div
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center space-x-3 mb-4">
                    <LightBulbIcon className="w-8 h-8 text-blue-600" />
                    <div>
                        <h3 className="text-lg font-semibold text-blue-800">Domain Health Recommendations</h3>
                        <p className="text-blue-700">
                            Here's how to strengthen your domain's email infrastructure
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{recommendations.criticalIssues || 0}</div>
                        <div className="text-sm text-gray-600">Critical</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{recommendations.highPriorityIssues || 0}</div>
                        <div className="text-sm text-gray-600">High Priority</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                            {(recommendations.recommendations?.length || 0) - (recommendations.highPriorityIssues || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Medium</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {allRecommendations.length - (recommendations.totalIssues || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Low</div>
                    </div>
                </div>
            </motion.div>

            {/* Priority Recommendations */}
            {recommendations.priority && recommendations.priority.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-500" />
                        Priority Issues
                    </h4>
                    {recommendations.priority.map((rec, index) => (
                        <motion.div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => toggleRecommendation(`priority-${index}`)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${getPriorityColor(rec.priority)}`}>
                                            {getPriorityIcon(rec.priority)}
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-900">{rec.title}</h5>
                                            <p className="text-sm text-gray-600">{rec.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                                            {rec.priority.toUpperCase()}
                                        </span>
                                        {expandedRecommendations[`priority-${index}`] ? (
                                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedRecommendations[`priority-${index}`] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-t border-gray-100"
                                    >
                                        <div className="p-4 space-y-3">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <h6 className="font-medium text-gray-800 mb-2">How to fix:</h6>
                                                <p className="text-sm text-gray-700">{rec.action}</p>
                                            </div>

                                            <div className="bg-blue-50 rounded-lg p-3">
                                                <h6 className="font-medium text-blue-800 mb-2">Why this matters:</h6>
                                                <p className="text-sm text-blue-700">{rec.impact}</p>
                                            </div>

                                            {rec.action.includes('TXT record') && (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                    <h6 className="font-medium text-yellow-800 mb-2">💡 Pro Tip:</h6>
                                                    <p className="text-sm text-yellow-700">
                                                        You can add DNS records through your domain registrar or hosting provider's control panel.
                                                        Look for "DNS Management" or "DNS Settings" in your account.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Regular Recommendations */}
            {recommendations.recommendations && recommendations.recommendations.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <InformationCircleIcon className="w-5 h-5 mr-2 text-blue-500" />
                        Additional Recommendations
                    </h4>
                    {recommendations.recommendations.map((rec, index) => (
                        <motion.div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: (recommendations.priority?.length || 0) * 0.1 + index * 0.1 }}
                        >
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => toggleRecommendation(`rec-${index}`)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            {getCategoryIcon(rec.category)}
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-900">{rec.title}</h5>
                                            <p className="text-sm text-gray-600">{rec.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            {rec.category}
                                        </span>
                                        {expandedRecommendations[`rec-${index}`] ? (
                                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedRecommendations[`rec-${index}`] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-t border-gray-100"
                                    >
                                        <div className="p-4 space-y-3">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <h6 className="font-medium text-gray-800 mb-2">How to fix:</h6>
                                                <p className="text-sm text-gray-700">{rec.action}</p>
                                            </div>

                                            <div className="bg-blue-50 rounded-lg p-3">
                                                <h6 className="font-medium text-blue-800 mb-2">Why this matters:</h6>
                                                <p className="text-sm text-blue-700">{rec.impact}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Educational Content */}
            <motion.div
                className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
            >
                <h4 className="text-lg font-semibold text-purple-800 mb-3">📚 Email Security Basics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h5 className="font-medium text-purple-700 mb-2">SPF (Sender Policy Framework)</h5>
                        <p className="text-purple-600">
                            Prevents others from sending emails that appear to come from your domain.
                            It's like a guest list for your email server.
                        </p>
                    </div>
                    <div>
                        <h5 className="font-medium text-purple-700 mb-2">DKIM (DomainKeys Identified Mail)</h5>
                        <p className="text-purple-600">
                            Adds a digital signature to your emails, proving they're authentic and haven't been tampered with.
                        </p>
                    </div>
                    <div>
                        <h5 className="font-medium text-purple-700 mb-2">DMARC (Domain-based Message Authentication)</h5>
                        <p className="text-purple-600">
                            Tells receiving servers what to do with emails that fail SPF or DKIM checks.
                            It's your domain's email security policy.
                        </p>
                    </div>
                    <div>
                        <h5 className="font-medium text-purple-700 mb-2">MX Records (Mail Exchange)</h5>
                        <p className="text-purple-600">
                            Directs incoming emails to your mail server. Without them, you can't receive emails at your domain.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RecommendationsDisplay;
