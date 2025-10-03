import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ShieldExclamationIcon,
    GlobeAltIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const SpamHouseDisplay = ({ spamAnalysis, domain }) => {
    const [expandedSections, setExpandedSections] = useState({
        flagged: false,
        clean: false,
        summary: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    if (!spamAnalysis) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="text-center text-gray-500">
                    <InformationCircleIcon className="w-8 h-8 mx-auto mb-2" />
                    <p>No spam house analysis available</p>
                </div>
            </div>
        );
    }

    const { listedHouses, cleanHouses, totalChecked, listedCount, cleanCount, responseTime } = spamAnalysis;

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <motion.div
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <ShieldExclamationIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-800">Spam House Analysis</h3>
                            <p className="text-sm text-blue-600">
                                Checked {totalChecked} spam databases in {responseTime}ms
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-2xl font-bold ${listedCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {listedCount > 0 ? `${listedCount} Flagged` : 'Clean'}
                        </div>
                        <div className="text-sm text-gray-600">
                            {cleanCount} Clean
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{listedCount}</div>
                        <div className="text-sm text-gray-600">Flagged</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{cleanCount}</div>
                        <div className="text-sm text-gray-600">Clean</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{totalChecked}</div>
                        <div className="text-sm text-gray-600">Total Checked</div>
                    </div>
                </div>
            </motion.div>

            {/* Flagged Spam Houses */}
            {listedHouses && listedHouses.length > 0 && (
                <motion.div
                    className="bg-white border border-red-200 rounded-xl shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <div
                        className="p-4 cursor-pointer border-b border-red-100"
                        onClick={() => toggleSection('flagged')}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <XCircleIcon className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-red-800">
                                        🚨 Domain Flagged ({listedCount} databases)
                                    </h4>
                                    <p className="text-sm text-red-600">
                                        Your domain is listed in the following spam databases
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                    CRITICAL
                                </span>
                                {expandedSections.flagged ? (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {expandedSections.flagged && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="p-4 space-y-4">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <h5 className="font-semibold text-red-800 mb-3 flex items-center">
                                            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                                            Immediate Action Required
                                        </h5>
                                        <p className="text-sm text-red-700 mb-3">
                                            Your domain is listed in {listedCount} spam database{listedCount !== 1 ? 's' : ''}.
                                            This can significantly impact your email deliverability and reputation.
                                        </p>
                                        <div className="bg-white rounded-lg p-3 border border-red-200">
                                            <h6 className="font-medium text-red-800 mb-2">What to do:</h6>
                                            <ul className="text-sm text-red-700 space-y-1">
                                                <li>• Contact each spam house to request removal</li>
                                                <li>• Investigate why your domain was flagged</li>
                                                <li>• Review your email sending practices</li>
                                                <li>• Consider using a different domain for email</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {listedHouses.map((house, index) => (
                                            <motion.div
                                                key={index}
                                                className="bg-red-50 border border-red-200 rounded-lg p-4"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <XCircleIcon className="w-5 h-5 text-red-600" />
                                                            <h6 className="font-semibold text-red-800">{house.name}</h6>
                                                            <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium">
                                                                LISTED
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-red-700 mb-2">{house.description}</p>

                                                        {house.records && house.records.length > 0 && (
                                                            <div className="mb-2">
                                                                <p className="text-xs font-medium text-red-600 mb-1">DNS Records:</p>
                                                                <div className="space-y-1">
                                                                    {house.records.map((record, recordIndex) => (
                                                                        <code key={recordIndex} className="block text-xs bg-white px-2 py-1 rounded border">
                                                                            {record}
                                                                        </code>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center space-x-4 text-xs text-red-600">
                                                            <div className="flex items-center space-x-1">
                                                                <ClockIcon className="w-3 h-3" />
                                                                <span>{house.responseTime}ms</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <GlobeAltIcon className="w-3 h-3" />
                                                                <span>{house.zone}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="ml-4">
                                                        <a
                                                            href={house.contact || '#'}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                                                        >
                                                            Request Removal
                                                        </a>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Clean Spam Houses */}
            {cleanHouses && cleanHouses.length > 0 && (
                <motion.div
                    className="bg-white border border-green-200 rounded-xl shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <div
                        className="p-4 cursor-pointer border-b border-green-100"
                        onClick={() => toggleSection('clean')}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-green-800">
                                        ✅ Clean Databases ({cleanCount} databases)
                                    </h4>
                                    <p className="text-sm text-green-600">
                                        Your domain is not listed in these spam databases
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    GOOD
                                </span>
                                {expandedSections.clean ? (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {expandedSections.clean && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {cleanHouses.map((house, index) => (
                                            <motion.div
                                                key={index}
                                                className="bg-green-50 border border-green-200 rounded-lg p-3"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm font-medium text-green-800">{house.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-1 mt-1 text-xs text-green-600">
                                                    <ClockIcon className="w-3 h-3" />
                                                    <span>{house.responseTime}ms</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Educational Content */}
            <motion.div
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
            >
                <h4 className="text-lg font-semibold text-yellow-800 mb-3">📚 About Spam Databases</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h5 className="font-medium text-yellow-700 mb-2">What are spam databases?</h5>
                        <p className="text-yellow-600">
                            Spam databases (also called blacklists) are lists of domains and IP addresses
                            that have been identified as sources of spam or malicious activity.
                        </p>
                    </div>
                    <div>
                        <h5 className="font-medium text-yellow-700 mb-2">Why does it matter?</h5>
                        <p className="text-yellow-600">
                            If your domain is listed, email providers may block or filter your emails,
                            significantly reducing your email deliverability.
                        </p>
                    </div>
                    <div>
                        <h5 className="font-medium text-yellow-700 mb-2">How to get removed:</h5>
                        <p className="text-yellow-600">
                            Contact each spam database directly through their website. Most have
                            removal request forms and clear instructions.
                        </p>
                    </div>
                    <div>
                        <h5 className="font-medium text-yellow-700 mb-2">Prevention:</h5>
                        <p className="text-yellow-600">
                            Follow email best practices, use proper authentication (SPF, DKIM, DMARC),
                            and maintain a good sending reputation.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SpamHouseDisplay;
