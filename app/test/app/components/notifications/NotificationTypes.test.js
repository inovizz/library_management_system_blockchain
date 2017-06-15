import status from '../../../../components/notifications/status'
import NotificationType from '../../../../components/notifications/NotificationTypes'

describe('NotificationType',() => {
  it('should generate error message from status code', () => {
    const actual = { type: 'error', title: 'Error', text: status['123'] }
    const expected = NotificationType('error', 'Error', '123');
    expect(expected).toEqual(actual)
  })
  it('should show error message if status code not present', () => {
    const actual = { type: 'error', title: 'Error', text: 'error message' }
    const expected = NotificationType('error', 'Error', 'error message');
    expect(expected).toEqual(actual)
  })
})
