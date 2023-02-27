export function formatPrice(price) {
  return price.toFixed(3)
}

export function formatTime(time) {
  return new Date(time).toLocaleTimeString()
}
