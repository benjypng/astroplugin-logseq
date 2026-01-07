import { format } from 'date-fns'
import { getPageBlocksTree, getRawResponse } from 'src/api'
import { MappedResponse, TagTarget } from 'src/types'
import { Wretch } from 'wretch/types'

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
}
