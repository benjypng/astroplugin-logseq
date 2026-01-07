import { AstroIntegration } from 'astro'
import { format } from 'date-fns'
import wretch from 'wretch'

import { getPageBlocksTree, getRawResponse } from './api'
import { LogseqIntegrationOptions, MappedResponse } from './types'
import { recursivelyGetContent, writeToMd } from './utils'

export default function logseqIntegration(
  options: LogseqIntegrationOptions,
): AstroIntegration {
  const {
    token,
    apiUrl = 'http://127.0.0.1:12315/api',
    pollingInterval = 1000,
    directory = 'src/content/docs/blog',
    tag = 'public',
  } = options

  return {
    name: 'astro-logseq-publish',
    hooks: {
      'astro:server:setup': ({ logger }) => {
        logger.info('🚀 Logseq Poller Started (Every 3s)')

        const api = wretch()
          .url(apiUrl)
          .headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          })

        setInterval(async () => {
          try {
            const rawResponse = await getRawResponse(api, tag, logger)
            if (!rawResponse) return

            const mappedResponse: MappedResponse[] = []
            for (const item of rawResponse.flat()) {
              const pbt = await getPageBlocksTree(api, item, logger)
              if (!pbt) continue

              mappedResponse.push({
                createdAt: format(item['created-at'], 'yyyy-MM-dd'),
                updatedAt: format(item['updated-at'], 'yyyy-MM-dd'),
                pageTitle: item.title,
                content: recursivelyGetContent(pbt),
              })
            }
            await writeToMd(directory, mappedResponse, logger)
          } catch (e: any) {
            logger.info(e.message || String(e))
          }
        }, pollingInterval)
      },
      'astro:build:setup': async ({ logger }) => {
        logger.info('Building from Logseq...')
      },
    },
  }
}
