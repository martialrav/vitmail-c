import { useState, useEffect } from 'react';
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    ClockIcon,
    ChartBarIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import Card from '@/components/Card/index';
import HealthChart from './HealthChart';

const DomainHealthDashboard = ({ domains = [] }) => {
    const [healthStats, setHealthStats] = useState({
        totalDomains: 0,
        healthyDomains: 0,
        flaggedDomains: 0,
        averageHealthScore: 0,
        lastChecked: null
    });

    const [recentChecks, setRecentChecks] = useState([]);

    useEffect(() => {
        // Calculate health statistics
        const stats = {
            totalDomains: domains.length,
            healthyDomains: domains.filter(d => d.isHealthy).length,
            flaggedDomains: domains.filter(d => d.spamHouseStatus === 'FLAGGED').length,
            averageHealthScore: domains.length > 0
                ? Math.round(domains.reduce((sum, d) => sum + (d.healthScore || 0), 0) / domains.length)
                : 0,
            lastChecked: domains.length > 0
                ? new Date(Math.max(...domains.map(d => new Date(d.lastChecked || 0))))
                : null
        };
        setHealthStats(stats);

        // Mock recent health checks (in production, this would come from API)
        setRecentChecks(domains.slice(0, 5).map(domain => ({
            domain: domain.name,
            healthScore: domain.healthScore || 0,
            status: domain.isHealthy ? 'healthy' : 'issues',
            lastChecked: domain.lastChecked,
            issues: [
                ...(domain.spfRecord ? [] : ['Missing SPF']),
                ...(domain.dkimRecord ? [] : ['Missing DKIM']),
                ...(domain.dmarcRecord ? [] : ['Missing DMARC']),
                ...(domain.spamHouseStatus === 'FLAGGED' ? ['Spam flagged'] : [])
            ]
        })));
    }, [domains]);

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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'healthy':
                return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
            case 'issues':
                return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
            default:
                return <XCircleIcon className="w-5 h-5 text-red-600" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Health Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <Card.Body className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Healthy Domains</p>
                                <p className="text-3xl font-bold text-green-700">{healthStats.healthyDomains}</p>
                                <p className="text-xs text-green-600">out of {healthStats.totalDomains} total</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircleIcon className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                    <Card.Body className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Flagged Domains</p>
                                <p className="text-3xl font-bold text-red-700">{healthStats.flaggedDomains}</p>
                                <p className="text-xs text-red-600">need attention</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full">
                                <XCircleIcon className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="bg-gradient-to-br from-vitamin-50 to-orange-50 border-vitamin-200">
                    <Card.Body className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-vitamin-600">Average Health</p>
                                <p className="text-3xl font-bold text-vitamin-700">{healthStats.averageHealthScore}</p>
                                <p className="text-xs text-vitamin-600">out of 100</p>
                            </div>
                            <div className="p-3 bg-vitamin-100 rounded-full">
                                <ChartBarIcon className="w-8 h-8 text-vitamin-600" />
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <Card.Body className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Domains</p>
                                <p className="text-3xl font-bold text-blue-700">{healthStats.totalDomains}</p>
                                <p className="text-xs text-blue-600">monitored</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <GlobeAltIcon className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Health Score Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-lg">
                    <Card.Body className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">🍊 Domain Health Overview</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <ClockIcon className="w-4 h-4" />
                                <span>Last updated: {healthStats.lastChecked ? new Date(healthStats.lastChecked).toLocaleTimeString() : 'Never'}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {domains.map((domain, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-white rounded-full">
                                            <GlobeAltIcon className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{domain.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {domain.isHealthy ? 'Healthy' : 'Needs attention'} •
                                                Last checked: {domain.lastChecked ? new Date(domain.lastChecked).toLocaleString() : 'Never'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className={`px-3 py-1 rounded-full ${getHealthScoreBg(domain.healthScore || 0)}`}>
                                            <span className={`font-bold ${getHealthScoreColor(domain.healthScore || 0)}`}>
                                                {domain.healthScore || 0}/100
                                            </span>
                                        </div>
                                        {getStatusIcon(domain.isHealthy ? 'healthy' : 'issues')}
                                    </div>
                                </div>
                            ))}

                            {domains.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🍊</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No domains yet</h3>
                                    <p className="text-gray-600 mb-4">Start monitoring your domain&apos;s health by adding your first domain!</p>
                                    <button className="px-6 py-3 bg-vitamin-600 text-white rounded-lg hover:bg-vitamin-700 transition-colors">
                                        Add Your First Domain
                                    </button>
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>

                {/* Health Trend Chart */}
                <Card className="bg-white shadow-lg">
                    <Card.Body className="p-6">
                        <HealthChart domains={domains} />
                    </Card.Body>
                </Card>
            </div>

            {/* Recent Health Checks */}
            {recentChecks.length > 0 && (
                <Card className="bg-white shadow-lg">
                    <Card.Body className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">🔍 Recent Health Checks</h3>
                        <div className="space-y-3">
                            {recentChecks.map((check, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        {getStatusIcon(check.status)}
                                        <div>
                                            <p className="font-semibold text-gray-900">{check.domain}</p>
                                            <p className="text-sm text-gray-500">
                                                {check.issues.length > 0 ? `Issues: ${check.issues.join(', ')}` : 'All systems healthy'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className={`px-3 py-1 rounded-full ${getHealthScoreBg(check.healthScore)}`}>
                                            <span className={`font-bold text-sm ${getHealthScoreColor(check.healthScore)}`}>
                                                {check.healthScore}/100
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {check.lastChecked ? new Date(check.lastChecked).toLocaleDateString() : 'Never'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default DomainHealthDashboard;
