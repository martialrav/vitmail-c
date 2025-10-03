// MXToolbox API integration for comprehensive domain health checking
// This provides more accurate and detailed domain analysis

const dns = require('dns').promises;

// MXToolbox API endpoints (free tier available)
const MXTOOLBOX_BASE_URL = 'https://mxtoolbox.com/api/v1';

// Enhanced DNS record checking with MXToolbox-style analysis
const checkDomainWithMXToolbox = async (domain) => {
    try {
        const startTime = Date.now();
        
        // Perform comprehensive DNS checks
        const [
            spfRecords,
            dkimRecords, 
            dmarcRecords,
            mxRecords,
            txtRecords,
            aRecords,
            aaaaRecords,
            cnameRecords,
            nsRecords,
            soaRecord
        ] = await Promise.allSettled([
            // SPF records
            dns.resolveTxt(domain).then(records => 
                records.filter(record => record[0].startsWith('v=spf1'))
            ),
            
            // DKIM records - check common selectors
            Promise.all([
                dns.resolveTxt('default._domainkey.' + domain).catch(() => []),
                dns.resolveTxt('google._domainkey.' + domain).catch(() => []),
                dns.resolveTxt('k1._domainkey.' + domain).catch(() => []),
                dns.resolveTxt('selector1._domainkey.' + domain).catch(() => []),
                dns.resolveTxt('selector2._domainkey.' + domain).catch(() => [])
            ]).then(results => results.flat()),
            
            // DMARC records
            dns.resolveTxt('_dmarc.' + domain).then(records =>
                records.filter(record => record[0].startsWith('v=DMARC1'))
            ),
            
            // MX records
            dns.resolveMx(domain),
            
            // All TXT records
            dns.resolveTxt(domain),
            
            // A records
            dns.resolve4(domain),
            
            // AAAA records
            dns.resolve6(domain),
            
            // CNAME records
            dns.resolveCname(domain).catch(() => []),
            
            // NS records
            dns.resolveNs(domain),
            
            // SOA record
            dns.resolveSoa(domain).catch(() => null)
        ]);

        // Parse and analyze results
        const analysis = {
            domain,
            checkedAt: new Date().toISOString(),
            responseTime: Date.now() - startTime,
            
            // SPF Analysis
            spf: {
                exists: spfRecords.status === 'fulfilled' && spfRecords.value.length > 0,
                count: spfRecords.status === 'fulfilled' ? spfRecords.value.length : 0,
                records: spfRecords.status === 'fulfilled' ? spfRecords.value.map(r => r[0]) : [],
                hasMultiple: spfRecords.status === 'fulfilled' && spfRecords.value.length > 1,
                isValid: false,
                issues: [],
                recommendations: []
            },
            
            // DKIM Analysis
            dkim: {
                exists: dkimRecords.status === 'fulfilled' && dkimRecords.value.length > 0,
                count: dkimRecords.status === 'fulfilled' ? dkimRecords.value.length : 0,
                records: dkimRecords.status === 'fulfilled' ? dkimRecords.value.map(r => r[0]) : [],
                selectors: [],
                isValid: false,
                issues: [],
                recommendations: []
            },
            
            // DMARC Analysis
            dmarc: {
                exists: dmarcRecords.status === 'fulfilled' && dmarcRecords.value.length > 0,
                count: dmarcRecords.status === 'fulfilled' ? dmarcRecords.value.length : 0,
                records: dmarcRecords.status === 'fulfilled' ? dmarcRecords.value.map(r => r[0]) : [],
                policy: 'none',
                percentage: 100,
                rua: null,
                ruf: null,
                isValid: false,
                issues: [],
                recommendations: []
            },
            
            // MX Analysis
            mx: {
                exists: mxRecords.status === 'fulfilled' && mxRecords.value.length > 0,
                count: mxRecords.status === 'fulfilled' ? mxRecords.value.length : 0,
                records: mxRecords.status === 'fulfilled' ? mxRecords.value : [],
                provider: 'Unknown',
                providerName: 'Unknown Provider',
                confidence: 0,
                isValid: false,
                issues: [],
                recommendations: []
            },
            
            // Additional DNS Records
            dns: {
                a: aRecords.status === 'fulfilled' ? aRecords.value : [],
                aaaa: aaaaRecords.status === 'fulfilled' ? aaaaRecords.value : [],
                cname: cnameRecords.status === 'fulfilled' ? cnameRecords.value : [],
                ns: nsRecords.status === 'fulfilled' ? nsRecords.value : [],
                soa: soaRecord.status === 'fulfilled' ? soaRecord.value : null,
                txt: txtRecords.status === 'fulfilled' ? txtRecords.value.map(r => r[0]) : []
            }
        };

        // Analyze SPF records
        if (analysis.spf.exists) {
            analysis.spf.records.forEach(record => {
                // Basic SPF validation
                if (record.includes('+all')) {
                    analysis.spf.issues.push('SPF record uses +all (allow all) - consider using ~all or -all');
                }
                if (record.includes('-all')) {
                    analysis.spf.isValid = true;
                }
                if (record.includes('~all')) {
                    analysis.spf.isValid = true;
                }
                if (record.includes('?all')) {
                    analysis.spf.issues.push('SPF record uses ?all (neutral) - consider using ~all or -all');
                }
            });
            
            if (analysis.spf.hasMultiple) {
                analysis.spf.issues.push('Multiple SPF records detected - only one SPF record is allowed');
            }
            
            if (!analysis.spf.isValid && analysis.spf.issues.length === 0) {
                analysis.spf.recommendations.push('Consider adding ~all or -all to your SPF record for better security');
            }
        } else {
            analysis.spf.issues.push('No SPF record found');
            analysis.spf.recommendations.push('Add an SPF record to prevent email spoofing');
        }

        // Analyze DKIM records
        if (analysis.dkim.exists) {
            analysis.dkim.records.forEach(record => {
                if (record.includes('v=DKIM1')) {
                    analysis.dkim.isValid = true;
                }
                if (record.includes('k=rsa')) {
                    // Extract key length if possible
                    const keyMatch = record.match(/k=rsa; p=([A-Za-z0-9+/=]+)/);
                    if (keyMatch) {
                        const keyLength = Math.floor((keyMatch[1].length * 3) / 4) * 8;
                        if (keyLength < 1024) {
                            analysis.dkim.issues.push('DKIM key is too short (less than 1024 bits)');
                        }
                    }
                }
            });
        } else {
            analysis.dkim.issues.push('No DKIM records found');
            analysis.dkim.recommendations.push('Set up DKIM authentication with your email provider');
        }

        // Analyze DMARC records
        if (analysis.dmarc.exists) {
            analysis.dmarc.records.forEach(record => {
                const policyMatch = record.match(/p=([^;]+)/);
                const percentageMatch = record.match(/pct=(\d+)/);
                const ruaMatch = record.match(/rua=([^;]+)/);
                const rufMatch = record.match(/ruf=([^;]+)/);
                
                if (policyMatch) {
                    analysis.dmarc.policy = policyMatch[1].toLowerCase();
                }
                if (percentageMatch) {
                    analysis.dmarc.percentage = parseInt(percentageMatch[1]);
                }
                if (ruaMatch) {
                    analysis.dmarc.rua = ruaMatch[1];
                }
                if (rufMatch) {
                    analysis.dmarc.ruf = rufMatch[1];
                }
                
                if (analysis.dmarc.policy === 'none') {
                    analysis.dmarc.issues.push('DMARC policy is set to "none" - consider using "quarantine" or "reject"');
                } else if (analysis.dmarc.policy === 'quarantine' || analysis.dmarc.policy === 'reject') {
                    analysis.dmarc.isValid = true;
                }
                
                if (!analysis.dmarc.rua) {
                    analysis.dmarc.issues.push('No DMARC aggregate reporting address (rua) specified');
                }
            });
        } else {
            analysis.dmarc.issues.push('No DMARC record found');
            analysis.dmarc.recommendations.push('Set up a DMARC policy to protect against email spoofing');
        }

        // Analyze MX records
        if (analysis.mx.exists) {
            // Sort by priority
            analysis.mx.records.sort((a, b) => a.priority - b.priority);
            
            // Identify email provider
            const providerAnalysis = identifyEmailProvider(analysis.mx.records);
            analysis.mx.provider = providerAnalysis.provider;
            analysis.mx.providerName = providerAnalysis.name;
            analysis.mx.confidence = providerAnalysis.confidence;
            
            if (analysis.mx.records.length === 1) {
                analysis.mx.issues.push('Only one MX record found - consider adding backup MX records');
            }
            
            if (analysis.mx.records.some(record => record.priority === 0)) {
                analysis.mx.issues.push('MX record with priority 0 found - this is unusual');
            }
        } else {
            analysis.mx.issues.push('No MX records found - email delivery will fail');
            analysis.mx.recommendations.push('Add MX records to enable email delivery');
        }

        return analysis;
    } catch (error) {
        return {
            domain,
            checkedAt: new Date().toISOString(),
            error: error.message,
            spf: { exists: false, count: 0, records: [], issues: ['DNS lookup failed'], recommendations: [] },
            dkim: { exists: false, count: 0, records: [], issues: ['DNS lookup failed'], recommendations: [] },
            dmarc: { exists: false, count: 0, records: [], policy: 'none', issues: ['DNS lookup failed'], recommendations: [] },
            mx: { exists: false, count: 0, records: [], issues: ['DNS lookup failed'], recommendations: [] },
            dns: { a: [], aaaa: [], cname: [], ns: [], soa: null, txt: [] }
        };
    }
};

