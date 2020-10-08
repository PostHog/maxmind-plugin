# posthog-maxmind-plugin

Enrich your collected events with GeoIP data from MaxMind

1. Install [posthog-cli](https://github.com/PostHog/posthog-cli)
2. Install this plugin `posthog plugin install posthog-maxmind-plugin`
3. [Sign up](https://dev.maxmind.com/geoip/geoip2/geolite2/) to maxmind 
4. Download the GeoLite2 City (or the paid GeoIP City) database
5. Edit `posthog.json` and add the path to the GeoIP database:
```json
{
    "name": "posthog-maxmind-plugin",
    "path": "https://github.com/PostHog/posthog-maxmind-plugin",
    "config": {
        "geoip_path": "/path/to/GeoLite2-City.mmdb"
    }
}
```
6. Optional: Set up [automatic updates](https://dev.maxmind.com/geoip/geoipupdate/#Direct_Downloads) as described here.
