# PostHog MaxMind Plugin

Enrich your PostHog events with GeoIP data from MaxMind.

## Installation

1. Visit the _Plugins_ page in PostHog ('Settings' -> 'Project Plugins')
1. Click '+ Install new plugin' and use this URL to install: `http://www.npmjs.com/package/posthog-maxmind-plugin` 
1. [Sign up to MaxMind](https://dev.maxmind.com/geoip/geoip2/geolite2/)
1. Download the GeoLite2 City (or the paid GeoIP City) database
1. Upload the `.mmdb` file in the archive via the plugin interface
1. Enable the plugin and watch your events come in with the enriched data!