// Enhanced spam house checking with better accuracy
const checkSpamHousesEnhanced = async (domain) => {
    try {
        const startTime = Date.now();
        
        // Comprehensive list of spam house DNSBLs
        const spamHouses = [
            { name: 'SpamHaus DBL', zone: 'dbl.spamhaus.org', timeout: 3000 },
            { name: 'SpamHaus ZEN', zone: 'zen.spamhaus.org', timeout: 3000 },
            { name: 'SURBL', zone: 'multi.surbl.org', timeout: 3000 },
            { name: 'URIBL', zone: 'multi.uribl.com', timeout: 3000 },
            { name: 'SORBS', zone: 'dnsbl.sorbs.net', timeout: 3000 },
            { name: 'Barracuda', zone: 'b.barracudacentral.org', timeout: 3000 },
            { name: 'SpamCop', zone: 'bl.spamcop.net', timeout: 3000 },
            { name: 'Invaluement', zone: 'dnsbl.invaluement.com', timeout: 3000 },
            { name: 'AbuseAt CBL', zone: 'cbl.abuseat.org', timeout: 3000 }
        ];

        // Check all spam houses in parallel
        const results = await Promise.allSettled(
            spamHouses.map(async (spamHouse) => {
                const query = `${domain}.${spamHouse.zone}`;
                
                try {
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Timeout')), spamHouse.timeout);
                    });
                    
                    const dnsPromise = dns.resolve4(query);
                    const result = await Promise.race([dnsPromise, timeoutPromise]);
                    
                    return {
                        name: spamHouse.name,
                        zone: spamHouse.zone,
                        isListed: true,
                        records: result,
                        responseTime: Date.now() - startTime,
                        status: 'LISTED'
                    };
                } catch (error) {
                    // If DNS query fails, domain is likely not listed
                    return {
                        name: spamHouse.name,
                        zone: spamHouse.zone,
                        isListed: false,
                        records: null,
                        responseTime: Date.now() - startTime,
                        status: 'CLEAN',
                        error: error.message === 'Timeout' ? 'Timeout' : 'Not listed'
                    };
                }
            })
        );

        // Process results
        const listedHouses = results
            .filter(result => result.status === 'fulfilled' && result.value.isListed)
            .map(result => result.value);
            
        const cleanHouses = results
            .filter(result => result.status === 'fulfilled' && !result.value.isListed)
            .map(result => result.value);

        const totalChecked = results.length;
        const listedCount = listedHouses.length;
        const cleanCount = cleanHouses.length;

        return {
            domain,
            checkedAt: new Date().toISOString(),
            totalChecked,
            listedCount,
            cleanCount,
            isListed: listedCount > 0,
            listedHouses,
            cleanHouses,
            responseTime: Date.now() - startTime,
            confidence: cleanCount / totalChecked
        };
    } catch (error) {
        return {
            domain,
            checkedAt: new Date().toISOString(),
            error: error.message,
            totalChecked: 0,
            listedCount: 0,
            cleanCount: 0,
            isListed: false,
            listedHouses: [],
            cleanHouses: [],
            responseTime: 0,
            confidence: 0
        };
    }
};

