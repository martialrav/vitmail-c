import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, ShieldCheckIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Meta from '@/components/Meta/index';
import { LandingLayout } from '@/layouts/index';
import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Modal from '@/components/Modal/index';

const DomainChecker = () => {
    const [domain, setDomain] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [verificationCount, setVerificationCount] = useState(0);
    const [useRealData, setUseRealData] = useState(true); // Always use real data in production
    const [showWaitlistModal, setShowWaitlistModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [waitlistEmail, setWaitlistEmail] = useState('');
    const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
    const [waitlistSuccess, setWaitlistSuccess] = useState(false);

    const validateDomain = (domain) => {
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
        return domainRegex.test(domain);
    };

    const checkDomainHealth = async (domainName, useRealData = false) => {
        // Check if user has reached the limit
        if (verificationCount >= 3) {
            setShowAccountModal(true);
            return;
        }

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

    const handleWaitlistSubmit = async (e) => {
        e.preventDefault();
        if (!waitlistEmail.trim()) {
            return;
        }

        setIsSubmittingWaitlist(true);
        try {
            // Here you would typically send the email to your backend
            // For now, we'll just simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));
            setWaitlistSuccess(true);
            setTimeout(() => {
                setShowWaitlistModal(false);
                setWaitlistEmail('');
                setWaitlistSuccess(false);
            }, 2000);
        } catch (error) {
            console.error('Failed to submit waitlist:', error);
        } finally {
            setIsSubmittingWaitlist(false);
        }
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

            <div className="w-full py-6 sm:py-10" id="domain-checker">
                <div className="relative flex flex-col px-4 sm:px-5 mx-auto space-y-6 sm:space-y-8 max-w-7xl">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-4 sm:mb-6">
                            <div className="relative">
                                <span className="text-4xl sm:text-5xl">🍊</span>
                                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <span className="ml-3 sm:ml-4 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-vitamin-600 to-vitamin-700 bg-clip-text text-transparent">
                                Vitmail-C
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Boost Your Domain&apos;s
                            <span className="block bg-gradient-to-r from-vitamin-600 to-vitamin-700 bg-clip-text text-transparent">
                                Immunity System
                            </span>
                        </h1>
                        <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
                            Just like Vitamin C strengthens your immune system, Vitmail-C fortifies your domain&apos;s
                            email infrastructure. Get instant health reports, spam detection, and authentication analysis.
                        </p>
                        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-500">
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
                            <div className="mt-4 sm:mt-6 p-4 bg-vitamin-50 rounded-lg border border-vitamin-200 max-w-md mx-auto">
                                <p className="text-vitamin-800 font-medium">
                                    🍊 You&apos;ve checked {verificationCount} domain{verificationCount !== 1 ? 's' : ''} today
                                </p>
                                {verificationCount >= 3 ? (
                                    <p className="mt-2 text-vitamin-700 text-sm">
                                        You&apos;ve reached the free limit! Create an account to check more domains.
                                    </p>
                                ) : (
                                    <p className="mt-2 text-vitamin-700 text-sm">
                                        {3 - verificationCount} free check{3 - verificationCount !== 1 ? 's' : ''} remaining
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Domain Input Form */}
                    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-vitamin-50">
                        <Card.Body className="p-4 sm:p-6 lg:p-8">
                            <div className="text-center mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                    🍊 Give Your Domain a Health Check
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600 px-2">
                                    Enter your domain below and we&apos;ll analyze its &quot;immune system&quot; in real-time
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                <div className="relative">
                                    <label htmlFor="domain" className="block text-sm font-semibold text-gray-700 mb-3">
                                        Domain Name
                                    </label>
                                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                id="domain"
                                                value={domain}
                                                onChange={(e) => setDomain(e.target.value)}
                                                placeholder="yourdomain.com"
                                                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-vitamin-100 focus:border-vitamin-500 transition-all duration-200 shadow-sm"
                                                disabled={isChecking}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4">
                                                <span className="text-gray-400">🌐</span>
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={!domain.trim() || isChecking}
                                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-vitamin-600 to-vitamin-700 text-white font-semibold rounded-xl hover:from-vitamin-700 hover:to-vitamin-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 min-h-[48px]"
                                        >
                                            {isChecking ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-sm sm:text-base">Analyzing...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <span>🔍</span>
                                                    <span className="text-sm sm:text-base">Check Immunity</span>
                                                </div>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Real-time indicator */}
                                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm">
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
                            <Card.Body className="p-4 sm:p-6 lg:p-8">
                                <div className="text-center mb-4 sm:mb-6">
                                    <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4">
                                        <span className="text-3xl sm:text-4xl">🍊</span>
                                        <h2 className="ml-0 sm:ml-3 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2 sm:mt-0">
                                            Health Report for <span className="text-vitamin-600 break-all">{result.domain}</span>
                                        </h2>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-600 px-2">
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
                                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                                        <div className="text-center mb-4 sm:mb-6">
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                                🍊 Domain Immunity Score
                                            </h3>
                                            <p className="text-sm sm:text-base text-gray-600 px-2">
                                                Just like a blood test, but for your domain&apos;s email health!
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-center mb-4 sm:mb-6">
                                            <div className="relative">
                                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-6 sm:border-8 border-gray-200 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className={`text-2xl sm:text-4xl font-bold ${getHealthScoreColor(result.healthScore)}`}>
                                                            {result.healthScore}
                                                        </div>
                                                        <div className="text-xs sm:text-sm text-gray-500">out of 100</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-sm sm:text-lg font-semibold ${getHealthScoreBg(result.healthScore)}`}>
                                                <span className="mr-1 sm:mr-2">
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
                                            <div className="flex items-center space-x-3 sm:space-x-4">
                                                <div className="p-2 sm:p-3 rounded-full bg-gray-50 flex-shrink-0">
                                                    {getSpamHouseStatusIcon(result.spamHouseStatus)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Spam House Status</p>
                                                    <p className={`text-lg sm:text-xl font-bold ${getSpamHouseStatusColor(result.spamHouseStatus)}`}>
                                                        {getSpamHouseStatusText(result.spamHouseStatus)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {result.spamHouseStatus === 'CLEAN' ? 'No spam flags detected' : 'Domain flagged in spam databases'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
                                            <div className="flex items-center space-x-3 sm:space-x-4">
                                                <div className="p-2 sm:p-3 rounded-full bg-gray-50 flex-shrink-0">
                                                    <ShieldCheckIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${result.isHealthy ? 'text-green-600' : 'text-red-600'}`} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Overall Health</p>
                                                    <p className={`text-lg sm:text-xl font-bold ${result.isHealthy ? 'text-green-600' : 'text-red-600'}`}>
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
                                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                                        <div className="text-center mb-4 sm:mb-6">
                                            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                                📧 Email Authentication Check
                                            </h4>
                                            <p className="text-sm sm:text-base text-gray-600 px-2">
                                                These are like your domain&apos;s &quot;vitamins&quot; for email security!
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className={`p-3 sm:p-4 rounded-xl border-2 ${result.checks.spf.exists ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm sm:text-base font-semibold text-gray-800">SPF Record</span>
                                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                                        {result.checks.spf.exists ? (
                                                            <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                        ) : (
                                                            <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                                        )}
                                                        <span className={`text-xs sm:text-sm font-medium ${result.checks.spf.exists ? 'text-green-600' : 'text-red-600'}`}>
                                                            {result.checks.spf.exists ? `Configured (${result.checks.spf.count})` : 'Missing'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    {result.checks.spf.exists ? '✅ Prevents email spoofing' : '❌ Vulnerable to spoofing'}
                                                </p>
                                                {result.checks.spf.warning && (
                                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                        <p className="text-xs text-yellow-800">⚠️ {result.checks.spf.warning}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`p-3 sm:p-4 rounded-xl border-2 ${result.checks.dkim.exists ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm sm:text-base font-semibold text-gray-800">DKIM Record</span>
                                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                                        {result.checks.dkim.exists ? (
                                                            <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                        ) : (
                                                            <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                                        )}
                                                        <span className={`text-xs sm:text-sm font-medium ${result.checks.dkim.exists ? 'text-green-600' : 'text-red-600'}`}>
                                                            {result.checks.dkim.exists ? `Configured (${result.checks.dkim.count})` : 'Missing'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    {result.checks.dkim.exists ? '✅ Email integrity verified' : '❌ No email verification'}
                                                </p>
                                                {result.checks.dkim.warning && (
                                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                        <p className="text-xs text-yellow-800">⚠️ {result.checks.dkim.warning}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`p-3 sm:p-4 rounded-xl border-2 ${result.checks.dmarc.exists ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm sm:text-base font-semibold text-gray-800">DMARC Record</span>
                                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                                        {result.checks.dmarc.exists ? (
                                                            <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                        ) : (
                                                            <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                                        )}
                                                        <span className={`text-xs sm:text-sm font-medium ${result.checks.dmarc.exists ? 'text-green-600' : 'text-red-600'}`}>
                                                            {result.checks.dmarc.exists ? `Configured (${result.checks.dmarc.policy})` : 'Missing'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    {result.checks.dmarc.exists ? `✅ Policy: ${result.checks.dmarc.policy.toUpperCase()}` : '❌ Missing advanced protection'}
                                                </p>
                                                {result.checks.dmarc.warning && (
                                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                        <p className="text-xs text-yellow-800">⚠️ {result.checks.dmarc.warning}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`p-3 sm:p-4 rounded-xl border-2 ${result.checks.mx.exists ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm sm:text-base font-semibold text-gray-800">MX Records</span>
                                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                                        {result.checks.mx.exists ? (
                                                            <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                        ) : (
                                                            <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                                        )}
                                                        <span className={`text-xs sm:text-sm font-medium ${result.checks.mx.exists ? 'text-green-600' : 'text-red-600'}`}>
                                                            {result.checks.mx.exists ? `Configured (${result.checks.mx.count})` : 'Missing'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    {result.checks.mx.exists ? '✅ Email server configured' : '❌ No email server setup'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Spam House Details */}
                                    {result.checks.flaggedHouses && result.checks.flaggedHouses.length > 0 && (
                                        <div className="bg-red-50 rounded-2xl p-4 sm:p-6 border border-red-200">
                                            <div className="text-center mb-4 sm:mb-6">
                                                <h4 className="text-xl sm:text-2xl font-bold text-red-800 mb-2">
                                                    🚨 Spam House Flags
                                                </h4>
                                                <p className="text-sm sm:text-base text-red-700 px-2">
                                                    Your domain has been flagged by the following spam databases
                                                </p>
                                            </div>

                                            <div className="space-y-3 sm:space-y-4">
                                                {result.checks.flaggedHouses.map((house, index) => (
                                                    <div key={index} className="flex items-start space-x-3 p-3 sm:p-4 bg-white rounded-xl border border-red-200">
                                                        <span className="text-xl sm:text-2xl flex-shrink-0">🚨</span>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm sm:text-base font-semibold text-red-800">{house.name}</p>
                                                            <p className="text-xs sm:text-sm text-red-600 mb-2">{house.reason}</p>
                                                            {house.contact && (
                                                                <a
                                                                    href={house.contact}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline"
                                                                >
                                                                    Contact {house.name} to request delisting →
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Recommendations */}
                                    <div className="bg-gradient-to-r from-vitamin-50 to-orange-50 rounded-2xl p-4 sm:p-6 border border-vitamin-200">
                                        <div className="text-center mb-4 sm:mb-6">
                                            <h4 className="text-xl sm:text-2xl font-bold text-vitamin-800 mb-2">
                                                🍊 Your Domain&apos;s &quot;Vitamin C&quot; Prescription
                                            </h4>
                                            <p className="text-sm sm:text-base text-vitamin-700 px-2">
                                                Here&apos;s how to boost your domain&apos;s immunity system!
                                            </p>
                                        </div>

                                        <div className="space-y-3 sm:space-y-4">
                                            {!result.checks.spf.exists && (
                                                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white rounded-xl border border-vitamin-200">
                                                    <span className="text-xl sm:text-2xl flex-shrink-0">🛡️</span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm sm:text-base font-semibold text-gray-800">Configure SPF Record</p>
                                                        <p className="text-xs sm:text-sm text-gray-600">Add SPF record to prevent email spoofing and improve deliverability</p>
                                                    </div>
                                                </div>
                                            )}

                                            {result.checks.spf.hasMultiple && (
                                                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white rounded-xl border border-yellow-200">
                                                    <span className="text-xl sm:text-2xl flex-shrink-0">⚠️</span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm sm:text-base font-semibold text-yellow-800">Fix Multiple SPF Records</p>
                                                        <p className="text-xs sm:text-sm text-yellow-600">You have {result.checks.spf.count} SPF records. Consolidate them into a single record to avoid issues</p>
                                                    </div>
                                                </div>
                                            )}

                                            {!result.checks.dkim.exists && (
                                                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white rounded-xl border border-vitamin-200">
                                                    <span className="text-xl sm:text-2xl flex-shrink-0">🔐</span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm sm:text-base font-semibold text-gray-800">Set up DKIM Authentication</p>
                                                        <p className="text-xs sm:text-sm text-gray-600">Enable DKIM to verify email integrity and build trust</p>
                                                    </div>
                                                </div>
                                            )}

                                            {result.checks.dkim.exists && result.checks.dkim.count > 1 && (
                                                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white rounded-xl border border-blue-200">
                                                    <span className="text-xl sm:text-2xl flex-shrink-0">ℹ️</span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm sm:text-base font-semibold text-blue-800">Multiple DKIM Records Found</p>
                                                        <p className="text-xs sm:text-sm text-blue-600">You have {result.checks.dkim.count} DKIM records. This is normal for multiple email services</p>
                                                    </div>
                                                </div>
                                            )}

                                            {!result.checks.dmarc.exists && (
                                                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white rounded-xl border border-vitamin-200">
                                                    <span className="text-xl sm:text-2xl flex-shrink-0">🛡️</span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm sm:text-base font-semibold text-gray-800">Implement DMARC Policy</p>
                                                        <p className="text-xs sm:text-sm text-gray-600">Add DMARC for advanced protection against email spoofing</p>
                                                    </div>
                                                </div>
                                            )}

                                            {result.checks.dmarc.exists && result.checks.dmarc.policy === 'none' && (
                                                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white rounded-xl border border-yellow-200">
                                                    <span className="text-xl sm:text-2xl flex-shrink-0">⚠️</span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm sm:text-base font-semibold text-yellow-800">Strengthen DMARC Policy</p>
                                                        <p className="text-xs sm:text-sm text-yellow-600">Your DMARC policy is set to "none". Consider using "quarantine" or "reject" for better protection</p>
                                                    </div>
                                                </div>
                                            )}

                                            {result.checks.flaggedHouses && result.checks.flaggedHouses.length > 0 && (
                                                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white rounded-xl border border-red-200">
                                                    <span className="text-xl sm:text-2xl flex-shrink-0">🚨</span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm sm:text-base font-semibold text-red-800">Remove from Spam Databases</p>
                                                        <p className="text-xs sm:text-sm text-red-600">Contact the flagged spam databases to request delisting and improve reputation</p>
                                                    </div>
                                                </div>
                                            )}

                                            {result.healthScore >= 80 && (
                                                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white rounded-xl border border-green-200">
                                                    <span className="text-xl sm:text-2xl flex-shrink-0">🎉</span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm sm:text-base font-semibold text-green-800">Excellent Health!</p>
                                                        <p className="text-xs sm:text-sm text-green-600">Your domain has a strong immune system! Keep up the good work!</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                            <Card.Footer className="p-4 sm:p-6 bg-gray-50 rounded-b-2xl">
                                <div className="flex flex-col space-y-3 sm:space-y-4">
                                    <Button
                                        onClick={() => setDomain('')}
                                        className="w-full px-4 sm:px-6 py-3 text-vitamin-600 border-2 border-vitamin-600 hover:bg-vitamin-50 font-semibold rounded-xl transition-all duration-200 min-h-[48px]"
                                    >
                                        <span className="mr-2">🔄</span>
                                        Check Another Domain
                                    </Button>
                                    <Button
                                        onClick={() => setShowWaitlistModal(true)}
                                        className="w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-vitamin-600 to-vitamin-700 text-white hover:from-vitamin-700 hover:to-vitamin-800 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 min-h-[48px]"
                                    >
                                        <span className="mr-2">📝</span>
                                        Join Pro Waitlist
                                    </Button>
                                </div>

                                <div className="mt-3 sm:mt-4 text-center">
                                    <p className="text-xs sm:text-sm text-gray-500 px-2">
                                        🍊 <strong>Fun Fact:</strong> Just like Vitamin C prevents scurvy, proper email authentication prevents spam!
                                    </p>
                                </div>
                            </Card.Footer>
                        </Card>
                    )}
                </div>
            </div>

            {/* Waitlist Modal */}
            <Modal
                isOpen={showWaitlistModal}
                onClose={() => setShowWaitlistModal(false)}
                title="Join the Pro Waitlist"
            >
                <div className="p-6">
                    {!waitlistSuccess ? (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-vitamin-600 to-vitamin-700 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">🍊</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Join the Vitmail-C Pro Waitlist
                                </h3>
                                <p className="text-gray-600">
                                    Be the first to know when our pro features launch! Get early access to unlimited domain monitoring, advanced analytics, and more.
                                </p>
                            </div>

                            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="waitlist-email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="waitlist-email"
                                        value={waitlistEmail}
                                        onChange={(e) => setWaitlistEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-vitamin-100 focus:border-vitamin-500 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <Button
                                        type="button"
                                        onClick={() => setShowWaitlistModal(false)}
                                        className="flex-1 px-4 py-3 text-gray-600 border-2 border-gray-200 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-200"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!waitlistEmail.trim() || isSubmittingWaitlist}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-vitamin-600 to-vitamin-700 text-white hover:from-vitamin-700 hover:to-vitamin-800 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                                    >
                                        {isSubmittingWaitlist ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Joining...</span>
                                            </div>
                                        ) : (
                                            'Join Waitlist'
                                        )}
                                    </Button>
                                </div>
                            </form>

                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <span className="font-semibold">🎉 What you&apos;ll get:</span> Early access, exclusive features, and priority support when we launch!
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircleIcon className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                You&apos;re on the waitlist! 🎉
                            </h3>
                            <p className="text-gray-600">
                                We&apos;ll notify you as soon as pro features are available. Thank you for your interest!
                            </p>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Account Creation Modal */}
            <Modal
                isOpen={showAccountModal}
                onClose={() => setShowAccountModal(false)}
                title="Create Your Free Account"
            >
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-vitamin-600 to-vitamin-700 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🍊</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            You&apos;ve Used Your Free Checks!
                        </h3>
                        <p className="text-gray-600">
                            You&apos;ve checked 3 domains for free. Create a free account to continue monitoring more domains with up to 5 domains in your dashboard.
                        </p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-green-800">Free Account Benefits</p>
                                <p className="text-sm text-green-700">Monitor up to 5 domains with detailed health reports</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                            <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-blue-800">Dashboard Access</p>
                                <p className="text-sm text-blue-700">Track all your domains in one organized dashboard</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                            <CheckCircleIcon className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-purple-800">Regular Monitoring</p>
                                <p className="text-sm text-purple-700">Get notified when your domain health changes</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <Button
                            onClick={() => setShowAccountModal(false)}
                            className="flex-1 px-4 py-3 text-gray-600 border-2 border-gray-200 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-200"
                        >
                            Maybe Later
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/auth/login'}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-vitamin-600 to-vitamin-700 text-white hover:from-vitamin-700 hover:to-vitamin-800 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            Create Free Account
                        </Button>
                    </div>
                </div>
            </Modal>
        </LandingLayout>
    );
};

export default DomainChecker;
