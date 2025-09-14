import {
    checkSpamHausFree,
    checkSURBLFree,
    checkURIBLFree,
    checkDNSRecordsFree,
    checkEmailReputationFree
} from '@/lib/domain-health/free-apis';

// Public API endpoint for domain health checking (no authentication required)
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { domain, useRealData = false } = req.body;

    if (!domain) {
        return res.status(400).json({ error: 'Domain is required' });
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
    if (!domainRegex.test(domain)) {
        return res.status(400).json({ error: 'Invalid domain format' });
    }

    try {
        let result;

        if (useRealData) {
            // Use real free APIs
            const [spamReputation, dnsRecords] = await Promise.all([
                checkEmailReputationFree(domain),
                checkDNSRecordsFree(domain)
            ]);

            // Calculate health score based on real data
            let healthScore = 100;
            if (spamReputation.isListed) healthScore -= 30;
            if (!dnsRecords.spf.exists) healthScore -= 20;
            if (dnsRecords.spf.hasMultiple) healthScore -= 10; // Penalty for multiple SPF records
            if (!dnsRecords.dkim.exists) healthScore -= 20;
            if (!dnsRecords.dmarc.exists) healthScore -= 15;
            if (dnsRecords.dmarc.policy === 'none') healthScore -= 5; // Penalty for none policy
            if (!dnsRecords.mx.exists) healthScore -= 15;

            result = {
                domain,
                healthScore: Math.max(0, healthScore),
                lastChecked: new Date().toISOString(),
                spamHouseStatus: spamReputation.isListed ? 'FLAGGED' : 'CLEAN',
                spfRecord: dnsRecords.spf.exists,
                dkimRecord: dnsRecords.dkim.exists,
                dmarcRecord: dnsRecords.dmarc.exists,
                mxRecords: dnsRecords.mx.exists,
                isHealthy: healthScore >= 70,
                checks: {
                    // Legacy format for backward compatibility
                    spamHouse: [
                        { spamHouse: 'SPAMHAUS', isListed: spamReputation.details.spamhaus.isListed, reason: spamReputation.details.spamhaus.reason },
                        { spamHouse: 'SURBL', isListed: spamReputation.details.surbl.isListed, reason: spamReputation.details.surbl.reason },
                        { spamHouse: 'URIBL', isListed: spamReputation.details.uribl.isListed, reason: spamReputation.details.uribl.reason }
                    ],
                    // Enhanced blacklist data
                    blacklistSummary: {
                        flaggedCount: spamReputation.flaggedCount,
                        cleanCount: spamReputation.cleanCount,
                        totalChecked: spamReputation.totalChecked,
                        errorCount: spamReputation.errorCount,
                        avgResponseTime: spamReputation.avgResponseTime,
                        confidence: spamReputation.summary.confidence
                    },
                    flaggedBlacklists: spamReputation.flaggedBlacklists,
                    cleanBlacklists: spamReputation.cleanBlacklists,
                    errors: spamReputation.errors,
                    // Legacy format
                    flaggedHouses: spamReputation.flaggedBlacklists.map(bl => ({
                        name: bl.name,
                        reason: bl.description,
                        contact: bl.contact
                    })),
                    spf: dnsRecords.spf,
                    dkim: dnsRecords.dkim,
                    dmarc: dnsRecords.dmarc,
                    mx: dnsRecords.mx
                },
                realData: true
            };
        } else {
            // Use mock data for demo purposes
            const hasSpf = Math.random() > 0.3;
            const hasDkim = Math.random() > 0.4;
            const hasDmarc = Math.random() > 0.5;
            const hasMx = Math.random() > 0.2;
            const isFlagged = Math.random() > 0.9;
            const hasMultipleSpf = hasSpf && Math.random() > 0.7;
            const dmarcPolicy = hasDmarc ? (Math.random() > 0.5 ? 'quarantine' : Math.random() > 0.5 ? 'reject' : 'none') : 'none';

            result = {
                domain,
                healthScore: Math.floor(Math.random() * 40) + 60, // 60-100
                lastChecked: new Date().toISOString(),
                spamHouseStatus: isFlagged ? 'FLAGGED' : 'CLEAN',
                spfRecord: hasSpf,
                dkimRecord: hasDkim,
                dmarcRecord: hasDmarc,
                mxRecords: hasMx,
                isHealthy: Math.random() > 0.3,
                checks: {
                    spamHouse: [
                        { spamHouse: 'SPAMHAUS', isListed: isFlagged && Math.random() > 0.5, reason: isFlagged ? 'Listed in DBL' : null },
                        { spamHouse: 'SURBL', isListed: isFlagged && Math.random() > 0.5, reason: isFlagged ? 'Listed in SURBL' : null },
                        { spamHouse: 'URIBL', isListed: isFlagged && Math.random() > 0.5, reason: isFlagged ? 'Listed in URIBL' : null }
                    ],
                    flaggedHouses: isFlagged ? [
                        { name: 'SPAMHAUS', reason: 'Listed in DBL', contact: 'https://www.spamhaus.org/contact/' }
                    ] : [],
                    spf: {
                        exists: hasSpf,
                        count: hasMultipleSpf ? 2 : hasSpf ? 1 : 0,
                        records: hasSpf ? ['v=spf1 include:_spf.google.com ~all'] : [],
                        hasMultiple: hasMultipleSpf,
                        warning: hasMultipleSpf ? 'Multiple SPF records detected - this is not recommended and may cause issues' : null
                    },
                    dkim: {
                        exists: hasDkim,
                        count: hasDkim ? Math.floor(Math.random() * 3) + 1 : 0,
                        records: hasDkim ? ['v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...'] : [],
                        warning: !hasDkim ? 'No DKIM records found - consider setting up DKIM authentication' : null
                    },
                    dmarc: {
                        exists: hasDmarc,
                        count: hasDmarc ? 1 : 0,
                        records: hasDmarc ? [`v=DMARC1; p=${dmarcPolicy}; rua=mailto:dmarc@${domain}`] : [],
                        policy: dmarcPolicy,
                        percentage: 100,
                        rua: hasDmarc ? `mailto:dmarc@${domain}` : null,
                        warning: !hasDmarc ? 'No DMARC record found - consider setting up DMARC policy' :
                            dmarcPolicy === 'none' ? 'DMARC policy is set to "none" - consider using "quarantine" or "reject" for better protection' : null
                    },
                    mx: {
                        exists: hasMx,
                        count: hasMx ? Math.floor(Math.random() * 3) + 1 : 0,
                        records: hasMx ? [{ priority: 10, exchange: `mail.${domain}` }] : [],
                        provider: hasMx ? (Math.random() > 0.5 ? 'google' : Math.random() > 0.5 ? 'microsoft' : 'custom') : 'Unknown',
                        providerName: hasMx ? (Math.random() > 0.5 ? 'Google Workspace (Gmail)' : Math.random() > 0.5 ? 'Microsoft 365 (Outlook)' : 'Custom/Private Server') : 'Unknown Provider',
                        confidence: hasMx ? 0.9 : 0,
                        details: hasMx ? [{ priority: 10, exchange: `mail.${domain}`, provider: 'Custom/Private Server', confidence: 0.7 }] : []
                    }
                },
                realData: false
            };
        }

        res.status(200).json({ data: result });
    } catch (error) {
        console.error('Domain check error:', error);
        res.status(500).json({ error: 'Failed to check domain health' });
    }
}
