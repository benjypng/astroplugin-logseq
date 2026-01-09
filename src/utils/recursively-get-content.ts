import { ContentBlock } from '../types'

const processBlockContent = (block: ContentBlock): string => {
  const rawText = block.fullTitle ?? ''

  return rawText.replace(
    /(`[^`]+`)|\[\[(.*?)\]\]/g,
    (_match, code, linkContent) => {
      if (code) return code

      const isCodeDisplay =
        block[':logseq.property.node/display-type'] === 'code'

      return isCodeDisplay ? `\`\`\`\n[[${linkContent}]]\n\`\`\`` : linkContent
    },
  )
}

const getBlockPrefix = (block: ContentBlock, depth: number): string => {
  const headingLevel = block[':logseq.property/heading']
  if (typeof headingLevel === 'number' && headingLevel >= 1) {
    return '#'.repeat(headingLevel) + ' '
  }
  if (depth > 0) {
    return '- '
  }
  return ''
}

export const recursivelyGetContent = (
  contentBlocks: ContentBlock[],
  depth = 0,
) => {
  let content = ''
  const indent = '  '.repeat(depth)

  for (const block of contentBlocks) {
    const text = processBlockContent(block)
    const prefix = getBlockPrefix(block, depth)
    const separator = depth === 0 ? '\n\n' : '\n'
    content += `${separator}${indent}${prefix}${text}`
    if (block.children && block.children.length > 0) {
      content += recursivelyGetContent(block.children, depth + 1)
    }
  }
  return content
}
