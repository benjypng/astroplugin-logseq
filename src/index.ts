import { AstroIntegration } from 'astro'
import wretch from 'wretch'

import { LogseqIntegrationOptions } from './types'
import { processTagGroup } from './utils'

export default function logseqIntegration(
  options: LogseqIntegrationOptions,
): AstroIntegration {
  const {
    token,
    targets,
    dateRef,
    apiUrl = 'http://127.0.0.1:12315/api',
    pollingInterval = 1000,
  } = options

  return {
    name: 'astro-logseq-publish',
    hooks: {
      'astro:server:setup': ({ logger }) => {
        logger.info(`🚀 Logseq Poller Started (Every ${pollingInterval}ms)`)

        const api = wretch()
          .url(apiUrl)
          .headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          })

        setInterval(async () => {
          try {
            await Promise.all(
              targets.map((target) =>
                processTagGroup(api, dateRef, target, logger),
              ),
            )
          } catch (e: any) {
            logger.error(e.message || String(e))
          }
        }, pollingInterval)
      },
      'astro:build:setup': async ({ logger }) => {
        logger.info('Building from Logseq...')
      },
    },
  }
}
