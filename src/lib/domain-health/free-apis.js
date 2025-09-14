// Free spam house checking methods - no API keys required!

const dns = require('dns').promises;

// Free SpamHaus DNS lookups
const checkSpamHausFree = async (domain) => {
    try {
        // Check if domain is in SpamHaus DBL (Domain Block List)
        const dblResult = await dns.resolve4(`${domain}.dbl.spamhaus.org`).catch(() => null);

        // Check if domain is in SpamHaus ZEN (comprehensive list)
        const zenResult = await dns.resolve4(`${domain}.zen.spamhaus.org`).catch(() => null);

        return {
            spamHouse: 'SPAMHAUS',
            isListed: !!(dblResult || zenResult),
            reason: dblResult ? 'Listed in DBL' : zenResult ? 'Listed in ZEN' : null,
            method: 'DNS'
        };
    } catch (error) {
        return {
            spamHouse: 'SPAMHAUS',
            isListed: false,
            reason: null,
            method: 'DNS',
            error: error.message
        };
    }
};

// Free SURBL checking
const checkSURBLFree = async (domain) => {
    try {
        // Check SURBL multi-level URI blacklist
        const surblResult = await dns.resolve4(`${domain}.multi.surbl.org`).catch(() => null);

        return {
            spamHouse: 'SURBL',
            isListed: !!surblResult,
            reason: surblResult ? 'Listed in SURBL' : null,
            method: 'DNS'
        };
    } catch (error) {
        return {
            spamHouse: 'SURBL',
            isListed: false,
            reason: null,
            method: 'DNS',
            error: error.message
        };
    }
};

// Free URIBL checking
const checkURIBLFree = async (domain) => {
    try {
        // Check URIBL blacklist
        const uriblResult = await dns.resolve4(`${domain}.multi.uribl.com`).catch(() => null);

        return {
            spamHouse: 'URIBL',
            isListed: !!uriblResult,
            reason: uriblResult ? 'Listed in URIBL' : null,
            method: 'DNS'
        };
    } catch (error) {
        return {
            spamHouse: 'URIBL',
            isListed: false,
            reason: null,
            method: 'DNS',
            error: error.message
        };
    }
};

