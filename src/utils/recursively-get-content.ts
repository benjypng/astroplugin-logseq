import { ContentBlock } from '../types'

export const recursivelyGetContent = (
  contentBlocks: ContentBlock[],
  depth = 0,
) => {
  let content = ''
  const indent = '  '.repeat(depth)
  for (const block of contentBlocks) {
    const text = (block.fullTitle ?? '').replace(
      /(`[^`]+`)|\[\[(.*?)\]\]/g,
      (_match, code, linkContent) => {
        if (code) return code
        const isCodeDisplay =
          block[':logseq.property.node/display-type'] === 'code'
        return isCodeDisplay
          ? `\`\`\`\n[[${linkContent}]]\n\`\`\``
          : linkContent
      },
    )
    if (depth === 0) {
      content += `\n\n${text}`
    } else {
      content += `\n${indent}- ${text}`
    }
    if (block.children && block.children.length > 0) {
      content += recursivelyGetContent(block.children, depth + 1)
    }
  }
  return content
}
