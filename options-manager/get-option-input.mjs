import { create_element_from_Html, is_object } from '../pages/utils.mjs'
import { escape_Html } from '../pages/utils.mjs'
import * as elements from './elements.mjs'

export const get_option_input = (name, info, value, onchange) => {
    let input

    switch (info.type) {
        case 'number':
            input = create_element_from_Html(`
                    <input type='number' value='${value}'></input>
            `)
            input.addEventListener('input', e => {
                onchange(name, Number(e.target.value))
            })
            break
        case 'pixels':
            input = create_element_from_Html(`
                <div style="display:flex">
                    <input style="margin-right: 10px" type='number' value='${value}'></input>
                    <span style="font-weight: bold;">pixels</span>
                </div>
            `)
            input.addEventListener('input', e => {
                onchange(name, Number(e.target.value))
            })
            break
        case 'string':
            input = create_element_from_Html(`
                <input type='text' value='${escape_Html(value)}'></input>
            `)
            input.addEventListener('input', e => {
                onchange(name, e.target.value)
            })
            break
        case 'function_or_null':
            input = create_element_from_Html(
                `<i style="color: #929292">Sorry, no input</i>`
            )
            break
        case 'multiline_string':
            input = create_element_from_Html(`
                <textarea style="width: 100%; height: 100px;">${value}</textarea>
            `)
            input.addEventListener('input', e => {
                onchange(name, e.target.value)
            })
            break
        case 'select':
            input = create_element_from_Html(`
                <select>
                    ${info.options.map(option => {
                        const v = is_object(option) ? option.value : option
                        const title = is_object(option) ? option.title : option
                        return `<option value="${v}" ${v === value ? 'selected' : ''}>
                            ${title}
                        </option>`
                    }).join('')}
                </select>
            `)
            input.addEventListener('change', e => {
                onchange(name, e.target.value)
            })
            break
        case 'boolean':
            let checked = value
            input = create_element_from_Html(`
                <div class="checkbox ${checked ? 'checked' : ''}">V</div>
            `)
            input.addEventListener('click', () => { checked = !checked; onchange(name, checked ) })
            break
    }

    const wrapper_el = elements.option_wrapper_el(name, info)
    wrapper_el.querySelector('.input-placeholder').replaceWith(input)
    wrapper_el.querySelector('.explanation-placeholder').replaceWith(
        info.explanation ? elements.option_explanation_button(info.explanation) : ''
    )

    return {
        el: wrapper_el,
        update: _options_to_values => {
            // change value
            const input_to_change = wrapper_el.querySelector('input, select, textarea, div.checkbox')
            if (input_to_change === null) return

            input_to_change.value = _options_to_values[name]
            
            if (info.type === 'boolean') {
                _options_to_values[name] ? input_to_change.classList.add('checked') : input_to_change.classList.remove('checked')
            }

            // change disabled state
            if (info.disable_if?.(_options_to_values)) {
                wrapper_el.classList.add('disabled')
                input_to_change.disabled = true
            } else {
                wrapper_el.classList.remove('disabled')
                input_to_change.disabled = false
            }
        }
    }
}
