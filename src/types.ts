export interface TagTarget {
  tag: string
  directory: string
}

export interface LogseqIntegrationOptions {
  token: string
  targets: TagTarget[]
  dateRef: string
  apiUrl?: string
  pollingInterval?: number
}

export interface LogseqPageResponse {
  ['created-at']: number
  ['updated-at']: number
  name: string
  title: string
  _parent: { uuid: string }[]
  ident: string
  // to handle journal day
  // e.g. :user.property/publish-date-xxddxx
  [key: string]: any
}

export interface ContentBlock {
  fullTitle: string
  [':logseq.property.node/display-type']?: string
  [':logseq.property/heading']?: string
  [':logseq.property.code/lang']?: string
  children?: ContentBlock[]
}

export interface MappedResponse {
  createdAt: string
  updatedAt: string
  pageTitle: string
  content: string
  date?: Date
}
