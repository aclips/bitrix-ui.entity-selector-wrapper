BX.namespace('Plugin.UiSelector')

/**
 * Плагин для создания объекта TagSelector
 * @type {{createTagSelector: BX.Plugin.UiSelector.createTagSelector, renderTagSelector: BX.Plugin.UiSelector.renderTagSelector}}
 */
BX.Plugin.UiSelector = {
    /**
     * {HTMLElement|String} container HTML element or its ID ("select" tag only)
     */
    createTagSelector: function (select) {
        let target
        if (typeof select === 'string') {
            target = document.getElementById(select)
            if (!target) {
                throw new Error('Container parameter is not valid ID.')
            }
        } else {
            target = select;
        }

        // @TODO Реализовать для множетвенного select
        if (target.type != 'select-one') {
            throw new Error('Container must be Select')
        }

        let options = target.options
        let items = []
        let selectedValues = []

        for (let option of options) {
            if (!option.value) {
                continue
            }

            items.push({
                id: option.value,
                title: option.text,
                entityId: 'main',
                tabs: 'main',
                selected: option.selected
            })
        }

        let config = {
            node: target,
            multiple: target.type == 'select-multiple',
            items: items
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
                tabs: [
                    {id: 'main', title: 'Элементы', itemOrder: {title: 'asc'}},
                ],
            },
            events: {
                onBeforeTagAdd: function (event) {
                    const {tag} = event.getData();
                    config.node.value = tag.getId()
                },
                onBeforeTagRemove: function (event) {
                    config.node.value = null
                },
            }
        });

        tagSelector.renderTo(config.node.parentNode);
    }
}
