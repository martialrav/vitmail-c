// Enhanced domain spam house checker - no API keys required!
// Implements comprehensive DNS-based blacklist checking with async queries

const dns = require('dns').promises;

// Comprehensive list of domain blacklists (RHSBLs/DNSBLs)
const BLACKLISTS = {
    'spamhaus_dbl': {
        zone: 'dbl.spamhaus.org',
        name: 'SpamHaus DBL',
        description: 'Domain Block List - blocks domains used for spam',
        contact: 'https://www.spamhaus.org/contact/',
        timeout: 5000
    },
    'spamhaus_zen': {
        zone: 'zen.spamhaus.org',
        name: 'SpamHaus ZEN',
        description: 'Comprehensive spam and malware blocklist',
        contact: 'https://www.spamhaus.org/contact/',
        timeout: 5000
    },
    'surbl': {
        zone: 'multi.surbl.org',
        name: 'SURBL',
        description: 'Multi-level URI blacklist',
        contact: 'https://www.surbl.org/contact',
        timeout: 5000
    },
    'uribl': {
        zone: 'multi.uribl.com',
        name: 'URIBL',
        description: 'URI blacklist for spam domains',
        contact: 'https://uribl.com/contact.shtml',
        timeout: 5000
    },
    'sorbs': {
        zone: 'dnsbl.sorbs.net',
        name: 'SORBS',
        description: 'Spam and Open Relay Blocking System',
        contact: 'https://www.sorbs.net/contact.shtml',
        timeout: 5000
    },
    'barracuda': {
        zone: 'b.barracudacentral.org',
        name: 'Barracuda',
        description: 'Barracuda Central reputation service',
        contact: 'https://www.barracudacentral.org/contact',
        timeout: 5000
    },
    'spamcop': {
        zone: 'bl.spamcop.net',
        name: 'SpamCop',
        description: 'SpamCop DNS blacklist',
        contact: 'https://www.spamcop.net/contact.shtml',
        timeout: 5000
    },
    'invaluement': {
        zone: 'dnsbl.invaluement.com',
        name: 'Invaluement',
        description: 'Invaluement DNS blacklist',
        contact: 'https://www.invaluement.com/contact',
        timeout: 5000
    },
    'spamrats': {
        zone: 'noptr.spamrats.com',
        name: 'SpamRats',
        description: 'SpamRats DNS blacklist',
        contact: 'https://www.spamrats.com/contact',
        timeout: 5000
    },
    'abuseat': {
        zone: 'cbl.abuseat.org',
        name: 'AbuseAt CBL',
        description: 'Composite Blocking List',
        contact: 'https://www.abuseat.org/contact',
        timeout: 5000
    }
};

// Cache for DNS queries to avoid repeated lookups
const dnsCache = new Map();
const CACHE_TTL = 300000; // 5 minutes

// Enhanced DNS query with timeout and caching
const queryBlacklist = async (domain, blacklistKey) => {
    const blacklist = BLACKLISTS[blacklistKey];
    if (!blacklist) return null;

    const query = `${domain}.${blacklist.zone}`;
    const cacheKey = `${query}_${Date.now()}`;

    // Check cache first
    const cached = dnsCache.get(query);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.result;
    }

    try {
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('DNS query timeout')), blacklist.timeout);
        });

        // Race between DNS query and timeout
        const result = await Promise.race([
            dns.resolve4(query).then(records => ({
                isListed: true,
                records: records,
                timestamp: Date.now()
            })),
            timeoutPromise
        ]);

        // Cache the result
        dnsCache.set(query, result);
        return result;

    } catch (error) {
        // Cache negative results too (but with shorter TTL)
        const negativeResult = {
            isListed: false,
            error: error.message,
            timestamp: Date.now()
        };
        dnsCache.set(query, negativeResult);
        return negativeResult;
    }
};

// Check individual blacklist
const checkBlacklist = async (domain, blacklistKey) => {
    const blacklist = BLACKLISTS[blacklistKey];
    const result = await queryBlacklist(domain, blacklistKey);

    return {
        key: blacklistKey,
        name: blacklist.name,
        description: blacklist.description,
        contact: blacklist.contact,
        isListed: result?.isListed || false,
        records: result?.records || null,
        error: result?.error || null,
        responseTime: result?.timestamp ? Date.now() - result.timestamp : null
    };
};

