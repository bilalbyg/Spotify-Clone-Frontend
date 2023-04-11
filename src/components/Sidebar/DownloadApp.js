import React from 'react'
import { Icon } from '../../Icons'

export default function DownloadApp() {
  return (
    <div className="h-10 flex flex-shrink-0 text-sm font-semibold px-8 hover:text-white items-center gap-x-4">
        <Icon name="downdir" size={20}/>
        Uygulamayı yükle
    </div>
  )
}
