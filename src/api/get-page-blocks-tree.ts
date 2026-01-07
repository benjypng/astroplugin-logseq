import { AstroIntegrationLogger } from 'astro'
import { Wretch } from 'wretch/types'

import { ContentBlock, LogseqResponse } from '../types'

export const getPageBlocksTree = async (
  api: Wretch,
  item: LogseqResponse,
  logger: AstroIntegrationLogger,
) => {
  try {
    return await api
      .post({
        method: 'logseq.Editor.getPageBlocksTree',
        args: [item.title.toLowerCase()],
      })
      .json<ContentBlock[]>()
  } catch (e) {
    logger.info(`Unable to get page blocks tree: ${String(e)}`)
  }
}
