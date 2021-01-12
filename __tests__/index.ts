import { createPageview, getMeta, resetMeta, clone } from '@posthog/plugin-scaffold/test/utils.js'
import { setupPlugin, processEvent } from '../src'

test('setupPlugin and processEvent with no DB', async () => {
    const meta = resetMeta({
        config: {
            localhostIp: '127.0.0.1',
            maxmindMmdb: null,
        },
    })

    await setupPlugin(meta)
    expect(meta.ipLookup).not.toBeDefined()

    const pageviewEvent = createPageview()
    const processedPageviewEvent = await processEvent(clone(pageviewEvent), getMeta())
    expect(processedPageviewEvent).toEqual(pageviewEvent)
})
