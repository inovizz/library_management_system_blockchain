import Status from './status'

const NotificationType = (type, title, text) => {
  text = Status[text] || text
  return { type, title, text }
}

export default NotificationType
