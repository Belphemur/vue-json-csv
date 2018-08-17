import {mount} from '@vue/test-utils'
import Component from '../src/JsonCSV'

describe('Component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Component, {
      propsData: {
        data: []
      }
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('is filtering the columns', () => {
    const wrapper = mount(Component, {
      propsData: {
        data: [
          {'id': 1, 'fname': 'Jesse', 'lname': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male'},
          {'id': 2, 'fname': 'John', 'lname': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male'},
          {'id': 3, 'fname': 'Tina', 'lname': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female'},
          {'id': 4, 'fname': 'Clarence', 'lname': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male'},
          {'id': 5, 'fname': 'Anne', 'lname': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female'}
        ],
        fields: ['fname', 'lname']
      }
    })
    const vm = wrapper.vm

    const exportableData = vm.exportableData
    const firstData = expect(exportableData[0])
    firstData.toHaveProperty('fname', 'Jesse')
    firstData.toHaveProperty('lname', 'Simmons')
    firstData.not.toHaveProperty('id')
    firstData.not.toHaveProperty('date')
    firstData.not.toHaveProperty('gender')

  })

  test('is labeling the columns', () => {
    const wrapper = mount(Component, {
      propsData: {
        data: [
          {'id': 1, 'fname': 'Jesse', 'lname': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male'},
          {'id': 2, 'fname': 'John', 'lname': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male'},
          {'id': 3, 'fname': 'Tina', 'lname': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female'},
          {'id': 4, 'fname': 'Clarence', 'lname': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male'},
          {'id': 5, 'fname': 'Anne', 'lname': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female'}
        ],
        labels: {
          fname: 'First name',
          lname: 'Last name'
        }
      }
    })
    const vm = wrapper.vm

    const exportableData = vm.exportableData
    const firstData = expect(exportableData[0])
    firstData.toHaveProperty('First name', 'Jesse')
    firstData.toHaveProperty('Last name', 'Simmons')
    firstData.toHaveProperty('id', 1)
    firstData.toHaveProperty('date', '2016-10-15 13:43:27')
    firstData.toHaveProperty('gender', 'Male')

  })

  test('is filtering & labeling the columns', () => {
    const wrapper = mount(Component, {
      propsData: {
        data: [
          {'id': 1, 'fname': 'Jesse', 'lname': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male'},
          {'id': 2, 'fname': 'John', 'lname': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male'},
          {'id': 3, 'fname': 'Tina', 'lname': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female'},
          {'id': 4, 'fname': 'Clarence', 'lname': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male'},
          {'id': 5, 'fname': 'Anne', 'lname': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female'}
        ],
        labels: {
          fname: 'First name',
          lname: 'Last name'
        },
        fields: ['fname', 'lname']
      }
    })
    const vm = wrapper.vm

    const exportableData = vm.exportableData
    const firstData = expect(exportableData[0])
    firstData.toHaveProperty('First name', 'Jesse')
    firstData.toHaveProperty('Last name', 'Simmons')
    firstData.not.toHaveProperty('id')
    firstData.not.toHaveProperty('date')
    firstData.not.toHaveProperty('gender')
  })

  test('is triggering event on export', () => {
    const wrapper = mount(Component, {
      propsData: {
        data: [
          {'id': 1, 'fname': 'Jesse', 'lname': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male'}
        ],
        testing: true
      }
    })
    const vm = wrapper.vm

    wrapper.find('#'+ vm.idName).trigger('click')

    expect(wrapper.emitted()['export-started']).toBeTruthy()
    expect(wrapper.emitted()['export-finished']).toBeTruthy()
  })
})
