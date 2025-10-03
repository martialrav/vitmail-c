import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    ServerIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';

const DNSRecordsDisplay = ({ checks, domain }) => {
    const [expandedSections, setExpandedSections] = useState({
        spf: false,
        dkim: false,
        dmarc: false,
        mx: false,
        dns: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getStatusIcon = (exists, isValid, issues) => {
        if (!exists) {
            return <XCircleIcon className="w-5 h-5 text-red-500" />;
        }
        if (issues && issues.length > 0) {
            return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
        }
        if (isValid) {
            return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
        }
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    };

    const getStatusText = (exists, isValid, issues) => {
        if (!exists) return 'Not Configured';
        if (issues && issues.length > 0) return 'Has Issues';
        if (isValid) return 'Properly Configured';
        return 'Configured';
    };

    const getStatusColor = (exists, isValid, issues) => {
        if (!exists) return 'text-red-600 bg-red-50 border-red-200';
        if (issues && issues.length > 0) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (isValid) return 'text-green-600 bg-green-50 border-green-200';
        return 'text-blue-600 bg-blue-50 border-blue-200';
    };

    const RecordCard = ({ title, icon, exists, isValid, issues, recommendations, children, section }) => (
        <motion.div
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div
                className="p-4 cursor-pointer"
                onClick={() => toggleSection(section)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                {getStatusIcon(exists, isValid, issues)}
                                <span className={`text-sm font-medium px-2 py-1 rounded-full border ${getStatusColor(exists, isValid, issues)}`}>
                                    {getStatusText(exists, isValid, issues)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {expandedSections[section] ? (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {expandedSections[section] && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100"
                    >
                        <div className="p-4 space-y-4">
                            {children}

                            {/* Issues */}
                            {issues && issues.length > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
                                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                                        Issues Found
                                    </h4>
                                    <ul className="space-y-1">
                                        {issues.map((issue, index) => (
                                            <li key={index} className="text-sm text-yellow-700">
                                                • {issue}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Recommendations */}
                            {recommendations && recommendations.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                                        <InformationCircleIcon className="w-4 h-4 mr-1" />
                                        Recommendations
                                    </h4>
                                    <ul className="space-y-1">
                                        {recommendations.map((rec, index) => (
                                            <li key={index} className="text-sm text-blue-700">
                                                • {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );

    const RecordItem = ({ label, value, type = 'text' }) => (
        <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-gray-600">{label}</span>
            {type === 'code' ? (
                <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono break-all">
                    {value}
                </code>
            ) : (
                <span className="text-sm text-gray-900">{value}</span>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* SPF Record */}
            <RecordCard
                title="SPF Record"
                icon={<ShieldCheckIcon className="w-6 h-6 text-blue-600" />}
                exists={checks.spf?.exists}
                isValid={checks.spf?.isValid}
                issues={checks.spf?.issues}
                recommendations={checks.spf?.recommendations}
                section="spf"
            >
                <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">What is SPF?</h4>
                        <p className="text-sm text-gray-600">
                            SPF (Sender Policy Framework) prevents email spoofing by specifying which servers are allowed to send emails for your domain.
                        </p>
                    </div>

                    {checks.spf?.exists ? (
                        <div className="space-y-2">
                            <RecordItem label="Record Count" value={checks.spf.count} />
                            {checks.spf.records.map((record, index) => (
                                <RecordItem key={index} label={`SPF Record ${index + 1}`} value={record} type="code" />
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600">
                            No SPF record found. This means your domain is vulnerable to email spoofing.
                        </div>
                    )}
                </div>
            </RecordCard>

            {/* DKIM Record */}
            <RecordCard
                title="DKIM Authentication"
                icon={<DocumentTextIcon className="w-6 h-6 text-green-600" />}
                exists={checks.dkim?.exists}
                isValid={checks.dkim?.isValid}
                issues={checks.dkim?.issues}
                recommendations={checks.dkim?.recommendations}
                section="dkim"
            >
                <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">What is DKIM?</h4>
                        <p className="text-sm text-gray-600">
                            DKIM (DomainKeys Identified Mail) adds a digital signature to your emails, proving they came from your domain and haven&apos;t been tampered with.
                        </p>
                    </div>

                    {checks.dkim?.exists ? (
                        <div className="space-y-2">
                            <RecordItem label="Record Count" value={checks.dkim.count} />
                            {checks.dkim.records.map((record, index) => (
                                <RecordItem key={index} label={`DKIM Record ${index + 1}`} value={record} type="code" />
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600">
                            No DKIM records found. Your emails may be more likely to be marked as spam.
                        </div>
                    )}
                </div>
            </RecordCard>

            {/* DMARC Record */}
            <RecordCard
                title="DMARC Policy"
                icon={<ShieldCheckIcon className="w-6 h-6 text-purple-600" />}
                exists={checks.dmarc?.exists}
                isValid={checks.dmarc?.isValid}
                issues={checks.dmarc?.issues}
                recommendations={checks.dmarc?.recommendations}
                section="dmarc"
            >
                <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">What is DMARC?</h4>
                        <p className="text-sm text-gray-600">
                            DMARC (Domain-based Message Authentication, Reporting & Conformance) tells receiving servers what to do with emails that fail SPF or DKIM checks.
                        </p>
                    </div>

                    {checks.dmarc?.exists ? (
                        <div className="space-y-2">
                            <RecordItem label="Policy" value={checks.dmarc.policy} />
                            <RecordItem label="Percentage" value={`${checks.dmarc.percentage}%`} />
                            {checks.dmarc.rua && <RecordItem label="Aggregate Reports" value={checks.dmarc.rua} />}
                            {checks.dmarc.ruf && <RecordItem label="Forensic Reports" value={checks.dmarc.ruf} />}
                            {checks.dmarc.records.map((record, index) => (
                                <RecordItem key={index} label={`DMARC Record ${index + 1}`} value={record} type="code" />
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600">
                            No DMARC record found. Your domain is vulnerable to email spoofing attacks.
                        </div>
                    )}
                </div>
            </RecordCard>

            {/* MX Records */}
            <RecordCard
                title="Mail Exchange (MX) Records"
                icon={<ServerIcon className="w-6 h-6 text-orange-600" />}
                exists={checks.mx?.exists}
                isValid={checks.mx?.isValid}
                issues={checks.mx?.issues}
                recommendations={checks.mx?.recommendations}
                section="mx"
            >
                <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">What are MX Records?</h4>
                        <p className="text-sm text-gray-600">
                            MX records tell other servers where to deliver emails for your domain. Without them, you can&apos;t receive emails.
                        </p>
                    </div>

                    {checks.mx?.exists ? (
                        <div className="space-y-3">
                            <RecordItem label="Email Provider" value={checks.mx.providerName} />
                            <RecordItem label="Confidence" value={`${Math.round(checks.mx.confidence * 100)}%`} />
                            <RecordItem label="Record Count" value={checks.mx.count} />

                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-2">MX Records:</h5>
                                <div className="space-y-2">
                                    {checks.mx.records.map((record, index) => (
                                        <div key={index} className="bg-gray-50 p-2 rounded">
                                            <div className="text-sm">
                                                <span className="font-medium">Priority {record.priority}:</span>
                                                <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
                                                    {record.exchange}
                                                </code>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600">
                            No MX records found. Email delivery to your domain will fail.
                        </div>
                    )}
                </div>
            </RecordCard>

            {/* Additional DNS Records */}
            {checks.dns && (
                <RecordCard
                    title="Additional DNS Records"
                    icon={<GlobeAltIcon className="w-6 h-6 text-indigo-600" />}
                    exists={true}
                    isValid={true}
                    issues={[]}
                    recommendations={[]}
                    section="dns"
                >
                    <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Complete DNS Information</h4>
                            <p className="text-sm text-gray-600">
                                Here are all the DNS records we found for your domain.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {checks.dns.a && checks.dns.a.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">A Records (IPv4):</h5>
                                    <div className="space-y-1">
                                        {checks.dns.a.map((record, index) => (
                                            <code key={index} className="block text-sm bg-gray-100 px-2 py-1 rounded">
                                                {record}
                                            </code>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {checks.dns.aaaa && checks.dns.aaaa.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">AAAA Records (IPv6):</h5>
                                    <div className="space-y-1">
                                        {checks.dns.aaaa.map((record, index) => (
                                            <code key={index} className="block text-sm bg-gray-100 px-2 py-1 rounded">
                                                {record}
                                            </code>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {checks.dns.ns && checks.dns.ns.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Name Servers:</h5>
                                    <div className="space-y-1">
                                        {checks.dns.ns.map((record, index) => (
                                            <code key={index} className="block text-sm bg-gray-100 px-2 py-1 rounded">
                                                {record}
                                            </code>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {checks.dns.txt && checks.dns.txt.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">TXT Records:</h5>
                                    <div className="space-y-1">
                                        {checks.dns.txt.map((record, index) => (
                                            <code key={index} className="block text-sm bg-gray-100 px-2 py-1 rounded break-all">
                                                {record}
                                            </code>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </RecordCard>
            )}
        </div>
    );
};

export default DNSRecordsDisplay;
