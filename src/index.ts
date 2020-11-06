import Reader, { CityResponse } from 'mmdb-lib'
import { PluginEvent, PluginMeta } from 'posthog-plugins'

export function setupTeam({ config }) {
    console.log("Setting up the team MAXMIND!")
    console.log(config)
}

export function processEvent(event: PluginEvent, meta: PluginMeta) {
    if (event.ip && event.properties && meta.attachments['maxmindMmdb']) {
        const lookup = new Reader(meta.attachments['maxmindMmdb'].contents);
        const response = lookup.get(event.ip) as CityResponse
        if (response) {
            if (response.city) {
                event.properties['city_id'] = response.city.geoname_id
                event.properties['city_name'] = response.city.names?.en
            }
            if (response.country) {
                event.properties['country_name'] = response.country.names?.en
                event.properties['country_code'] = response.country.iso_code
            }
            if (response.continent) {
                event.properties['continent_name'] = response.continent.names?.en
                event.properties['continent_code'] = response.continent.code
            }
            if (response.postal) {
                event.properties['postal_code'] = response.postal.code
            }
            if (response.location) {
                event.properties['latitude'] = response.location?.latitude
                event.properties['longitude'] = response.location?.longitude
                event.properties['time_zone'] = response.location?.time_zone
            }
            if (response.subdivisions) {
                response.subdivisions.forEach((subDivision, index) => {
                    event.properties[`subdivision_${index + 1}_code`] = subDivision.iso_code
                    event.properties[`subdivision_${index + 1}_name`] = subDivision.names?.en
                })
            }
        }
    }

    return event
}
