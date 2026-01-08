import { AstroIntegrationLogger } from 'astro'
import { Wretch } from 'wretch/types'

import { ContentBlock, LogseqPageResponse } from '../types'

export const getPageBlocksTree = async (
  api: Wretch,
  page: LogseqPageResponse,
  logger: AstroIntegrationLogger,
) => {
  try {
    return await api
      .post({
        method: 'logseq.Editor.getPageBlocksTree',
        args: [page.title.toLowerCase()],
      })
      .json<ContentBlock[]>()
  } catch (e) {
    logger.info(`Unable to get page blocks tree: ${String(e)}`)
  }
}
