/**
 * 用户输入尽可能简单，因此在程序处理之前，要将其再进行加工处理，将其丰富化，以便逻辑处理
 */

var _ = require('lodash');

function optionShow(isShow) {
    return {
        show: !!isShow
    }
}

function moduleShow(value, isShowForm, fieldData) {
    // 如果value为 false  或为 false 值，则说明它并不想显示
    if (!value) {
        return optionShow(false);
    }

    // 要么为boolean值，要么为object，也说明它并不想显示
    if (typeof value !== 'boolean' && typeof value !== 'object') {
        return optionShow(false);
    }

    // 如果value.show存在，但值为 false  或为 false 值，也说明它并不想显示
    if (value.hasOwnProperty('show') && !value.show) {
        return optionShow(false);
    }

    var options = {},
        dbConfig = fieldData.db;

    if (isShowForm && dbConfig) {
        // 通过db的字段类型，自动判断使用的组件和默认配置
        switch (dbConfig.type) {
            case 'varchar':
            case 'char':
            case 'int':
                options = {
                    type: 'input',
                    param: {
                        type: 'text'
                    }
                };
                break;
            case 'date':
                // case 'datetime':
                options = {
                    type: 'date'
                };
                break;
            default:
                break;
        }

        // 一些特殊的字段也有默认配置
        switch (fieldData.fieldName) {
            case 'state':
                _.merge(options, {
                    type: 'select2',
                    // value: '1',
                    param: {
                        options: [{
                            title: '有效',
                            value: '1'
                        }, {
                            title: '无效',
                            value: '-1'
                        }]
                    }
                });
                break;
            default:
                break;
        }
    }

    // 用户配置的参数有最高的优先级
    if (typeof value.options === 'object') {
        _.merge(options, value.options);
    }


    return _.merge({}, optionShow(true), {
        options: options
    });

}

var test = moduleShow(true, true, {
    fieldName: 'state',
    db: {
        type: 'varchar'
    }
})
console.log(test);
console.log(JSON.stringify(test));

// console.log(moduleShow({
//     options: {
//         type: 'input',
//         param: {
//             readonly: true
//         }
//     }
// }, false, {
//     type: 'varchar'
// }))
