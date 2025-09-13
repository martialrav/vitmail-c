import { useState } from 'react';
import {
    ArrowTopRightOnSquareIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ShieldCheckIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';

const DomainHealthCard = ({ domain, isLoading, onRefresh, onRemove }) => {
    const {
        name,
        healthScore,
        lastChecked,
        spamHouseStatus,
        spfRecord,
        dkimRecord,
        dmarcRecord,
        isHealthy,
        verified
    } = domain || {};

    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await onRefresh(name);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleRemove = () => {
        const result = confirm(
            `Are you sure you want to remove this domain: ${name}?`
        );

        if (result) {
            onRemove(name);
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

    const formatLastChecked = (date) => {
        if (!date) return 'Never checked';
        return new Date(date).toLocaleString();
    };

    return (
        <Card>
            {isLoading ? (
                <Card.Body />
            ) : (
                <>
                    <Card.Body title={name}>
                        <div className="flex items-center justify-between mb-5">
                            <Link
                                href={`https://${name}`}
                                className="flex items-center space-x-2 text-vitamin-600 hover:underline"
                                target="_blank"
                            >
                                <span>Visit {name}</span>
                                <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                            </Link>
                            <div className="flex items-center space-x-2">
                                <ClockIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                    {formatLastChecked(lastChecked)}
                                </span>
                            </div>
                        </div>

                        {/* Health Score */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold">Health Score</h3>
                                <div className={`px-3 py-1 rounded-full ${getHealthScoreBg(healthScore || 0)}`}>
                                    <span className={`font-bold ${getHealthScoreColor(healthScore || 0)}`}>
                                        {healthScore || 0}/100
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${(healthScore || 0) >= 80 ? 'bg-green-500' :
                                            (healthScore || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${healthScore || 0}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Status Overview */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center space-x-2">
                                {getSpamHouseStatusIcon(spamHouseStatus)}
                                <div>
                                    <p className="text-sm text-gray-600">Spam Status</p>
                                    <p className={`font-semibold ${getSpamHouseStatusColor(spamHouseStatus)}`}>
                                        {getSpamHouseStatusText(spamHouseStatus)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <ShieldCheckIcon className={`w-5 h-5 ${isHealthy ? 'text-green-600' : 'text-red-600'}`} />
                                <div>
                                    <p className="text-sm text-gray-600">Overall Health</p>
                                    <p className={`font-semibold ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                                        {isHealthy ? 'Healthy' : 'Issues Found'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Email Authentication Status */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-800">Email Authentication</h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">SPF Record</span>
                                    <div className="flex items-center space-x-1">
                                        {spfRecord ? (
                                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <XCircleIcon className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className="text-xs text-gray-600">
                                            {spfRecord ? 'Configured' : 'Missing'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">DKIM Record</span>
                                    <div className="flex items-center space-x-1">
                                        {dkimRecord ? (
                                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <XCircleIcon className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className="text-xs text-gray-600">
                                            {dkimRecord ? 'Configured' : 'Missing'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">DMARC Record</span>
                                    <div className="flex items-center space-x-1">
                                        {dmarcRecord ? (
                                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <XCircleIcon className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className="text-xs text-gray-600">
                                            {dmarcRecord ? 'Configured' : 'Missing'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <div className="flex flex-row space-x-3">
                            <Button
                                className="text-vitamin-600 border border-vitamin-600 hover:border-vitamin-600 hover:text-vitamin-600"
                                disabled={isRefreshing}
                                onClick={handleRefresh}
                            >
                                {isRefreshing ? 'Checking...' : 'Refresh Health'}
                            </Button>
                            <Button
                                className="text-white bg-red-600 hover:bg-red-500"
                                onClick={handleRemove}
                            >
                                Remove Domain
                            </Button>
                        </div>
                    </Card.Footer>
                </>
            )}
        </Card>
    );
};

DomainHealthCard.defaultProps = {
    domain: {},
    isLoading: true,
    onRefresh: () => { },
    onRemove: () => { },
};

export default DomainHealthCard;
