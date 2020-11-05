import Reader from 'mmdb-lib'
import { PluginEvent, PluginMeta } from 'posthog-plugins'

export function setupTeam({ config }) {
    console.log("Setting up the team MAXMIND!")
    console.log(config)
}

export function processEvent(event: PluginEvent, meta: PluginMeta) {
    console.log('EE')

    if (event.ip && event.properties) {
        console.log('WITH IP!', event.ip)
        const lookup = new Reader(null);
        const city = lookup.get(event.ip)
        event.properties['city'] = city
    }

    return event
}
