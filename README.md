# posthog-maxmind-plugin

Enrich your collected events with GeoIP data from MaxMind

1. Install [posthog-cli](https://github.com/PostHog/posthog-cli)
2. Install this plugin `posthog plugin install https://github.com/mariusandra/posthog-maxmind-plugin`
3. [Sign up](https://dev.maxmind.com/geoip/geoip2/geolite2/) to maxmind 
4. Download the GeoLite2 City (or the paid GeoIP City) database
5. Run posthog with the env `MAXMIND_GEOIP_DATABASE=/path/to/GeoLite2-City.mmdb`
6. Optional: Set up [automatic updates](https://dev.maxmind.com/geoip/geoipupdate/#Direct_Downloads) as described here.
