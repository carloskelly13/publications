const _hidpiExtension = window.devicePixelRatio > 1 ? "@2x" : ""

export const hidpiImage = ({ img, width, height, ext }) => ({
  background: `url(${require(`../../img/${img}${_hidpiExtension}.${ext}`)}) no-repeat`,
  backgroundSize: `${width}px ${height}px`,
})
