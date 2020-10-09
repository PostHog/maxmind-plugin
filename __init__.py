from posthog.plugins import PluginBaseClass, PosthogEvent
import geoip2.database


class MaxmindPlugin(PluginBaseClass):
    def __init__(self, config):
        super().__init__(config)

        geoip_path = self.config.get("geoip_path", None)

        if geoip_path:
            self.reader = geoip2.database.Reader(geoip_path)
        else:
            print("🔻 Running posthog-maxmind-plugin without the 'geoip_path' config variable")
            print("🔺 No GeoIP data will be ingested!")
            self.reader = None

    def process_event(self, event: PosthogEvent):
        if self.reader and event.ip:
            try:
                response = self.reader.city(event.ip)
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
