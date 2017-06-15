import React from 'react'
import { shallow } from 'enzyme'
import BookRecord from '../../../../components/utils/BookRecord'

describe('BookRecord', () => {
  let component, props;

  beforeEach(() => {
    props = {
      title : 'Borrowing Book',
      tableHeading: {
        columnOne: 'Issued date',
        columnTwo: 'Issued By'
      },
      history: [
        {
          timestamp: '1496041895',
          borrower: '0x0'
        }
      ],
      members: {
        '0x0': {
          name: 'User'
        }
      }
    }
    component = shallow(<BookRecord {...props} />)
  })
  it('should have a title',() => {
    expect(component.find('.lead').text()).toBe(props.title)
  })
  it('should have a tableHeading',() => {
    expect(component.find('thead th').nodes[0].props.children).toBe(props.tableHeading.columnOne)
    expect(component.find('thead th').nodes[1].props.children).toBe(props.tableHeading.columnTwo)
  })
  it('should have a proper data',() => {
    const expected = (
      <tr>
        <td>Mon May 29 2017</td>
        <td>User</td>
      </tr>
    )
    expect(component.find('tbody').contains(expected)).toBe(true)
  })
})
