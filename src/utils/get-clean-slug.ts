import { MappedResponse } from '../types'

export const getCleanSlug = (page: MappedResponse) =>
  page.pageTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
