chrome.runtime.onInstalled.addListener((installedDetails) => {
  if (installedDetails.reason === 'install') {
    console.log('chrome extension install success')
  }
})
