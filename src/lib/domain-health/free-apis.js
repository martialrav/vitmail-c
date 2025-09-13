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
            // SPF record
            dns.resolveTxt(domain).then(records =>
                records.filter(record => record[0].startsWith('v=spf1'))
            ).catch(() => []),

            // DKIM record
            dns.resolveTxt(`default._domainkey.${domain}`).then(records =>
                records.filter(record => record[0].startsWith('v=DKIM1'))
            ).catch(() => []),

            // DMARC record
            dns.resolveTxt(`_dmarc.${domain}`).then(records =>
                records.filter(record => record[0].startsWith('v=DMARC1'))
            ).catch(() => []),

            // MX records
            dns.resolveMx(domain).catch(() => [])
        ]);

        return {
            spf: {
                exists: spf.length > 0,
                record: spf[0]?.[0] || null
            },
            dkim: {
                exists: dkim.length > 0,
                record: dkim[0]?.[0] || null
            },
            dmarc: {
                exists: dmarc.length > 0,
                record: dmarc[0]?.[0] || null
            },
            mx: {
                exists: mx.length > 0,
                records: mx
            }
        };
    } catch (error) {
        return {
            spf: { exists: false, record: null },
            dkim: { exists: false, record: null },
            dmarc: { exists: false, record: null },
            mx: { exists: false, records: [] },
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
        const reasons = [spamhaus, surbl, uribl]
            .filter(check => check.isListed)
            .map(check => `${check.spamHouse}: ${check.reason}`);

        return {
            isListed,
            reasons,
            details: { spamhaus, surbl, uribl }
        };
    } catch (error) {
        return {
            isListed: false,
            reasons: [],
            details: {},
            error: error.message
        };
    }
};

export {
    checkSpamHausFree,
    checkSURBLFree,
    checkURIBLFree,
    checkDNSRecordsFree,
    checkEmailReputationFree
};