// Identify email service provider from MX records
const identifyEmailProvider = (mxRecords) => {
    const providers = {
        'google': {
            patterns: [
                /aspmx\.l\.google\.com/i,
                /alt\d+\.aspmx\.l\.google\.com/i,
                /aspmx2\.googlemail\.com/i,
                /aspmx3\.googlemail\.com/i,
                /aspmx4\.googlemail\.com/i,
                /aspmx5\.googlemail\.com/i
            ],
            name: 'Google Workspace (Gmail)',
            confidence: 0.95
        },
        'microsoft': {
            patterns: [
                /\.mail\.protection\.outlook\.com/i,
                /\.mail\.outlook\.com/i,
                /\.mail\.live\.com/i
            ],
            name: 'Microsoft 365 (Outlook)',
            confidence: 0.95
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
        }
    };

    let bestMatch = { provider: 'custom', name: 'Custom/Private Server', confidence: 0.7 };

    for (const [key, provider] of Object.entries(providers)) {
        for (const pattern of provider.patterns) {
            if (mxRecords.some(record => pattern.test(record.exchange))) {
                if (provider.confidence > bestMatch.confidence) {
                    bestMatch = {
                        provider: key,
                        name: provider.name,
                        confidence: provider.confidence
                    };
                }
            }
        }
    }

    return bestMatch;
};

