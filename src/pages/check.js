import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, ShieldCheckIcon, ClockIcon, XMarkIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Meta from '@/components/Meta/index';
import { LandingLayout } from '@/layouts/index';
import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Modal from '@/components/Modal/index';
import DNSRecordsDisplay from '@/components/Dashboard/DNSRecordsDisplay';
import RecommendationsDisplay from '@/components/Dashboard/RecommendationsDisplay';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            delay: 0.2
        }
    },
    hover: {
        scale: 1.02,
        y: -5,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    }
};

// Reusable Components
const MetricCard = ({ title, value, icon, trend, color = "blue", delay = 0 }) => (
    <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-${color}-200`}
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className={`text-${color}-600 text-sm font-medium mb-1`}>{title}</p>
                <p className={`text-2xl font-bold text-${color}-800`}>{value}</p>
            </div>
            <div className={`p-3 bg-${color}-200 rounded-full`}>
                {icon}
                {trend && (
                    <div className="mt-1">
                        {trend === 'up' ?
                            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" /> :
                            <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                        }
                    </div>
                )}
            </div>
        </div>
    </motion.div>
);

const AnimatedCard = ({ children, delay = 0, className = "" }) => (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}
        style={{ animationDelay: `${delay}ms` }}
    >
        {children}
    </motion.div>
);

const HealthScoreGauge = ({ score, size = 200 }) => {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedScore(score);
        }, 500);
        return () => clearTimeout(timer);
    }, [score]);

    const data = [
        {
            name: 'Health Score',
            value: animatedScore,
            fill: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
        }
    ];

    return (
        <div className="relative">
            <ResponsiveContainer width={size} height={size}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={data}>
                    <RadialBar
                        dataKey="value"
                        cornerRadius={10}
                        fill={data[0].fill}
                        background={{ fill: '#f3f4f6' }}
                    />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <div className={`text-4xl font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {animatedScore}
                    </div>
                    <div className="text-sm text-gray-500">Health Score</div>
                </div>
            </div>
        </div>
    );
};

