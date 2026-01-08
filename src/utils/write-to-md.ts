import fs from 'node:fs/promises'
import path from 'node:path'

import { AstroIntegrationLogger } from 'astro'

import { MappedResponse } from '../types'
import { hasContentChanged } from '.'
import { getCleanSlug } from './get-clean-slug'

export const writeToMd = async (
  directory: string,
  mappedResponse: MappedResponse[],
  logger: AstroIntegrationLogger,
) => {
  const targetDir = path.resolve(process.cwd(), directory)

  try {
    await fs.mkdir(targetDir, { recursive: true })
    await Promise.all(
      mappedResponse.map(async (page) => {
        const cleanSlug = getCleanSlug(page)
        const filePath = path.join(targetDir, `${cleanSlug}.md`)
        const fileContent = `---
title: ${page.pageTitle}
date: ${page.date}
---
${page.content}`
        const contentToSave = fileContent.trim()
        if (await hasContentChanged(filePath, contentToSave)) {
          await fs.writeFile(filePath, contentToSave, 'utf-8')
        }
      }),
    )
  } catch (e) {
    logger.info(`Unable to create MD files: ${String(e)}`)
  }
}
