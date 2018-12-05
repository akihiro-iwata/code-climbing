import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Counter)
  })
  test('Setup correctly', () => {
    expect(true).toBe(true)
  })
  test('increments the counter value when button is clicked', () => {
    expect(wrapper.text()).toContain('Counter: 0')
    wrapper.find('button.inclement-button').trigger('click')
    expect(wrapper.text()).toContain('Counter: 1')
  })
})
