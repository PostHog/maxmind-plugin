from posthog.plugins import PluginBaseClass, PosthogEvent
import os
import geoip2.database

geoip_path = os.environ.get("MAXMIND_GEOIP_DATABASE", None)

if geoip_path:
    reader = geoip2.database.Reader(geoip_path)
else:
    print("🔻 Running posthog-maxmind-plugin without MAXMIND_GEOIP_DATABASE")
    print("🔺 No GeoIP data will be ingested!")
    reader = None


class MaxmindPlugin(PluginBaseClass):
    def process_event(self, event: PosthogEvent):
        if reader and event.ip:
            try:
                response = reader.city(event.ip)
                event.properties['$country_iso'] = response.country.iso_code
                event.properties['$country_name'] = response.country.name
                event.properties['$region_iso'] = response.subdivisions.most_specific.iso_code
                event.properties['$region_name'] = response.subdivisions.most_specific.name
                event.properties['$city_name'] = response.city.name
                event.properties['$latitude'] = response.location.latitude
                event.properties['$longitude'] = response.location.longitude
            except:
                # ip not in the database
                pass

        return event