const LoadingStage = ({ stage, isActive, isComplete }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-3 p-3 rounded-lg bg-white shadow-sm"
    >
        <div className={`w-4 h-4 rounded-full ${isComplete ? 'bg-green-500' : isActive ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
        <span className={`text-sm ${isActive ? 'text-blue-700 font-medium' : isComplete ? 'text-green-700' : 'text-gray-500'}`}>
            {stage}
        </span>
        {isActive && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-auto" />
        )}
        {isComplete && (
            <CheckCircleIcon className="w-4 h-4 text-green-500 ml-auto" />
        )}
    </motion.div>
);

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
    const [loadingStages, setLoadingStages] = useState([]);
    const [currentStage, setCurrentStage] = useState(0);

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
        setResult(null);

        // Initialize loading stages
        const stages = [
            'Connecting to domain...',
            'Checking DNS records...',
            'Analyzing email authentication...',
            'Scanning spam databases...',
            'Calculating health score...',
            'Finalizing report...'
        ];

        setLoadingStages(stages);
        setCurrentStage(0);

        // Simulate progressive loading stages
        const stageInterval = setInterval(() => {
            setCurrentStage(prev => {
                if (prev < stages.length - 1) {
                    return prev + 1;
                } else {
                    clearInterval(stageInterval);
                    return prev;
                }
            });
        }, 800);

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

            // Wait for all stages to complete before showing results
            setTimeout(() => {
                clearInterval(stageInterval);
                setCurrentStage(stages.length);
                setResult(data.data);
                setVerificationCount(prev => prev + 1);
                setIsChecking(false);
            }, 1000);

        } catch (err) {
            clearInterval(stageInterval);
            setError(err.message || 'Failed to check domain health. Please try again.');
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

    // Chart data preparation functions
    const prepareAuthenticationData = (checks) => {
        if (!checks) return [];
        return [
            {
                name: 'SPF',
                status: checks.spf?.exists ? 'Configured' : 'Missing',
                value: checks.spf?.exists ? 100 : 0,
                fill: checks.spf?.exists ? '#10b981' : '#ef4444'
            },
            {
                name: 'DKIM',
                status: checks.dkim?.exists ? 'Configured' : 'Missing',
                value: checks.dkim?.exists ? 100 : 0,
                fill: checks.dkim?.exists ? '#10b981' : '#ef4444'
            },
            {
                name: 'DMARC',
                status: checks.dmarc?.exists ? 'Configured' : 'Missing',
                value: checks.dmarc?.exists ? 100 : 0,
                fill: checks.dmarc?.exists ? '#10b981' : '#ef4444'
            },
            {
                name: 'MX',
                status: checks.mx?.exists ? 'Configured' : 'Missing',
                value: checks.mx?.exists ? 100 : 0,
                fill: checks.mx?.exists ? '#10b981' : '#ef4444'
            }
        ];
    };

    const prepareBlacklistData = (blacklistSummary) => {
        if (!blacklistSummary) return [];
        return [
            {
                name: 'Clean',
                value: blacklistSummary.cleanCount,
                fill: '#10b981'
            },
            {
                name: 'Flagged',
                value: blacklistSummary.flaggedCount,
                fill: '#ef4444'
            }
        ];
    };

    const preparePerformanceData = () => {
        // Mock performance data for demonstration
        return [
            { name: 'Week 1', score: 65, checks: 12 },
            { name: 'Week 2', score: 72, checks: 18 },
            { name: 'Week 3', score: 78, checks: 24 },
            { name: 'Week 4', score: result?.healthScore || 85, checks: 30 }
        ];
    };

    const customTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <LandingLayout>
            <Meta
                title="Free Domain Health Check - Vitmail-C"
                description="Check your domain's health instantly. No registration required. Get spam house status, email authentication analysis, and health score."
            />

            <div className="w-full py-6 sm:py-10 bg-gradient-to-br from-vitamin-50 via-white to-orange-50 min-h-screen" id="domain-checker">
                <motion.div
                    className="relative flex flex-col px-4 sm:px-5 mx-auto space-y-6 sm:space-y-8 max-w-7xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <motion.div className="text-center" variants={itemVariants}>
                        <motion.div
                            className="flex items-center justify-center mb-4 sm:mb-6"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <div className="relative">
                                <motion.span
                                    className="text-4xl sm:text-5xl"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    🍊
                                </motion.span>
                                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <motion.span
                                className="ml-3 sm:ml-4 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-vitamin-600 to-vitamin-700 bg-clip-text text-transparent"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                Vitmail-C
                            </motion.span>
                        </motion.div>
                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            Boost Your Domain&apos;s
                            <motion.span
                                className="block bg-gradient-to-r from-vitamin-600 to-vitamin-700 bg-clip-text text-transparent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                Immunity System
                            </motion.span>
                        </motion.h1>
                        <motion.p
                            className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            Just like Vitamin C strengthens your immune system, Vitmail-C fortifies your domain&apos;s
                            email infrastructure. Get instant health reports, spam detection, and authentication analysis.
                        </motion.p>
                        <motion.div
                            className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                        >
                            {[
                                { color: 'bg-green-500', text: 'Real-time analysis' },
                                { color: 'bg-blue-500', text: 'No registration required' },
                                { color: 'bg-purple-500', text: 'Professional insights' }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center space-x-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.6 + index * 0.1 }}
                                >
                                    <span className={`w-2 h-2 ${item.color} rounded-full animate-pulse`}></span>
                                    <span>{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                        <AnimatePresence>
                            {verificationCount > 0 && (
                                <motion.div
                                    className="mt-4 sm:mt-6 p-4 bg-gradient-to-r from-vitamin-50 to-orange-50 rounded-xl border border-vitamin-200 max-w-md mx-auto shadow-lg"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                >
                                    <motion.p
                                        className="text-vitamin-800 font-medium"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    >
                                        🍊 You&apos;ve checked {verificationCount} domain{verificationCount !== 1 ? 's' : ''} today
                                    </motion.p>
                                    {verificationCount >= 3 ? (
                                        <p className="mt-2 text-vitamin-700 text-sm">
                                            You&apos;ve reached the free limit! Create an account to check more domains.
                                        </p>
                                    ) : (
                                        <p className="mt-2 text-vitamin-700 text-sm">
                                            {3 - verificationCount} free check{3 - verificationCount !== 1 ? 's' : ''} remaining
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Domain Input Form */}
                    <AnimatedCard className="bg-gradient-to-br from-white via-vitamin-50 to-orange-50 border-0 shadow-2xl" delay={200}>
                        <div className="p-4 sm:p-6 lg:p-8">
                            <motion.div
                                className="text-center mb-4 sm:mb-6"
                                variants={itemVariants}
                            >
                                <motion.h2
                                    className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    🍊 Give Your Domain a Health Check
                                </motion.h2>
                                <p className="text-sm sm:text-base text-gray-600 px-2">
                                    Enter your domain below and we&apos;ll analyze its &quot;immune system&quot; in real-time
                                </p>
                            </motion.div>

                            {/* Loading Stages */}
                            <AnimatePresence>
                                {isChecking && loadingStages.length > 0 && (
                                    <motion.div
                                        className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="text-center mb-4">
                                            <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                                🔍 Analyzing Your Domain
                                            </h3>
                                            <div className="w-full bg-blue-200 rounded-full h-2">
                                                <motion.div
                                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${((currentStage + 1) / loadingStages.length) * 100}%` }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {loadingStages.map((stage, index) => (
                                                <LoadingStage
                                                    key={index}
                                                    stage={stage}
                                                    isActive={index === currentStage}
                                                    isComplete={index < currentStage}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.form
                                onSubmit={handleSubmit}
                                className="space-y-4 sm:space-y-6"
                                variants={itemVariants}
                            >
                                <div className="relative">
                                    <label htmlFor="domain" className="block text-sm font-semibold text-gray-700 mb-3">
                                        Domain Name
                                    </label>
                                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                                        <motion.div
                                            className="flex-1 relative"
                                            whileFocus={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <input
                                                type="text"
                                                id="domain"
                                                value={domain}
                                                onChange={(e) => setDomain(e.target.value)}
                                                placeholder="yourdomain.com"
                                                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-vitamin-100 focus:border-vitamin-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                                disabled={isChecking}
                                            />
                                            <motion.div
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4"
                                                animate={{ rotate: isChecking ? 360 : 0 }}
                                                transition={{ duration: 2, repeat: isChecking ? Infinity : 0, ease: "linear" }}
                                            >
                                                <span className="text-gray-400">🌐</span>
                                            </motion.div>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        >
                                            <Button
                                                type="submit"
                                                disabled={!domain.trim() || isChecking}
                                                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-vitamin-600 to-vitamin-700 text-white font-semibold rounded-xl hover:from-vitamin-700 hover:to-vitamin-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200 min-h-[48px]"
                                            >
                                                {isChecking ? (
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="text-sm sm:text-base">Analyzing...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <motion.span
                                                            animate={{ scale: [1, 1.2, 1] }}
                                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                                        >
                                                            🔍
                                                        </motion.span>
                                                        <span className="text-sm sm:text-base">Check Immunity</span>
                                                    </div>
                                                )}
                                            </Button>
                                        </motion.div>
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

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-lg"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                        >
                                            <motion.p
                                                className="text-red-600 font-medium"
                                                animate={{ x: [-2, 2, -2, 0] }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                ⚠️ {error}
                                            </motion.p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.form>
                        </div>
                    </AnimatedCard>

                    {/* Results */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                                className="space-y-8"
                            >
                                {/* Header */}
                                <AnimatedCard className="bg-gradient-to-br from-white via-vitamin-50 to-orange-50 border-0 shadow-2xl" delay={300}>
                                    <div className="p-4 sm:p-6 lg:p-8">
                                        <motion.div
                                            className="text-center mb-4 sm:mb-6"
                                            variants={itemVariants}
                                        >
                                            <motion.div
                                                className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <motion.span
                                                    className="text-3xl sm:text-4xl"
                                                    animate={{ rotate: [0, 10, -10, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                                                >
                                                    🍊
                                                </motion.span>
                                                <h2 className="ml-0 sm:ml-3 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2 sm:mt-0">
                                                    Health Report for <span className="text-vitamin-600 break-all">{result.domain}</span>
                                                </h2>
                                            </motion.div>
                                            <p className="text-sm sm:text-base text-gray-600 px-2">
                                                Your domain&apos;s &quot;immune system&quot; analysis is complete! Here&apos;s how healthy it is:
                                            </p>
                                        </motion.div>

                                        {result.realData && (
                                            <motion.div
                                                className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-lg"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <div className="flex items-center justify-center space-x-3">
                                                    <motion.span
                                                        className="text-2xl"
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        🟢
                                                    </motion.span>
                                                    <div className="text-center">
                                                        <p className="font-semibold text-green-800">Real-time Analysis Complete</p>
                                                        <p className="text-sm text-green-600">Fresh data from DNS lookups and spam databases</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </AnimatedCard>

                                {/* Health Score Dashboard */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Health Score Gauge */}
                                    <AnimatedCard className="lg:col-span-1 bg-gradient-to-br from-white to-gray-50" delay={400}>
                                        <div className="p-6 text-center">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">🍊 Immunity Score</h3>
                                            <div className="flex justify-center mb-4">
                                                <HealthScoreGauge score={result.healthScore} size={200} />
                                            </div>
                                            <motion.div
                                                className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getHealthScoreBg(result.healthScore)}`}
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <span className="mr-2">
                                                    {result.healthScore >= 80 ? '🟢' : result.healthScore >= 60 ? '🟡' : '🔴'}
                                                </span>
                                                <span className={getHealthScoreColor(result.healthScore)}>
                                                    {result.healthScore >= 80 ? 'Excellent!' : result.healthScore >= 60 ? 'Good Health' : 'Needs Vitamin C!'}
                                                </span>
                                            </motion.div>
                                        </div>
                                    </AnimatedCard>

                                    {/* Key Metrics */}
                                    <div className={`lg:col-span-2 grid gap-4 ${result.spamHouseStatus === 'FLAGGED' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
                                        {/* Only show spam status when flagged */}
                                        {result.spamHouseStatus === 'FLAGGED' && (
                                            <MetricCard
                                                title="⚠️ Spam Alert"
                                                value="Domain Flagged"
                                                icon={getSpamHouseStatusIcon(result.spamHouseStatus)}
                                                color="red"
                                                delay={500}
                                            />
                                        )}
                                        <MetricCard
                                            title="Overall Health"
                                            value={result.isHealthy ? 'Healthy' : 'Needs Care'}
                                            icon={<ShieldCheckIcon className={`w-6 h-6 ${result.isHealthy ? 'text-green-600' : 'text-red-600'}`} />}
                                            color={result.isHealthy ? 'green' : 'red'}
                                            delay={result.spamHouseStatus === 'FLAGGED' ? 600 : 500}
                                        />
                                        <MetricCard
                                            title="Email Auth"
                                            value={`${[result.checks.spf?.exists, result.checks.dkim?.exists, result.checks.dmarc?.exists, result.checks.mx?.exists].filter(Boolean).length}/4 Setup`}
                                            icon={<CheckCircleIcon className="w-6 h-6 text-blue-600" />}
                                            color="blue"
                                            delay={result.spamHouseStatus === 'FLAGGED' ? 700 : 600}
                                        />
                                        <MetricCard
                                            title="Security Level"
                                            value={result.healthScore >= 80 ? 'High' : result.healthScore >= 60 ? 'Medium' : 'Low'}
                                            icon={<ShieldCheckIcon className="w-6 h-6 text-purple-600" />}
                                            color="purple"
                                            delay={result.spamHouseStatus === 'FLAGGED' ? 800 : 700}
                                        />
                                    </div>
                                </div>

                                {/* Charts Section */}
                                <div className={`grid gap-6 ${result.checks.blacklistSummary && result.checks.blacklistSummary.flaggedCount > 0 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                                    {/* Email Authentication Chart */}
                                    <AnimatedCard className="bg-gradient-to-br from-blue-50 to-indigo-50" delay={900}>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
                                                📧 Email Authentication Status
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={prepareAuthenticationData(result.checks)}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip content={customTooltip} />
                                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                                        {prepareAuthenticationData(result.checks).map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </AnimatedCard>

                                    {/* Blacklist Analysis Chart - Only show when there are flagged results */}
                                    {result.checks.blacklistSummary && result.checks.blacklistSummary.flaggedCount > 0 && (
                                        <AnimatedCard className="bg-gradient-to-br from-red-50 to-pink-50" delay={1000}>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-red-800 mb-4 text-center">
                                                    🚨 Spam Database Alerts
                                                </h3>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <PieChart>
                                                        <Pie
                                                            data={prepareBlacklistData(result.checks.blacklistSummary)}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={120}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {prepareBlacklistData(result.checks.blacklistSummary).map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={customTooltip} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                <div className="flex justify-center space-x-4 mt-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        <span className="text-sm text-green-700">Clean ({result.checks.blacklistSummary.cleanCount})</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                        <span className="text-sm text-red-700">Flagged ({result.checks.blacklistSummary.flaggedCount})</span>
                                                    </div>
                                                </div>
                                                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                                                    <p className="text-sm text-red-800 font-medium text-center">
                                                        ⚠️ Your domain was found in {result.checks.blacklistSummary.flaggedCount} spam database{result.checks.blacklistSummary.flaggedCount !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </AnimatedCard>
                                    )}
                                </div>

                                {/* DNS Records Analysis */}
                                <AnimatedCard className="bg-gradient-to-br from-blue-50 to-indigo-50" delay={1100}>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
                                            🔍 Detailed DNS Analysis
                                        </h3>
                                        <DNSRecordsDisplay checks={result.checks} domain={result.domain} />
                                    </div>
                                </AnimatedCard>

                                {/* Recommendations */}
                                <AnimatedCard className="bg-gradient-to-br from-green-50 to-emerald-50" delay={1200}>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
                                            💡 Security Recommendations
                                        </h3>
                                        <RecommendationsDisplay recommendations={result.recommendations} domain={result.domain} />
                                    </div>
                                </AnimatedCard>

                                {/* Performance Trend Chart */}
                                <AnimatedCard className="bg-gradient-to-br from-purple-50 to-pink-50" delay={1300}>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-purple-800 mb-4 text-center">
                                            📈 Domain Health Trend
                                        </h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={preparePerformanceData()}>
                                                <defs>
                                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Tooltip content={customTooltip} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="score"
                                                    stroke="#8b5cf6"
                                                    fillOpacity={1}
                                                    fill="url(#colorScore)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </AnimatedCard>

                                {/* Action Buttons */}
                                <AnimatedCard className="bg-gradient-to-r from-vitamin-50 to-orange-50" delay={1400}>
                                    <div className="p-6">
                                        <div className="flex flex-col space-y-4">
                                            <motion.button
                                                onClick={() => setDomain('')}
                                                className="w-full px-6 py-4 text-vitamin-600 border-2 border-vitamin-600 hover:bg-vitamin-50 font-semibold rounded-xl transition-all duration-200 min-h-[48px] shadow-lg hover:shadow-xl"
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                            >
                                                <span className="mr-2">🔄</span>
                                                Check Another Domain
                                            </motion.button>
                                            <motion.button
                                                onClick={() => setShowWaitlistModal(true)}
                                                className="w-full px-6 py-4 bg-gradient-to-r from-vitamin-600 to-vitamin-700 text-white hover:from-vitamin-700 hover:to-vitamin-800 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-h-[48px]"
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                            >
                                                <span className="mr-2">📝</span>
                                                Join Pro Waitlist
                                            </motion.button>
                                        </div>

                                        <motion.div
                                            className="mt-6 text-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1.5 }}
                                        >
                                            <p className="text-sm text-gray-500 px-2">
                                                🍊 <strong>Fun Fact:</strong> Just like Vitamin C prevents scurvy, proper email authentication prevents spam!
                                            </p>
                                        </motion.div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

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
            </div>
        </LandingLayout>
    );
};

export default DomainChecker;