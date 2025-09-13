import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import Meta from '@/components/Meta/index';
import { LandingLayout } from '@/layouts/index';
import Button from '@/components/Button/index';
import Card from '@/components/Card/index';

const DomainChecker = () => {
    const [domain, setDomain] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [verificationCount, setVerificationCount] = useState(0);
    const [useRealData, setUseRealData] = useState(true); // Always use real data in production

    const validateDomain = (domain) => {
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
        return domainRegex.test(domain);
    };

    const checkDomainHealth = async (domainName, useRealData = false) => {
        setIsChecking(true);
        setError(null);

        try {
            const response = await fetch('/api/check-domain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ domain: domainName, useRealData }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to check domain');
            }

            const data = await response.json();
            setResult(data.data);
            setVerificationCount(prev => prev + 1);
        } catch (err) {
            setError(err.message || 'Failed to check domain health. Please try again.');
        } finally {
            setIsChecking(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!domain.trim()) {
            setError('Please enter a domain name');
            return;
        }

        if (!validateDomain(domain)) {
            setError('Please enter a valid domain name (e.g., example.com)');
            return;
        }

        checkDomainHealth(domain.trim(), useRealData);
    };

    const getHealthScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getHealthScoreBg = (score) => {
        if (score >= 80) return 'bg-green-100';
        if (score >= 60) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    const getSpamHouseStatusIcon = (status) => {
        switch (status) {
            case 'CLEAN':
                return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
            case 'FLAGGED':
                return <XCircleIcon className="w-5 h-5 text-red-600" />;
            default:
                return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
        }
    };

    const getSpamHouseStatusText = (status) => {
        switch (status) {
            case 'CLEAN':
                return 'Clean';
            case 'FLAGGED':
                return 'Flagged';
            default:
                return 'Unknown';
        }
    };

    const getSpamHouseStatusColor = (status) => {
        switch (status) {
            case 'CLEAN':
                return 'text-green-600';
            case 'FLAGGED':
                return 'text-red-600';
            default:
                return 'text-yellow-600';
        }
    };

    return (
        <LandingLayout>
            <Meta
                title="Free Domain Health Check - Vitmail-C"
                description="Check your domain's health instantly. No registration required. Get spam house status, email authentication analysis, and health score."
            />

            <div className="w-full py-10" id="domain-checker">
                <div className="relative flex flex-col px-5 mx-auto space-y-8 md:w-3/4">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative">
                                <span className="text-5xl">🍊</span>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <span className="ml-4 text-4xl font-bold bg-gradient-to-r from-vitamin-600 to-vitamin-700 bg-clip-text text-transparent">
                                Vitmail-C
                            </span>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 md:text-6xl mb-4">
                            Boost Your Domain&apos;s
                            <span className="block bg-gradient-to-r from-vitamin-600 to-vitamin-700 bg-clip-text text-transparent">
                                Immunity System
                            </span>
                        </h1>
                        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Just like Vitamin C strengthens your immune system, Vitmail-C fortifies your domain&apos;s 
              email infrastructure. Get instant health reports, spam detection, and authentication analysis.
                        </p>
                        <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Real-time analysis</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>No registration required</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span>Professional insights</span>
                            </div>
                        </div>
                        {verificationCount > 0 && (
                            <div className="mt-6 p-4 bg-vitamin-50 rounded-lg border border-vitamin-200 max-w-md mx-auto">
                                <p className="text-vitamin-800 font-medium">
                                    🍊 You&apos;ve checked {verificationCount} domain{verificationCount !== 1 ? 's' : ''} today
                                </p>
                                {verificationCount >= 3 && (
                                    <p className="mt-2 text-vitamin-700 text-sm">
                                        Ready to go pro? Create a free account for unlimited monitoring!
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Domain Input Form */}
                    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-vitamin-50">
                        <Card.Body className="p-8">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    🍊 Give Your Domain a Health Check
                                </h2>
                                <p className="text-gray-600">
                                    Enter your domain below and we&apos;ll analyze its &quot;immune system&quot; in real-time
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative">
                                    <label htmlFor="domain" className="block text-sm font-semibold text-gray-700 mb-3">
                                        Domain Name
                                    </label>
                                    <div className="flex space-x-3">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                id="domain"
                                                value={domain}
                                                onChange={(e) => setDomain(e.target.value)}
                                                placeholder="yourdomain.com"
                                                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-vitamin-100 focus:border-vitamin-500 transition-all duration-200 shadow-sm"
                                                disabled={isChecking}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                <span className="text-gray-400">🌐</span>
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={!domain.trim() || isChecking}
                                            className="px-8 py-4 bg-gradient-to-r from-vitamin-600 to-vitamin-700 text-white font-semibold rounded-xl hover:from-vitamin-700 hover:to-vitamin-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                        >
                                            {isChecking ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Analyzing...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <span>🔍</span>
                                                    <span>Check Immunity</span>
                                                </div>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Real-time indicator */}
                                    <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
                                        <div className="flex items-center space-x-2 text-vitamin-600">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            <span className="font-medium">Real-time DNS analysis</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-500">
                                            <span>🛡️</span>
                                            <span>Spam house detection</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-500">
                                            <span>📧</span>
                                            <span>Email authentication</span>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 font-medium">⚠️ {error}</p>
                                    </div>
                                )}
                            </form>
                        </Card.Body>
                    </Card>

                    {/* Results */}
                    {result && (
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-vitamin-50">
                            <Card.Body className="p-8">
                                <div className="text-center mb-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <span className="text-4xl">🍊</span>
                                        <h2 className="ml-3 text-3xl font-bold text-gray-900">
                                            Health Report for <span className="text-vitamin-600">{result.domain}</span>
                                        </h2>
                                    </div>
                                    <p className="text-gray-600">
                                        Your domain&apos;s &quot;immune system&quot; analysis is complete! Here&apos;s how healthy it is:
                                    </p>
                                </div>

                                {result.realData && (
                                    <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center justify-center space-x-3">
                                            <span className="text-2xl">🟢</span>
                                            <div className="text-center">
                                                <p className="font-semibold text-green-800">Real-time Analysis Complete</p>
                                                <p className="text-sm text-green-600">Fresh data from DNS lookups and spam databases</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-8">
                                    {/* Health Score */}
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                        <div className="text-center mb-6">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                🍊 Domain Immunity Score
                                            </h3>
                                            <p className="text-gray-600">
                                                Just like a blood test, but for your domain&apos;s email health!
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-center mb-6">
                                            <div className="relative">
                                                <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className={`text-4xl font-bold ${getHealthScoreColor(result.healthScore)}`}>
                                                            {result.healthScore}
                                                        </div>
                                                        <div className="text-sm text-gray-500">out of 100</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getHealthScoreBg(result.healthScore)}`}>
                                                <span className="mr-2">
                                                    {result.healthScore >= 80 ? '🟢' : result.healthScore >= 60 ? '🟡' : '🔴'}
                                                </span>
                                                <span className={getHealthScoreColor(result.healthScore)}>
                                                    {result.healthScore >= 80 ? 'Excellent Immunity!' :
                                                        result.healthScore >= 60 ? 'Good Health' : 'Needs Vitamin C!'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Overview */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 rounded-full bg-gray-50">
                                                    {getSpamHouseStatusIcon(result.spamHouseStatus)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 mb-1">Spam House Status</p>
                                                    <p className={`text-xl font-bold ${getSpamHouseStatusColor(result.spamHouseStatus)}`}>
                                                        {getSpamHouseStatusText(result.spamHouseStatus)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {result.spamHouseStatus === 'CLEAN' ? 'No spam flags detected' : 'Domain flagged in spam databases'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 rounded-full bg-gray-50">
                                                    <ShieldCheckIcon className={`w-6 h-6 ${result.isHealthy ? 'text-green-600' : 'text-red-600'}`} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 mb-1">Overall Health</p>
                                                    <p className={`text-xl font-bold ${result.isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                                                        {result.isHealthy ? 'Healthy' : 'Needs Attention'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {result.isHealthy ? 'Your domain is in good shape!' : 'Some issues need fixing'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Authentication */}
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                        <div className="text-center mb-6">
                                            <h4 className="text-2xl font-bold text-gray-900 mb-2">
                                                📧 Email Authentication Check
                                            </h4>
                                            <p className="text-gray-600">
                                                These are like your domain&apos;s &quot;vitamins&quot; for email security!
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className={`p-4 rounded-xl border-2 ${result.checks.spf.exists ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-gray-800">SPF Record</span>
                                                    <div className="flex items-center space-x-2">
                                                        {result.checks.spf.exists ? (
                                                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <XCircleIcon className="w-5 h-5 text-red-600" />
                                                        )}
                                                        <span className={`text-sm font-medium ${result.checks.spf.exists ? 'text-green-600' : 'text-red-600'}`}>
                                                            {result.checks.spf.exists ? 'Configured' : 'Missing'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    {result.checks.spf.exists ? '✅ Prevents email spoofing' : '❌ Vulnerable to spoofing'}
                                                </p>
                                            </div>

                                            <div className={`p-4 rounded-xl border-2 ${result.checks.dkim.exists ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-gray-800">DKIM Record</span>
                                                    <div className="flex items-center space-x-2">
                                                        {result.checks.dkim.exists ? (
                                                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <XCircleIcon className="w-5 h-5 text-red-600" />
                                                        )}
                                                        <span className={`text-sm font-medium ${result.checks.dkim.exists ? 'text-green-600' : 'text-red-600'}`}>
                                                            {result.checks.dkim.exists ? 'Configured' : 'Missing'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    {result.checks.dkim.exists ? '✅ Email integrity verified' : '❌ No email verification'}
                                                </p>
                                            </div>

                                            <div className={`p-4 rounded-xl border-2 ${result.checks.dmarc.exists ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-gray-800">DMARC Record</span>
                                                    <div className="flex items-center space-x-2">
                                                        {result.checks.dmarc.exists ? (
                                                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <XCircleIcon className="w-5 h-5 text-red-600" />
                                                        )}
                                                        <span className={`text-sm font-medium ${result.checks.dmarc.exists ? 'text-green-600' : 'text-red-600'}`}>
                                                            {result.checks.dmarc.exists ? 'Configured' : 'Missing'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    {result.checks.dmarc.exists ? '✅ Advanced protection enabled' : '❌ Missing advanced protection'}
                                                </p>
                                            </div>

                                            <div className={`p-4 rounded-xl border-2 ${result.checks.mx.exists ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-gray-800">MX Records</span>
                                                    <div className="flex items-center space-x-2">
                                                        {result.checks.mx.exists ? (
                                                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <XCircleIcon className="w-5 h-5 text-red-600" />
                                                        )}
                                                        <span className={`text-sm font-medium ${result.checks.mx.exists ? 'text-green-600' : 'text-red-600'}`}>
                                                            {result.checks.mx.exists ? 'Configured' : 'Missing'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    {result.checks.mx.exists ? '✅ Email server configured' : '❌ No email server setup'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recommendations */}
                                    <div className="bg-gradient-to-r from-vitamin-50 to-orange-50 rounded-2xl p-6 border border-vitamin-200">
                                        <div className="text-center mb-6">
                                            <h4 className="text-2xl font-bold text-vitamin-800 mb-2">
                                                🍊 Your Domain&apos;s &quot;Vitamin C&quot; Prescription
                                            </h4>
                                            <p className="text-vitamin-700">
                                                Here&apos;s how to boost your domain&apos;s immunity system!
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            {!result.checks.spf.exists && (
                                                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-vitamin-200">
                                                    <span className="text-2xl">🛡️</span>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Configure SPF Record</p>
                                                        <p className="text-sm text-gray-600">Add SPF record to prevent email spoofing and improve deliverability</p>
                                                    </div>
                                                </div>
                                            )}

                                            {!result.checks.dkim.exists && (
                                                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-vitamin-200">
                                                    <span className="text-2xl">🔐</span>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Set up DKIM Authentication</p>
                                                        <p className="text-sm text-gray-600">Enable DKIM to verify email integrity and build trust</p>
                                                    </div>
                                                </div>
                                            )}

                                            {!result.checks.dmarc.exists && (
                                                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-vitamin-200">
                                                    <span className="text-2xl">🛡️</span>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Implement DMARC Policy</p>
                                                        <p className="text-sm text-gray-600">Add DMARC for advanced protection against email spoofing</p>
                                                    </div>
                                                </div>
                                            )}

                                            {result.spamHouseStatus === 'FLAGGED' && (
                                                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-red-200">
                                                    <span className="text-2xl">🚨</span>
                                                    <div>
                                                        <p className="font-semibold text-red-800">Remove from Spam Databases</p>
                                                        <p className="text-sm text-red-600">Contact spam databases to request delisting and improve reputation</p>
                                                    </div>
                                                </div>
                                            )}

                                            {result.healthScore >= 80 && (
                                                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-green-200">
                                                    <span className="text-2xl">🎉</span>
                                                    <div>
                                                        <p className="font-semibold text-green-800">Excellent Health!</p>
                                                        <p className="text-sm text-green-600">Your domain has a strong immune system! Keep up the good work!</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                            <Card.Footer className="p-6 bg-gray-50 rounded-b-2xl">
                                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                                    <Button
                                        onClick={() => setDomain('')}
                                        className="flex-1 px-6 py-3 text-vitamin-600 border-2 border-vitamin-600 hover:bg-vitamin-50 font-semibold rounded-xl transition-all duration-200"
                                    >
                                        <span className="mr-2">🔄</span>
                                        Check Another Domain
                                    </Button>
                                    {verificationCount >= 3 ? (
                                        <Button
                                            onClick={() => window.location.href = '/auth/login'}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-vitamin-600 to-vitamin-700 text-white hover:from-vitamin-700 hover:to-vitamin-800 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                        >
                                            <span className="mr-2">🚀</span>
                                            Go Pro - Create Free Account
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => window.location.href = '/auth/login'}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                        >
                                            <span className="mr-2">📊</span>
                                            Create Dashboard
                                        </Button>
                                    )}
                                </div>

                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-500">
                                        🍊 <strong>Fun Fact:</strong> Just like Vitamin C prevents scurvy, proper email authentication prevents spam!
                                    </p>
                                </div>
                            </Card.Footer>
                        </Card>
                    )}
                </div>
            </div>
        </LandingLayout>
    );
};

export default DomainChecker;