// Legacy functions for backward compatibility
const checkSpamHausFree = async (domain) => {
    const dblResult = await checkBlacklist(domain, 'spamhaus_dbl');
    const zenResult = await checkBlacklist(domain, 'spamhaus_zen');

    return {
        spamHouse: 'SPAMHAUS',
        isListed: dblResult.isListed || zenResult.isListed,
        reason: dblResult.isListed ? 'Listed in DBL' : zenResult.isListed ? 'Listed in ZEN' : null,
        method: 'DNS',
        details: {
            dbl: dblResult,
            zen: zenResult
        }
    };
};

const checkSURBLFree = async (domain) => {
    const result = await checkBlacklist(domain, 'surbl');
    return {
        spamHouse: 'SURBL',
        isListed: result.isListed,
        reason: result.isListed ? 'Listed in SURBL' : null,
        method: 'DNS',
        details: result
    };
};

const checkURIBLFree = async (domain) => {
    const result = await checkBlacklist(domain, 'uribl');
    return {
        spamHouse: 'URIBL',
        isListed: result.isListed,
        reason: result.isListed ? 'Listed in URIBL' : null,
        method: 'DNS',
        details: result
    };
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

// Enhanced email reputation checking with comprehensive blacklist analysis
const checkEmailReputationFree = async (domain) => {
    try {
        const startTime = Date.now();

        // Get all blacklist keys for parallel checking
        const blacklistKeys = Object.keys(BLACKLISTS);

        // Check all blacklists in parallel for maximum speed
        const blacklistResults = await Promise.all(
            blacklistKeys.map(key => checkBlacklist(domain, key))
        );

        // Separate flagged and clean results
        const flaggedBlacklists = blacklistResults.filter(result => result.isListed);
        const cleanBlacklists = blacklistResults.filter(result => !result.isListed);

        // Calculate statistics
        const totalChecked = blacklistResults.length;
        const flaggedCount = flaggedBlacklists.length;
        const cleanCount = cleanBlacklists.length;
        const errorCount = blacklistResults.filter(result => result.error).length;

        // Calculate average response time
        const responseTimes = blacklistResults
            .filter(result => result.responseTime !== null)
            .map(result => result.responseTime);
        const avgResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            : 0;

        // Legacy format for backward compatibility
        const legacyResults = {
            spamhaus: {
                isListed: flaggedBlacklists.some(r => r.key.includes('spamhaus')),
                reason: flaggedBlacklists.find(r => r.key.includes('spamhaus'))?.description || null
            },
            surbl: {
                isListed: flaggedBlacklists.some(r => r.key === 'surbl'),
                reason: flaggedBlacklists.find(r => r.key === 'surbl')?.description || null
            },
            uribl: {
                isListed: flaggedBlacklists.some(r => r.key === 'uribl'),
                reason: flaggedBlacklists.find(r => r.key === 'uribl')?.description || null
            }
        };

        return {
            isListed: flaggedCount > 0,
            flaggedCount,
            cleanCount,
            totalChecked,
            errorCount,
            avgResponseTime: Math.round(avgResponseTime),
            flaggedBlacklists: flaggedBlacklists.map(result => ({
                name: result.name,
                key: result.key,
                description: result.description,
                contact: result.contact,
                records: result.records,
                responseTime: result.responseTime
            })),
            cleanBlacklists: cleanBlacklists.map(result => ({
                name: result.name,
                key: result.key,
                responseTime: result.responseTime
            })),
            errors: blacklistResults
                .filter(result => result.error)
                .map(result => ({
                    name: result.name,
                    key: result.key,
                    error: result.error
                })),
            details: legacyResults,
            summary: {
                domain,
                checkedAt: new Date().toISOString(),
                totalTime: Date.now() - startTime,
                status: flaggedCount > 0 ? 'FLAGGED' : 'CLEAN',
                confidence: flaggedCount > 0 ? Math.min(flaggedCount / totalChecked, 1) : 1
            }
        };
    } catch (error) {
        return {
            isListed: false,
            flaggedCount: 0,
            cleanCount: 0,
            totalChecked: 0,
            errorCount: 1,
            avgResponseTime: 0,
            flaggedBlacklists: [],
            cleanBlacklists: [],
            errors: [{ name: 'System', key: 'system', error: error.message }],
            details: {},
            summary: {
                domain,
                checkedAt: new Date().toISOString(),
                totalTime: 0,
                status: 'ERROR',
                confidence: 0
            },
            error: error.message
        };
    }
};

// Helper function to get contact information for spam houses (legacy)
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
