BX.namespace('Plugin.UiSelector')

/**
 * Плагин для создания объекта TagSelector на базе статического списка
 * @type {{createTagSelector: BX.Plugin.UiSelector.createTagSelector, renderTagSelector: BX.Plugin.UiSelector.renderTagSelector}}
 */
BX.Plugin.UiSelector = {
    /**
     * {HTMLElement|String} container HTML element or its ID ("select" tag only) select
     * {{}} params
     */
    createTagSelector: function (select, params) {
        let target
        let tabs = [{id: 'base', title: 'Элементы', itemOrder: {title: 'asc'}}]

        if (typeof params == 'object') {
            if (params.tabs) {
                tabs = params.tabs
            }
        }

        if (typeof select === 'string') {
            target = document.getElementById(select)
            if (!target) {
                throw new Error('Container parameter is not valid ID.')
            }
        } else {
            target = select;
        }

        if (target.type != 'select-one' && target.type != 'select-multiple') {
            throw new Error('Container must be Select')
        }

        let options = target.options
        let items = []

        for (let option of options) {
            if (!option.value) {
                continue
            }

            let tab = 'base'

            let datatTab = option.getAttribute('data-tab')

            if (datatTab) {
                tab = datatTab
            }

            let label = option.text

            if (tabs.length > 1) {
                let optionTab = tabs.find(e => e.id == tab)

                if (optionTab) {
                    label = optionTab.title + ': ' + label
                }
            }

            items.push({
                id: option.value,
                title: label,
                entityId: 'main',
                tabs: tab,
                selected: option.selected
            })
        }

        let config = {
            node: target,
            multiple: target.type == 'select-multiple',
            items: items,
            tabs: tabs,
        }


        this.renderTagSelector(config)
    },
    /**
     * @param {HTMLElement} config.node
     * @param {boolean} config.multiple
     * @param {[]} config.items
     */
    renderTagSelector: function (config) {

        config.node.style.display = 'none'

        const tagSelector = new BX.UI.EntitySelector.TagSelector({
            multiple: config.multiple,
            dialogOptions: {
                multiple: config.multiple,
                items: config.items,
                selectedItems: config.items.filter(e => e.selected),
                dropdownMode: true,
                enableSearch: false,
                compactView: false,
                tabs: config.tabs,
            },
            events: {
                onBeforeTagAdd: function (event) {
                    const {tag} = event.getData();

                    if(config.multiple){
                        let options = config.node.querySelectorAll('option[value="'+tag.getId()+'"]')

                        if(options.length > 0) {
                            options[0].selected = true
                        }
                    } else {
                        config.node.value = tag.getId()
                    }

                    config.node.dispatchEvent(new Event('change'))
                },
                onBeforeTagRemove: function (event) {
                    if(config.multiple){

                        const {tag} = event.getData();

                        let options = config.node.querySelectorAll('option[value="'+tag.getId()+'"]')

                        if(options.length > 0) {
                            options[0].selected = false
                        }
                    } else {
                        config.node.value = null
                    }

                    config.node.dispatchEvent(new Event('change'))
                },
            }
        });

        tagSelector.renderTo(config.node.parentNode);
    }
}
