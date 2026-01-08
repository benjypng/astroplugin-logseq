import { format } from 'date-fns'
import { Wretch } from 'wretch/types'

import { getPageBlocksTree, getRawResponse } from '../api'
import { MappedResponse, TagTarget } from '../types'
import { recursivelyGetContent, writeToMd } from '.'

export const processTagGroup = async (
  api: Wretch,
  target: TagTarget,
  logger: any,
) => {
  const { tag, directory } = target

  const rawResponse = await getRawResponse(api, tag, logger)
  if (!rawResponse || rawResponse.length === 0) return

  const mappedResponse: MappedResponse[] = []

  for (const page of rawResponse.flat()) {
    const pbt = await getPageBlocksTree(api, page, logger)
    if (!pbt) continue

    mappedResponse.push({
      createdAt: format(page['created-at'], 'yyyy-MM-dd'),
      updatedAt: format(page['updated-at'], 'yyyy-MM-dd'),
      pageTitle: page.title,
      content: recursivelyGetContent(pbt),
    })
  }

  await writeToMd(directory, mappedResponse, logger)
}
