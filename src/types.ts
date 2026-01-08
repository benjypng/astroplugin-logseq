export interface TagTarget {
  tag: string
  directory: string
}

export interface LogseqIntegrationOptions {
  token: string
  targets: TagTarget[]
  apiUrl?: string
  pollingInterval?: number
}

export interface LogseqPageResponse {
  ['created-at']: number
  ['updated-at']: number
  name: string
  title: string
  _parent: { uuid: string }[]
}

export interface ContentBlock {
  fullTitle: string
  [':logseq.property.node/display-type']?: string
  children?: ContentBlock[]
}

export interface MappedResponse {
  createdAt: string
  updatedAt: string
  pageTitle: string
  content: string
}
