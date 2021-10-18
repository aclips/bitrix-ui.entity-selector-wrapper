# bitrix-ui.entity-selector-wrapper
Расширение для лёгкого использования ui.entity-selector на статичных списках

## Использования

Размещаем расширение в папке local/ (local/js/aclips/ui-selector)

```
<?php \Bitrix\Main\UI\Extension::load('aclips.ui-selector') ?>

<select id='my_select'>
    <option value='1'>Option 1</option>  
    <option value='2'>Option 2</option>  
    <option value='3'>Option 3</option>  
    <option selected value='4'>Option 4</option>  
    <option value='5'>Option 5</option>  
</select>

<script type="text/javascript">

    BX.ready(function () {
        BX.Plugin.UiSelector.createTagSelector('my_select') // or BX.Plugin.UiSelector.createTagSelector(document.getElementById('my_select'))
    })
</script>
```

Результат

![Результат](https://github.com/aclips/bitrix-ui.entity-selector-wrapper/blob/main/example.gif)
