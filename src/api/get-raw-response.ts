import { AstroIntegrationLogger } from 'astro'
import { Wretch } from 'wretch/types'

import { LogseqPageResponse } from '../types'

export const getRawResponse = async (
  api: Wretch,
  datePropPageIdent: string | undefined,
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
                        ${datePropPageIdent && `{${datePropPageIdent} [:block/journal-day]}`}
                       {:block/_parent [:block/uuid]}])
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
        .json<LogseqPageResponse[][]>()) ?? []
    )
  } catch (e) {
    logger.info(
      `Unable to query Logseq. Check if API server is running. ${String(e)}`,
    )
  }
}
