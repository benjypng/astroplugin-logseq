import { AstroIntegrationLogger } from 'astro'
import { Wretch } from 'wretch/types'

import { LogseqResponse } from '../types'

export const getRawResponse = async (
  api: Wretch,
  tag: string,
  logger: AstroIntegrationLogger,
) => {
  const query = `
                [:find (pull ?p
                        [:block/name
                         :block/full-title
                         :block/created-at
                         :block/updated-at
                         :block/title
                        {:block/_parent ...}])
                 :where
                 [?p :block/name]
                 [?p :block/tags ?t]
                 [?t :block/name "${tag}"]]`

  try {
    return (
      (await api
        .post({
          method: 'logseq.DB.datascriptQuery',
          args: [query],
        })
        .json<LogseqResponse[][]>()) ?? []
    )
  } catch (e) {
    logger.info(
      `Unable to query Logseq. Check if API server is running. ${String(e)}`,
    )
  }
}
