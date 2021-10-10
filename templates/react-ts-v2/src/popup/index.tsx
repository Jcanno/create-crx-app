import React, { useCallback } from 'react'
import ReactDOM from 'react-dom'
import '../style/popup.less'

function App() {
  // get static files by chrome.runtime.getURL
  const logo = chrome.runtime.getURL('assets/create-crx-app.png')
  const goToOptions = useCallback(() => {
    // go to options page
    chrome.runtime.openOptionsPage()
  }, [])
  return (
    <div className="app">
      <img src={logo} className="logo" />
      <div className="btn-wrapper">
        <div
          onClick={goToOptions}
          className="crx-btn"
          style={{ width: 150, height: 30, lineHeight: '30px', cursor: 'pointer' }}
        >
          Go to Options Page
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
