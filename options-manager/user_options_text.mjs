import { create_element_from_Html } from '../utils.mjs'
import { get_default_options } from './options-meta-getter.mjs'

const get_text = (options_to_values) => {
    const default_options = get_default_options()
    const non_default_options = Object.fromEntries(
        Object.entries(options_to_values)
            .filter(([n, v]) => default_options[n] !== v)
    )
    return JSON.stringify(non_default_options, null, 4)
        .replace(/"([^"]+)":/g, '$1:') // remove quotes from object keys
}

export const create_user_options_text = () => {
    const text_el = create_element_from_Html(
        `<div style='
            border: 1px solid #ccc;
            white-space: pre;
            padding: 10px;
            margin-top: 5px;
            background: #fff;
            color: #757575;
            overflow: auto;
        '></div>`
    )


    const button = create_element_from_Html(`
        <div style='
            border: 2px solid #ccc;
            display: inline-block;
            padding: 3px 6px;
            text-align: center;
            font-weight: bold;
            cursor: pointer;
            margin-top: 5px;
            background: #ebebeb;
            user-select: none;
            line-height: 22px;
            box-sizing: border-box;
        '>Copy to clipboard</div>
    `)
    button.addEventListener('click', e => {
        e.target.innerHTML = '&#10003;'
        setTimeout(() => e.target.innerHTML = 'Copy to clipboard', 300)
        navigator.clipboard.writeText(text_el.innerText)
    })

    const update_user_options_text = (options_to_values) => {
        text_el.innerText = get_text(options_to_values)
    }

    const wrapper = create_element_from_Html(`
        <div style='
            margin: 70px 10px 0;
            background: #e5fdfc;
            padding: 10px;
            font-family: monospace;
        '>
            Resulting object of non-default options:
        </div>
    `)
    wrapper.append(text_el, button)

    return {
        user_options_text_el: wrapper,
        update_user_options_text
    }
}