import { createApp } from 'vue'
import App from './App.vue'

const root = document.createElement('div')
root.id = 'crx-root'
root.style.cssText = `bottom: 150px; right: 80px; position: fixed; z-index: 9999`
document.body.appendChild(root)

const btnHeight = 50
const btnWidth = 250
const getWindowInnerSize = () => {
  return {
    windowHeight: window.innerHeight - btnHeight,
    windowWidth: window.innerWidth - btnWidth,
  }
}
const getDomPosition = (dom) => {
  const { bottom, right, top, left } = dom.style
  return {
    bottom: parseFloat(bottom),
    right: parseFloat(right),
    top: parseFloat(top),
    left: parseFloat(left),
  }
}
const getEventTargetCoordinate = (e) => {
  return {
    x: e.clientX,
    y: e.clientY,
  }
}
const setDomCoordinate = (dom, coordinate) => {
  Object.assign(dom.style, coordinate)
}
const getCalculatedCoordinate = (coordinate, edgeSize) => {
  return coordinate > 0 ? (coordinate > edgeSize ? edgeSize : coordinate) : 0
}

root.onmousedown = function (e) {
  const { x: startX, y: startY } = getEventTargetCoordinate(e)
  const { bottom: startBottom, right: startRgight } = getDomPosition(root)
  const move = (moveEvent) => {
    moveEvent.stopPropagation()
    moveEvent.preventDefault()
    const { x: curX, y: curY } = getEventTargetCoordinate(moveEvent)
    const { windowHeight, windowWidth } = getWindowInnerSize()
    const bottom = startY - curY + startBottom
    const right = startX - curX + startRgight

    setDomCoordinate(root, {
      bottom: `${getCalculatedCoordinate(bottom, windowHeight)}px`,
      right: `${getCalculatedCoordinate(right, windowWidth)}px`,
    })
  }

  const up = () => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

window.addEventListener('resize', function () {
  const { windowHeight, windowWidth } = getWindowInnerSize()
  const { bottom, right } = getDomPosition(root)

  setDomCoordinate(root, {
    bottom: `${getCalculatedCoordinate(bottom, windowHeight)}px`,
    right: `${getCalculatedCoordinate(right, windowWidth)}px`,
  })
})

createApp(App).mount('#crx-root')
