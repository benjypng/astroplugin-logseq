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

export interface LogseqResponse {
  ['created-at']: number
  name: string
  title: string
  ['updated-at']: number
  _parent: LogseqResponse[]
}

export interface ContentBlock {
  title: string
  children?: ContentBlock[]
}

export interface MappedResponse {
  createdAt: string
  updatedAt: string
  pageTitle: string
  content: string
}
