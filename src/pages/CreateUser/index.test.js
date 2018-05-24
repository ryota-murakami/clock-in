import React from 'react'
import { shallow } from 'enzyme'
import { CreateUser } from './index'
import { sel } from '../../testutil'

describe('<CreateUser />', () => {
  describe('data.loading == true', () => {
    function setup() {
      const data = { loading: true }
      const wrapper = shallow(<CreateUser data={data} />)
      return wrapper
    }

    it('shoud render only passing [data]props without error', () => {
      expect(() => setup()).not.toThrow()
    })

    it('should displayed Loading', () => {
      const wrapper = setup()
      expect(wrapper.find(sel('Loading')).exists()).toEqual(true)
    })
  })
  describe('data.loading == false', () => {
    describe('isNotExistUserInAuth0() == true', () => {
      const emptyMock = jest.fn()
      const returnTrueMock = jest.fn().mockReturnValue(true)
      function setup() {
        const data = { loading: false }
        CreateUser.prototype.insertUserDataToAuth0 = emptyMock
        CreateUser.prototype.isNotExistUserInAuth0 = returnTrueMock
        const wrapper = shallow(<CreateUser data={data} />)
        return wrapper
      }

      it('shoud render only passing [data]props without error', () => {
        expect(() => setup()).not.toThrow()
      })

      it('should not displayed Loading', () => {
        const wrapper = setup()
        expect(wrapper.find(sel('Loading')).exists()).toEqual(false)
      })

      it('sould be fire InsertUserDataToAuth0()', () => {
        setup()
        expect(emptyMock).toBeCalled()
      })

      it("should return <Redirect to={{ pathname: '/' }} />", () => {
        const wrapper = setup()
        expect(wrapper.find('Redirect').exists()).toEqual(true)
      })
    })
    describe('isNotExistUserInAuth0() == false', () => {
      const emptyMock = jest.fn()
      const returnFalseMock = jest.fn().mockReturnValue(false)

      function setup() {
        const data = { loading: false }
        CreateUser.prototype.insertUserDataToAuth0 = emptyMock
        CreateUser.prototype.isNotExistUserInAuth0 = returnFalseMock
        const wrapper = shallow(<CreateUser data={data} />)

        return wrapper
      }

      it('[data]propsのみの受け渡しでErrorなくレンダリングされること', () => {
        expect(() => setup()).not.toThrow()
      })

      it('Loadingが表示されないこと', () => {
        const wrapper = setup()

        expect(wrapper.find('Loading').exists()).toEqual(false)
      })

      it('should not fire InsertUserDataToAuth0()', () => {
        setup()

        expect(emptyMock).not.toBeCalled()
      })

      it("<Redirect to={{ pathname: '/' }} /> がreturnされること", () => {
        const wrapper = setup()

        expect(wrapper.find('Redirect').exists()).toEqual(true)
      })
    })
  })
})
