import React, { useCallback } from 'react'
import '../style/options.less'

const chromeExtensionUrl = 'https://developer.chrome.com/docs/extensions/'

function App() {
  const goToExtensionDoc = useCallback(() => {
    window.open(chromeExtensionUrl)
  }, [])

  return (
    <div className="container">
      <div className="title">create-crx-app</div>
      <div className="start" onClick={goToExtensionDoc}>
        Getting Chrome Extension Start &nbsp; <div className="arrow"></div>
      </div>
    </div>
  )
}

export default App
