import React from 'react'
import ReactDOM from 'react-dom'

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

function App() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 200,
        right: 80,
        width: 100,
        height: 100,
        borderRadius: 50,
      }}
    >
      created by extension
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
