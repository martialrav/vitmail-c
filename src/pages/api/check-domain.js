import {
    checkSpamHausFree,
    checkSURBLFree,
    checkURIBLFree,
    checkDNSRecordsFree,
    checkEmailReputationFree
} from '@/lib/domain-health/free-apis';
import {
    checkDomainWithMXToolbox,
    checkSpamHousesEnhanced,
    generateRecommendations
} from '@/lib/domain-health/mxtoolbox-api';

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
            // Use enhanced MXToolbox-style analysis
            const [domainAnalysis, spamAnalysis] = await Promise.all([
                checkDomainWithMXToolbox(domain),
                checkSpamHousesEnhanced(domain)
            ]);

            // Generate recommendations
            const recommendations = generateRecommendations(domainAnalysis);

            // Calculate health score based on comprehensive analysis
            let healthScore = 100;
            
            // Spam house penalties
            if (spamAnalysis.isListed) healthScore -= 30;
            
            // DNS record penalties
            if (!domainAnalysis.spf.exists) healthScore -= 20;
            if (domainAnalysis.spf.hasMultiple) healthScore -= 10;
            if (domainAnalysis.spf.issues.length > 0) healthScore -= 5;
            
            if (!domainAnalysis.dkim.exists) healthScore -= 20;
            if (domainAnalysis.dkim.issues.length > 0) healthScore -= 5;
            
            if (!domainAnalysis.dmarc.exists) healthScore -= 15;
            if (domainAnalysis.dmarc.policy === 'none') healthScore -= 5;
            if (domainAnalysis.dmarc.issues.length > 0) healthScore -= 5;
            
            if (!domainAnalysis.mx.exists) healthScore -= 15;
            if (domainAnalysis.mx.issues.length > 0) healthScore -= 5;

            result = {
                domain,
                healthScore: Math.max(0, healthScore),
                lastChecked: new Date().toISOString(),
                spamHouseStatus: spamAnalysis.isListed ? 'FLAGGED' : 'CLEAN',
                spfRecord: domainAnalysis.spf.exists,
                dkimRecord: domainAnalysis.dkim.exists,
                dmarcRecord: domainAnalysis.dmarc.exists,
                mxRecords: domainAnalysis.mx.exists,
                isHealthy: healthScore >= 70,
                checks: {
                    // Enhanced spam house data
                    spamHouse: spamAnalysis.listedHouses.map(house => ({
                        spamHouse: house.name,
                        isListed: true,
                        reason: `Listed in ${house.name}`,
                        records: house.records,
                        responseTime: house.responseTime
                    })),
                    
                    // Comprehensive blacklist summary
                    blacklistSummary: {
                        flaggedCount: spamAnalysis.listedCount,
                        cleanCount: spamAnalysis.cleanCount,
                        totalChecked: spamAnalysis.totalChecked,
                        errorCount: 0,
                        avgResponseTime: spamAnalysis.responseTime,
                        confidence: spamAnalysis.confidence
                    },
                    
                    // Detailed blacklist information
                    flaggedBlacklists: spamAnalysis.listedHouses,
                    cleanBlacklists: spamAnalysis.cleanHouses,
                    errors: [],
                    
                    // Legacy format for backward compatibility
                    flaggedHouses: spamAnalysis.listedHouses.map(house => ({
                        name: house.name,
                        reason: `Listed in ${house.name}`,
                        contact: 'https://www.spamhaus.org/contact/'
                    })),
                    
                    // Enhanced DNS records with analysis
                    spf: {
                        ...domainAnalysis.spf,
                        isValid: domainAnalysis.spf.isValid,
                        issues: domainAnalysis.spf.issues,
                        recommendations: domainAnalysis.spf.recommendations
                    },
                    dkim: {
                        ...domainAnalysis.dkim,
                        isValid: domainAnalysis.dkim.isValid,
                        issues: domainAnalysis.dkim.issues,
                        recommendations: domainAnalysis.dkim.recommendations
                    },
                    dmarc: {
                        ...domainAnalysis.dmarc,
                        isValid: domainAnalysis.dmarc.isValid,
                        issues: domainAnalysis.dmarc.issues,
                        recommendations: domainAnalysis.dmarc.recommendations
                    },
                    mx: {
                        ...domainAnalysis.mx,
                        isValid: domainAnalysis.mx.isValid,
                        issues: domainAnalysis.mx.issues,
                        recommendations: domainAnalysis.mx.recommendations
                    },
                    
                    // Additional DNS records
                    dns: domainAnalysis.dns
                },
                
                // Recommendations and educational content
                recommendations: recommendations,
                
                // Analysis metadata
                analysis: {
                    responseTime: domainAnalysis.responseTime + spamAnalysis.responseTime,
                    totalChecks: spamAnalysis.totalChecked + 4, // DNS checks
                    confidence: spamAnalysis.confidence,
                    provider: domainAnalysis.mx.providerName
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