// Free DNS record checking
const checkDNSRecordsFree = async (domain) => {
    try {
        const [spf, dkim, dmarc, mx] = await Promise.all([
            // SPF record - check all TXT records for SPF
            dns.resolveTxt(domain).then(records =>
                records.filter(record => record[0].startsWith('v=spf1'))
            ).catch(() => []),

            // DKIM record - check for any domainkey records (not just default)
            dns.resolveTxt(domain).then(records =>
                records.filter(record => record[0].toLowerCase().includes('domainkey'))
            ).catch(() => []),

            // DMARC record
            dns.resolveTxt(`_dmarc.${domain}`).then(records =>
                records.filter(record => record[0].startsWith('v=DMARC1'))
            ).catch(() => []),

            // MX records
            dns.resolveMx(domain).catch(() => [])
        ]);

        // Parse DMARC policy
        const parseDMARCPolicy = (dmarcRecord) => {
            if (!dmarcRecord) return { policy: 'none', percentage: null, rua: null };

            const policyMatch = dmarcRecord.match(/p=([^;]+)/);
            const percentageMatch = dmarcRecord.match(/pct=(\d+)/);
            const ruaMatch = dmarcRecord.match(/rua=([^;]+)/);

            return {
                policy: policyMatch ? policyMatch[1].toLowerCase() : 'none',
                percentage: percentageMatch ? parseInt(percentageMatch[1]) : 100,
                rua: ruaMatch ? ruaMatch[1] : null
            };
        };

        const dmarcPolicy = dmarc.length > 0 ? parseDMARCPolicy(dmarc[0][0]) : { policy: 'none', percentage: null, rua: null };

        // Analyze MX records to identify email service provider
        const analyzeMXRecords = (mxRecords) => {
            if (!mxRecords || mxRecords.length === 0) {
                return { provider: 'Unknown', confidence: 0, details: [] };
            }

            const providers = {
                'google': {
                    patterns: [/aspmx\.l\.google\.com/i, /alt\d+\.aspmx\.l\.google\.com/i, /aspmx2\.googlemail\.com/i, /aspmx3\.googlemail\.com/i, /aspmx4\.googlemail\.com/i, /aspmx5\.googlemail\.com/i],
                    name: 'Google Workspace (Gmail)',
                    confidence: 0.9
                },
                'microsoft': {
                    patterns: [/\.mail\.protection\.outlook\.com/i, /\.mail\.outlook\.com/i, /\.mail\.live\.com/i, /\.hotmail\.com/i],
                    name: 'Microsoft 365 (Outlook)',
                    confidence: 0.9
                },
                'brevo': {
                    patterns: [/mail\.brevo\.com/i, /\.brevo\.com/i],
                    name: 'Brevo (formerly Sendinblue)',
                    confidence: 0.9
                },
                'mailgun': {
                    patterns: [/mailgun\.org/i, /\.mailgun\.org/i],
                    name: 'Mailgun',
                    confidence: 0.9
                },
                'zoho': {
                    patterns: [/\.zoho\.com/i, /\.zohomail\.com/i],
                    name: 'Zoho Mail',
                    confidence: 0.9
                },
                'sendgrid': {
                    patterns: [/\.sendgrid\.net/i, /\.sendgrid\.com/i],
                    name: 'SendGrid',
                    confidence: 0.9
                },
                'amazon': {
                    patterns: [/\.amazonses\.com/i, /\.amazonaws\.com/i],
                    name: 'Amazon SES',
                    confidence: 0.9
                },
                'mailchimp': {
                    patterns: [/\.mailchimp\.com/i, /\.mandrillapp\.com/i],
                    name: 'Mailchimp',
                    confidence: 0.9
                },
                'postmark': {
                    patterns: [/\.postmarkapp\.com/i],
                    name: 'Postmark',
                    confidence: 0.9
                },
                'sparkpost': {
                    patterns: [/\.sparkpostmail\.com/i, /\.sparkpost\.com/i],
                    name: 'SparkPost',
                    confidence: 0.9
                },
                'custom': {
                    patterns: [/mail\./i, /smtp\./i, /mx\./i],
                    name: 'Custom/Private Server',
                    confidence: 0.7
                }
            };

            let bestMatch = { provider: 'Unknown', confidence: 0, name: 'Unknown Provider' };
            const details = [];

            mxRecords.forEach((record, index) => {
                const exchange = record.exchange.toLowerCase();
                let matched = false;

                for (const [key, provider] of Object.entries(providers)) {
                    for (const pattern of provider.patterns) {
                        if (pattern.test(exchange)) {
                            if (provider.confidence > bestMatch.confidence) {
                                bestMatch = {
                                    provider: key,
                                    confidence: provider.confidence,
                                    name: provider.name
                                };
                            }
                            details.push({
                                priority: record.priority,
                                exchange: record.exchange,
                                provider: provider.name,
                                confidence: provider.confidence
                            });
                            matched = true;
                            break;
                        }
                    }
                    if (matched) break;
                }

                if (!matched) {
                    details.push({
                        priority: record.priority,
                        exchange: record.exchange,
                        provider: 'Unknown',
                        confidence: 0
                    });
                }
            });

            return {
                provider: bestMatch.provider,
                name: bestMatch.name,
                confidence: bestMatch.confidence,
                details: details
            };
        };

        const mxAnalysis = analyzeMXRecords(mx);

        return {
            spf: {
                exists: spf.length > 0,
                count: spf.length,
                records: spf.map(r => r[0]),
                hasMultiple: spf.length > 1,
                warning: spf.length > 1 ? 'Multiple SPF records detected - this is not recommended and may cause issues' : null
            },
            dkim: {
                exists: dkim.length > 0,
                count: dkim.length,
                records: dkim.map(r => r[0]),
                warning: dkim.length === 0 ? 'No DKIM records found - consider setting up DKIM authentication' : null
            },
            dmarc: {
                exists: dmarc.length > 0,
                count: dmarc.length,
                records: dmarc.map(r => r[0]),
                policy: dmarcPolicy.policy,
                percentage: dmarcPolicy.percentage,
                rua: dmarcPolicy.rua,
                warning: dmarc.length === 0 ? 'No DMARC record found - consider setting up DMARC policy' :
                    dmarcPolicy.policy === 'none' ? 'DMARC policy is set to "none" - consider using "quarantine" or "reject" for better protection' : null
            },
            mx: {
                exists: mx.length > 0,
                count: mx.length,
                records: mx,
                provider: mxAnalysis.provider,
                providerName: mxAnalysis.name,
                confidence: mxAnalysis.confidence,
                details: mxAnalysis.details
            }
        };
    } catch (error) {
        return {
            spf: { exists: false, count: 0, records: [], hasMultiple: false, warning: null },
            dkim: { exists: false, count: 0, records: [], warning: null },
            dmarc: { exists: false, count: 0, records: [], policy: 'none', percentage: null, rua: null, warning: null },
            mx: { exists: false, count: 0, records: [], provider: 'Unknown', providerName: 'Unknown Provider', confidence: 0, details: [] },
            error: error.message
        };
    }
};

// Free email reputation checking
const checkEmailReputationFree = async (domain) => {
    try {
        // Check multiple free blacklists
        const [spamhaus, surbl, uribl] = await Promise.all([
            checkSpamHausFree(domain),
            checkSURBLFree(domain),
            checkURIBLFree(domain)
        ]);

        const isListed = spamhaus.isListed || surbl.isListed || uribl.isListed;
        const flaggedHouses = [spamhaus, surbl, uribl]
            .filter(check => check.isListed)
            .map(check => ({
                name: check.spamHouse,
                reason: check.reason,
                contact: getSpamHouseContact(check.spamHouse)
            }));

        return {
            isListed,
            flaggedHouses,
            details: { spamhaus, surbl, uribl }
        };
    } catch (error) {
        return {
            isListed: false,
            flaggedHouses: [],
            details: {},
            error: error.message
        };
    }
};

// Helper function to get contact information for spam houses
const getSpamHouseContact = (spamHouse) => {
    const contacts = {
        'SPAMHAUS': 'https://www.spamhaus.org/contact/',
        'SURBL': 'https://www.surbl.org/contact',
        'URIBL': 'https://uribl.com/contact.shtml'
    };
    return contacts[spamHouse] || null;
};

export {
    checkSpamHausFree,
    checkSURBLFree,
    checkURIBLFree,
    checkDNSRecordsFree,
    checkEmailReputationFree
};
