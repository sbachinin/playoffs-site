import { OPTIONS } from './options_meta.mjs'
import { get_default_options } from './options-meta-getter.mjs'
import { get_option_input } from './get-option-input.mjs'
import * as elements from './elements.mjs'
import { get_options_group_heading } from './get_options_group_heading.mjs'
import { throttle_with_trailing } from '../utils.mjs'
import { create_user_options_text } from './user_options_text.mjs'
import { insert_styles } from '../pages/utils.mjs'
import { options_manager_styles } from './options-manager-styles.mjs'
import { create_element_from_Html } from '../pages/utils.mjs'

const names_of_expanded_groups = []
const all_inputs = []

const toggle_group_expand = (group_name) => {
    const should_expand = !names_of_expanded_groups.includes(group_name)

    if (should_expand) {
        names_of_expanded_groups.push(group_name)
        document.querySelector(`.${group_name}-arrow`).style.transform = 'rotate(180deg)'
        document.querySelector(`.${group_name}`).style.height = 'auto'
    } else {
        const index = names_of_expanded_groups.indexOf(group_name)
        names_of_expanded_groups.splice(index, 1)
        document.querySelector(`.${group_name}-arrow`).style.transform = 'none'
        document.querySelector(`.${group_name}`).style.height = 0
    }
}

const create_inputs = (sidebar_el, handle_option_change) => {
    sidebar_el.innerHTML = ''

    const onchange = throttle_with_trailing((option_name, option_value) => {
        handle_option_change(option_name, option_value)
    }, 300)

    const get_inputs_of_type = (options, group_name) => {
        const group_inputs = Object.entries(options)
            .map(([option_name, option_info]) => {
                const input = get_option_input(
                    option_name,
                    option_info,
                    onchange
                )
                all_inputs.push(input)
                return input.el
            })

        const group_wrapper_el = elements.grouped_inputs_wrapper(group_name, names_of_expanded_groups)
        group_wrapper_el.append(...group_inputs)
        return group_wrapper_el
    }

    Object.entries(OPTIONS)
        .forEach(([group_name, options_of_type]) => {
            sidebar_el.append(get_options_group_heading(
                group_name,
                names_of_expanded_groups.includes(group_name),
                toggle_group_expand
            ))
            sidebar_el.append(get_inputs_of_type(options_of_type, group_name))
        })


    const {
        user_options_text_el, update_user_options_text
    } = create_user_options_text()
    sidebar_el.append(user_options_text_el)

    const update_inputs = (user_options) => {
        const actual_options = { ...get_default_options(), ...user_options }
        all_inputs.forEach(i => i.update(actual_options))
        update_user_options_text(actual_options)
    }

    return update_inputs
}

export const add_options_manager = (
    opener_el,
    playoffs
) => {
    const sidebar_el = create_element_from_Html(
        `<div class="options-manager-wrapper"></div>`
    )
    insert_styles('', 'options-manager-styles', options_manager_styles)

    const handle_option_change = (option_name, option_value) => {
        playoffs.applyNewOptions({ [option_name]: option_value })
        update_inputs(playoffs.getUserOptions())
    }

    const update_inputs = create_inputs(sidebar_el, handle_option_change)

    update_inputs(playoffs.getUserOptions())

    sidebar_el.prepend(elements.sidebar_close_button())

    document.body.prepend(sidebar_el)

    opener_el.addEventListener('click', () => {
        sidebar_el.style.right = parseInt(getComputedStyle(sidebar_el).right) === 0 ? '-1000px' : '0px'
    })

    elements.create_tooltip()

    return {
        element: sidebar_el,
        update_inputs
    }
}
