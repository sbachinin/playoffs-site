import { createPlayoffs } from '../easy-playoffs.min.js'
import data from './data.mjs'
import { adjust_options_on_resize } from '../options/adjust_options_on_resize.mjs'

const playoffs = createPlayoffs(
    data,
    document.querySelector('.common-playoffs-wrapper')
)

adjust_options_on_resize(playoffs)

document.querySelector('.example-data > code').innerHTML = JSON.stringify(data, null, 4).replace(/"([^"]+)":/g, '$1:')

let data_collapsed = true

const example_data_el = document.querySelector('.example-data')
const toggle_data = document.querySelector('.toggle-data')

toggle_data.addEventListener('click', (e) => {
    data_collapsed = !data_collapsed
    e.target.innerHTML = data_collapsed ? '+' : '-'
    example_data_el.classList[data_collapsed ? 'add' : 'remove']('collapsed')
})

example_data_el.addEventListener('click', (e) => {
    if (example_data_el.classList.contains('collapsed')) {
        data_collapsed = false
        toggle_data.innerHTML = '-'
        example_data_el.classList.remove('collapsed')
    }
})