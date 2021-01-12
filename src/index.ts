import Reader, { CityResponse, Response } from 'mmdb-lib'
import { PluginMeta, PluginEvent, PluginAttachment } from '@posthog/plugin-scaffold'

interface Meta extends PluginMeta {
    config: {
        localhostIP: string
    }
    attachments: {
        maxmindMmdb?: PluginAttachment
    }
    global: {
        ipLookup?: Reader<Response>
    }
}

export async function setupPlugin({ attachments, global }: Meta) {
    if (attachments.maxmindMmdb) {
        global.ipLookup = new Reader(attachments.maxmindMmdb.contents)
    }
}

export function processEvent(event: PluginEvent, { global, config }: Meta) {
    if (event.ip === '127.0.0.1' && config.localhostIP) {
        event.ip = config.localhostIP
    }
    if (event.ip && event.properties && global.ipLookup) {
        const response = global.ipLookup.get(event.ip) as CityResponse
        if (response) {
            if (response.city) {
                event.properties['$city_name'] = response.city.names?.en
            }
            if (response.country) {
                event.properties['$country_name'] = response.country.names?.en
                event.properties['$country_code'] = response.country.iso_code
            }
            if (response.continent) {
                event.properties['$continent_name'] = response.continent.names?.en
                event.properties['$continent_code'] = response.continent.code
            }
            if (response.postal) {
                event.properties['$postal_code'] = response.postal.code
            }
            if (response.location) {
                event.properties['$latitude'] = response.location?.latitude
                event.properties['$longitude'] = response.location?.longitude
                event.properties['$time_zone'] = response.location?.time_zone
            }
            if (response.subdivisions) {
                response.subdivisions.forEach((subDivision, index) => {
                    event.properties[`$subdivision_${index + 1}_code`] = subDivision.iso_code
                    event.properties[`$subdivision_${index + 1}_name`] = subDivision.names?.en
                })
            }
        }
    }

    return event
}
