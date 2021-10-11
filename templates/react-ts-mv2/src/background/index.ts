chrome.runtime.onInstalled.addListener((installedDetails) => {
  // emit in every reload
  if (installedDetails.reason === 'update') {
    console.log('chrome extension update success')
  }
})