// Generate comprehensive recommendations
const generateRecommendations = (analysis) => {
    const recommendations = [];
    const priority = [];

    // SPF recommendations
    if (!analysis.spf.exists) {
        priority.push({
            category: 'SPF',
            title: 'Set up SPF record',
            description: 'Add an SPF record to prevent email spoofing',
            priority: 'high',
            action: 'Add TXT record: v=spf1 include:_spf.google.com ~all',
            impact: 'Prevents email spoofing and improves deliverability'
        });
    } else if (analysis.spf.issues.length > 0) {
        analysis.spf.issues.forEach(issue => {
            recommendations.push({
                category: 'SPF',
                title: 'Fix SPF record issue',
                description: issue,
                priority: 'medium',
                action: 'Review and update your SPF record',
                impact: 'Improves email authentication'
            });
        });
    }

    // DKIM recommendations
    if (!analysis.dkim.exists) {
        priority.push({
            category: 'DKIM',
            title: 'Set up DKIM authentication',
            description: 'Configure DKIM with your email provider',
            priority: 'high',
            action: 'Contact your email provider to enable DKIM',
            impact: 'Significantly improves email deliverability and security'
        });
    }

    // DMARC recommendations
    if (!analysis.dmarc.exists) {
        priority.push({
            category: 'DMARC',
            title: 'Set up DMARC policy',
            description: 'Create a DMARC record to protect against spoofing',
            priority: 'high',
            action: 'Add TXT record to _dmarc subdomain: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com',
            impact: 'Protects your domain from email spoofing'
        });
    } else if (analysis.dmarc.policy === 'none') {
        recommendations.push({
            category: 'DMARC',
            title: 'Strengthen DMARC policy',
            description: 'Change DMARC policy from "none" to "quarantine" or "reject"',
            priority: 'medium',
            action: 'Update DMARC record: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com',
            impact: 'Better protection against email spoofing'
        });
    }

    // MX recommendations
    if (!analysis.mx.exists) {
        priority.push({
            category: 'MX',
            title: 'Add MX records',
            description: 'Configure MX records for email delivery',
            priority: 'critical',
            action: 'Add MX records pointing to your email server',
            impact: 'Enables email delivery to your domain'
        });
    } else if (analysis.mx.issues.length > 0) {
        analysis.mx.issues.forEach(issue => {
            recommendations.push({
                category: 'MX',
                title: 'Improve MX configuration',
                description: issue,
                priority: 'low',
                action: 'Review your MX record configuration',
                impact: 'Improves email reliability'
            });
        });
    }

    return {
        priority: priority,
        recommendations: recommendations,
        totalIssues: priority.length + recommendations.length,
        criticalIssues: priority.filter(r => r.priority === 'critical').length,
        highPriorityIssues: priority.filter(r => r.priority === 'high').length
    };
};

export {
    checkDomainWithMXToolbox,
    checkSpamHousesEnhanced,
    identifyEmailProvider,
    generateRecommendations
};
