import React from 'react'
import { FileBlock } from 'notion-types'

import { FileIcon } from '../icons/file-icon'
import { useNotionContext } from '../context'
import { cs } from '../utils'
import { Text } from './text'

export const File: React.FC<{
  block: FileBlock
  className?: string
}> = ({ block, className }) => {
  const { components, recordMap, mapAssetUrl } = useNotionContext()
  const signedUrl = recordMap.signed_urls[block.id]

  return (
    <div className={cs('notion-file', className)}>
      <components.link
        className='notion-file-link'
        href={mapAssetUrl(signedUrl, block)}
        target='_blank'
        rel='noopener noreferrer'
        block={block}
      >
        <FileIcon className='notion-file-icon' />

        <div className='notion-file-info'>
          <div className='notion-file-title'>
            <Text value={block.properties?.title || [['File']]} block={block} />
          </div>

          {block.properties?.size && (
            <div className='notion-file-size'>
              <Text value={block.properties.size} block={block} />
            </div>
          )}
        </div>
      </components.link>
    </div>
  )
}
