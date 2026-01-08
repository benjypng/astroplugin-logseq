import { AstroIntegrationLogger } from 'astro'
import { format, parse } from 'date-fns'
import { Wretch } from 'wretch/types'

import { getDatePropPage, getPageBlocksTree, getRawResponse } from '../api'
import { MappedResponse, TagTarget } from '../types'
import { recursivelyGetContent, writeToMd } from '.'

export const processTagGroup = async (
  api: Wretch,
  dateRef: string,
  target: TagTarget,
  logger: AstroIntegrationLogger,
) => {
  const { tag, directory } = target
  const mappedResponse: MappedResponse[] = []

  const datePropPageIdent = await getDatePropPage(api, dateRef, logger)

  const rawResponse = await getRawResponse(api, datePropPageIdent, tag, logger)
  if (!rawResponse || rawResponse.length === 0) return

  for (const page of rawResponse.flat()) {
    const pbt = await getPageBlocksTree(api, page, logger)
    if (!pbt) continue

    mappedResponse.push({
      createdAt: format(page['created-at'], 'yyyy-MM-dd'),
      updatedAt: format(page['updated-at'], 'yyyy-MM-dd'),
      pageTitle: page.title,
      content: recursivelyGetContent(pbt),
      ...(datePropPageIdent && {
        date: parse(
          String(page[datePropPageIdent!]['journal-day']),
          'yyyyMMdd',
          new Date(),
        ),
      }),
    })
    await writeToMd(directory, mappedResponse, logger)
  }
}
