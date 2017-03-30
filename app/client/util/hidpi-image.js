
export const hidpiImage = ({ img, width, height, ext }) => {
  const hidpiExtension = window.devicePixelRatio > 1 ? "@2x" : ""
  return {
    background: `url(${require(`../assets/${img}${hidpiExtension}.${ext}`)}) no-repeat`,
    backgroundSize: `${width}px ${height}px`
  }
}
