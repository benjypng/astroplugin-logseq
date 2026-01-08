import { AstroIntegrationLogger } from 'astro'
import { LogseqPageResponse } from 'src/types'
import { Wretch } from 'wretch/types'

export const getDatePropPage = async (
  api: Wretch,
  dateRef: string,
  logger: AstroIntegrationLogger,
) => {
  try {
    const datePropPage = await api
      .post({
        method: 'logseq.Editor.getPage',
        args: [dateRef],
      })
      .json<LogseqPageResponse>()
    const datePropPageIdent = datePropPage.ident
    return datePropPageIdent
  } catch (e) {
    logger.info(`Unable to get page for date reference: ${String(e)}`)
  }
}
