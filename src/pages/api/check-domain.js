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
            if (!dnsRecords.dkim.exists) healthScore -= 20;
            if (!dnsRecords.dmarc.exists) healthScore -= 15;
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
                    spamHouse: [
                        { spamHouse: 'SPAMHAUS', isListed: spamReputation.details.spamhaus.isListed, reason: spamReputation.details.spamhaus.reason },
                        { spamHouse: 'SURBL', isListed: spamReputation.details.surbl.isListed, reason: spamReputation.details.surbl.reason },
                        { spamHouse: 'URIBL', isListed: spamReputation.details.uribl.isListed, reason: spamReputation.details.uribl.reason }
                    ],
                    spf: dnsRecords.spf,
                    dkim: dnsRecords.dkim,
                    dmarc: dnsRecords.dmarc,
                    mx: dnsRecords.mx
                },
                realData: true
            };
        } else {
            // Use mock data for demo purposes
            result = {
                domain,
                healthScore: Math.floor(Math.random() * 40) + 60, // 60-100
                lastChecked: new Date().toISOString(),
                spamHouseStatus: Math.random() > 0.8 ? 'FLAGGED' : 'CLEAN',
                spfRecord: Math.random() > 0.3,
                dkimRecord: Math.random() > 0.4,
                dmarcRecord: Math.random() > 0.5,
                mxRecords: Math.random() > 0.2,
                isHealthy: Math.random() > 0.3,
                checks: {
                    spamHouse: [
                        { spamHouse: 'SPAMHAUS', isListed: Math.random() > 0.9, reason: null },
                        { spamHouse: 'SURBL', isListed: Math.random() > 0.95, reason: null },
                        { spamHouse: 'URIBL', isListed: Math.random() > 0.9, reason: null }
                    ],
                    spf: {
                        exists: Math.random() > 0.3,
                        record: 'v=spf1 include:_spf.google.com ~all'
                    },
                    dkim: {
                        exists: Math.random() > 0.4,
                        record: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...'
                    },
                    dmarc: {
                        exists: Math.random() > 0.5,
                        record: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}`
                    },
                    mx: {
                        exists: Math.random() > 0.2,
                        records: [{ priority: 10, exchange: `mail.${domain}` }]
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
