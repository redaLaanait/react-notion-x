import React from 'react'
import { ExtendedRecordMap } from 'notion-types'

import {
  MapPageUrl,
  MapImageUrl,
  MapAssetUrl,
  SearchNotion,
  NotionComponents
} from './types'
import { defaultMapPageUrl, defaultMapImageUrl, cs } from './utils'
import { Checkbox as DefaultCheckbox } from './components/checkbox'
import { url } from 'inspector'
import { Text } from './components/text'

export interface NotionContext {
  recordMap: ExtendedRecordMap
  components: NotionComponents

  mapPageUrl: MapPageUrl
  mapImageUrl: MapImageUrl
  mapAssetUrl: MapAssetUrl
  searchNotion?: SearchNotion

  rootPageId?: string
  rootDomain?: string

  fullPage: boolean
  darkMode: boolean
  previewImages: boolean
  showCollectionViewDropdown: boolean
  showTableOfContents: boolean
  minTableOfContentsItems: number

  defaultPageIcon?: string
  defaultPageCover?: string
  defaultPageCoverPosition?: number

  zoom: any

  displayPageHeader?: boolean

}

export interface PartialNotionContext {
  recordMap?: ExtendedRecordMap
  components?: Partial<NotionComponents>

  mapPageUrl?: MapPageUrl
  mapImageUrl?: MapImageUrl
  mapAssetUrl?: MapAssetUrl
  searchNotion?: SearchNotion

  rootPageId?: string
  rootDomain?: string

  fullPage?: boolean
  darkMode?: boolean
  previewImages?: boolean
  showCollectionViewDropdown?: boolean

  showTableOfContents?: boolean
  minTableOfContentsItems?: number

  defaultPageIcon?: string
  defaultPageCover?: string
  defaultPageCoverPosition?: number

  zoom?: any

  displayPageHeader?: boolean
}

const DefaultLink: React.SFC = (props) => (
  <a target='_blank' rel='noopener noreferrer' {...props} />
)
const DefaultPageLink: React.SFC = (props) => <a {...props} />


const DefaultDetails: React.SFC = ({blockId, block, children,...rest}: any) => (
  <details className={cs('notion-toggle', blockId)}>
    <summary>
      {/* <Text value={block.properties?.title} block={block} /> */}
      {rest.summary}
    </summary>

    <div>{children}</div>
  </details>
)
export const dummyLink = ({ href, rel, target, title, ...rest }) => (
  <span {...rest} />
)

const dummyComponent = (name: string) => () => {
  console.warn(
    `Error using empty component: ${name}\nYou should override this in NotionRenderer.components`
  )

  return null
}

const defaultComponents: NotionComponents = {
  link: DefaultLink,
  pageLink: DefaultPageLink,
  checkbox: DefaultCheckbox,

  code: dummyComponent('code'),
  equation: dummyComponent('equation'),

  collection: dummyComponent('collection'),
  collectionRow: dummyComponent('collectionRow'),

  pdf: dummyComponent('pdf'),
  tweet: dummyComponent('tweet'),
  modal: dummyComponent('modal'),
  youtube: null,
  details: DefaultDetails
}

const defaultNotionContext: NotionContext = {
  recordMap: {
    block: {},
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {}
  },

  components: defaultComponents,

  mapPageUrl: defaultMapPageUrl(),
  mapImageUrl: defaultMapImageUrl,
  mapAssetUrl: (url) => url,
  searchNotion: null,

  fullPage: false,
  darkMode: false,
  previewImages: false,
  showCollectionViewDropdown: true,

  showTableOfContents: false,
  minTableOfContentsItems: 3,

  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  zoom: null,

  displayPageHeader: true,
}

const ctx = React.createContext<NotionContext>(defaultNotionContext)

export const NotionContextProvider: React.SFC<PartialNotionContext> = ({
  components: themeComponents = {},
  children,
  mapPageUrl,
  mapImageUrl,
  mapAssetUrl,
  rootPageId,
  ...rest
}) => {
  for (const key of Object.keys(rest)) {
    if (rest[key] === undefined) {
      delete rest[key]
    }
  }

  return (
    <ctx.Provider
      value={{
        ...defaultNotionContext,
        ...rest,
        rootPageId,
        mapPageUrl: mapPageUrl ?? defaultMapPageUrl(rootPageId),
        mapImageUrl: mapImageUrl ?? defaultMapImageUrl,
        mapAssetUrl: mapAssetUrl ?? defaultNotionContext.mapAssetUrl,
        components: { ...defaultComponents, ...themeComponents }
      }}
    >
      {children}
    </ctx.Provider>
  )
}

export const NotionContextConsumer = ctx.Consumer

export const useNotionContext = (): NotionContext => {
  return React.useContext(ctx)
}
