import { createPageview, getMeta, resetMeta, clone } from '@posthog/plugin-scaffold/test/utils.js'
import { setupPlugin, processEvent } from '../src'
import * as fs from 'fs'
import * as path from 'path'
import { PluginAttachment, PluginMeta } from 'posthog-plugins'
import Reader, { Response } from 'mmdb-lib'

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

function resetMetaWithDatabase(file: string): Meta {
    return resetMeta({
        config: {
            localhostIp: '127.0.0.1',
        },
        attachments: {
            maxmindMmdb: file
                ? {
                      content_type: '*/*',
                      file_name: file,
                      contents: fs.readFileSync(path.join(__dirname, './assets/', file)),
                  }
                : null,
        },
    })
}

test('setupPlugin and processEvent with no DB', async () => {
    const meta = resetMetaWithDatabase(null)

    await setupPlugin(meta)
    expect(meta.global.ipLookup).not.toBeDefined()

    const pageviewEvent = createPageview()
    const processedPageviewEvent = await processEvent(clone(pageviewEvent), getMeta())
    expect(processedPageviewEvent).toEqual(pageviewEvent)
})

test('GeoLite2-City', async () => {
    const meta = resetMetaWithDatabase('GeoLite2-City-Test.mmdb')

    await setupPlugin(meta)
    expect(meta.global.ipLookup).toBeDefined()

    const event = await processEvent({ ...createPageview(), ip: '89.160.20.129' }, meta)
    expect(event.properties).toEqual(expect.objectContaining({
        $city_name: 'Linköping',
        $country_name: 'Sweden',
        $country_code: 'SE',
        $continent_name: 'Europe',
        $continent_code: 'EU',
        $latitude: 58.4167,
        $longitude: 15.6167,
        $time_zone: 'Europe/Stockholm',
        $subdivision_1_code: 'E',
        $subdivision_1_name: 'Östergötland County',
    }))
})

test('GeoIP2-City', async () => {
    const meta = resetMetaWithDatabase('GeoIP2-City-Test.mmdb')

    await setupPlugin(meta)
    expect(meta.global.ipLookup).toBeDefined()

    const event = await processEvent({ ...createPageview(), ip: '89.160.20.129' }, meta)
    expect(event.properties).toEqual(expect.objectContaining({
        $city_name: 'Linköping',
        $country_name: 'Sweden',
        $country_code: 'SE',
        $continent_name: 'Europe',
        $continent_code: 'EU',
        $latitude: 58.4167,
        $longitude: 15.6167,
        $time_zone: 'Europe/Stockholm',
        $subdivision_1_code: 'E',
        $subdivision_1_name: 'Östergötland County',
    }))
})

test('GeoLite2-Country', async () => {
    const meta = resetMetaWithDatabase('GeoLite2-Country-Test.mmdb')

    await setupPlugin(meta)
    expect(meta.global.ipLookup).toBeDefined()

    const event = await processEvent({ ...createPageview(), ip: '89.160.20.129' }, meta)
    expect(event.properties).toEqual(expect.objectContaining({
        $country_name: 'Sweden',
        $country_code: 'SE',
        $continent_name: 'Europe',
        $continent_code: 'EU',
    }))
})

test('GeoIP2-Country', async () => {
    const meta = resetMetaWithDatabase('GeoIP2-Country-Test.mmdb')

    await setupPlugin(meta)
    expect(meta.global.ipLookup).toBeDefined()

    const event = await processEvent({ ...createPageview(), ip: '89.160.20.129' }, meta)
    expect(event.properties).toEqual(expect.objectContaining({
        $country_name: 'Sweden',
        $country_code: 'SE',
        $continent_name: 'Europe',
        $continent_code: 'EU',
    }))
})
