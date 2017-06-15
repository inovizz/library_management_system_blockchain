import React from 'react'
import { render } from 'react-dom'
import { mount, shallow } from 'enzyme'
import Image from '../../../../components/utils/Image'
import BookUnavailabelImg from '../../../../img/book-unavailable.png'

describe('Image', () => {

  it('renders without crashing', () => {
    mount(<Image type={true} src={BookUnavailabelImg} />)
  })
  describe('render', () => {
    let component;
    beforeEach(() => {
      component = shallow(<Image type={true} src={BookUnavailabelImg} />)
    })
    it('should have a class imgContainer', () => {
      expect(component.find('.imgContainer').exists()).toEqual(true)
    })
    it('should have a class loader', () => {
      expect(component.find('.loader').exists()).toEqual(true)
    })
    it('should have a img element', () => {
      expect(component.find('img').exists()).toEqual(true)
    })
    it('should have a img element with imgLarge class', () => {
      expect(component.find('img.imgLarge').exists()).toEqual(true)
    })
    it('should set new src on error', () => {
      component.find('img').simulate('error');
      expect(component.find('img').props().src).toEqual(BookUnavailabelImg)
    })
    it('should hide the loaded on image load', () => {
      component.find('img').simulate('load');
      expect(component.find('.loader').exists()).toEqual(false)
    })
    it('should change the source of image if image not available', () => {
      const nextProps = { src: 'Image' }
      component.instance().componentWillReceiveProps(nextProps)
      expect(component.state().src).toEqual(nextProps.src)
    })
    it('should not change the source of image if image is available', () => {
      const nextProps = {}
      component.instance().componentWillReceiveProps(nextProps)
      expect(component.state().src).toEqual(undefined)
    })
  })

  describe('render when type is false',() => {
    let component;
    beforeEach(() => {
      component = shallow(<Image type={false} src={BookUnavailabelImg} />)
    })
    it('show have a img element with imgMedium class', () => {
      expect(component.find('img.imgMedium').exists()).toEqual(true)
    })
  })
})
