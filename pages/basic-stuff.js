import { createPlayoffs } from 'playoffs'

import { insert_styles } from './utils.mjs'
import * as html_partials from './html_partials.mjs'
import { examples_common_styles } from './examples_common_styles.mjs'
import { get_some_data } from '../test_data/get_some_data.mjs'
import { add_options_manager } from '../options-manager/options-manager.mjs'
import { create_data_picker } from '../test_data/create_data_picker.mjs'

insert_styles('', 'common-styles', examples_common_styles)

document.body.innerHTML = `


    ${html_partials.home_link}
    <h1>BASIC STUFF</h1>
    <hr />
    <h2>HOW</h2>
    <div class="code">import { createPlayoffs } from 'playoffs'

createPlayoffs(
data,
document.querySelector('.playoffs-wrapper'), // any element on your page
{}
)</div>
    <p>Your data must be of a particular <a href="data.html">shape</a></p>


    <br />
    <hr />
    <h2>RESULT</h2>

    <div class="common-playoffs-wrapper"></div>
    <div class="options-manager-opener">manage options</div>
    <div class="data-picker default-playoffs-data-picker">try different data: </div>

    ${html_partials.footer}
`





get_some_data().then(data => {
    const playoffs_wrapper = document.querySelector('.common-playoffs-wrapper')
    let playoffs = createPlayoffs(
        data,
        playoffs_wrapper,
        {}
    )
    add_options_manager(
        document.querySelector('.options-manager-opener'),
        (o) => playoffs.applyNewOptions(o),
        {}
    )
    create_data_picker(
        document.querySelector('.default-playoffs-data-picker'),
        (new_data) => {
            playoffs = createPlayoffs(new_data, playoffs_wrapper, playoffs.getUserOptions())
        }
    )
})


