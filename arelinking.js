import pagelinks from 'pagelinks';
import url from 'url';

const uniqBy = (arr, fn) => [...new Map(arr.reverse().map((x) => [typeof fn === 'function' ? fn(x) : x[fn], x])).values()]

const linkMatch = (domain, links) => links.filter(link => link.href.match(new RegExp(`/\b?${domain}.com\b?`, 'g'))).length > 0;

const relativeLinks = (links, domain) => uniqBy(links.filter(link => url.parse(link.href).hostname === domain), 'href');

const getLinks = (domainMatch, uri, depth) => {
    let linkSet;
    const domain = url.parse(uri).hostname;
    pagelinks({ uri }, function(error, links) {
        if (error) {
          throw error;
        }
        const verified = linkMatch(domainMatch, links);
        if (verified) {
            console.log(`${uri} has a porch link`);
            return;
        } else {
            const relative = relativeLinks(links, domain);
            linkSet = relative.map(r => r.href).filter(link => link !== `${uri}/`).slice(0, depth);
            if (linkSet.length === 0) {
                console.log(`${uri} has no relative links`);
            }
            for (let relativeLink of linkSet) {
                pagelinks({ uri: relativeLink }, function(error, links) {
                    if (error) {
                        throw error;
                    }
                    const verified = linkMatch(domainMatch, links);
                    if (verified) {
                        console.log(`${relativeLink} has a porch link`);
                        return;
                    }  
                })
            }
        }
    });
}
const domainMatch = process.argv[2];
const url = process.argv[3];
const depth = process.argv[4] || 5;
if (!domainMatch || !url) {
    console.log('include domain and url, ie mydomain https://theirdomain.com');
}
getLinks(domainMatch, url, depth);