/**
 * 用户输入尽可能简单，因此在程序处理之前，要将其再进行加工处理，将其丰富化，以便逻辑处理
 */

var _ = require('lodash');

function optionShow(isShow) {
    return {
        show: !!isShow
    }
}

/**
 * 将各模块如何展示的配置丰富化，完善，并给与默认值，返回一个合格的数据
 *
 * 配置项说明
 * 1. false|undefined
 *     返回{show:false}
 *
 * 2. true
 *     默认值
 *
 * 3. 对象{
 *     options: {
 *         xx:yy
 *     }
 * }
 *     返回 {
 *         show : true,       
 *         options: {
 *             type: 'input', // 表单类型
 *             param: { // 表单的额外参数
 *                 readonly: true
 *             },
 *             value: xx, // 默认值
 *             deleteDepend:'id', // 只有在delete场景下才用得到
 *         }
 *     }
 * 
 * @param  {string|boolean|object}   value      p配置值
 * @param  {boolean}  isShowForm 是否处理成表格
 * @param  {object}   fieldData  该字段的定义
 * @return {object}              合格的数据
 */
function moduleShow(value, isShowForm, fieldData) {
    // 如果value为 false  或为 false 值，则说明它并不想显示
    if (!value) {
        return optionShow(false);
    }

    // 如果value不是boolean值，也不是object，也说明它并不想显示
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


/**
 * validator 
 * 默认校验标准为数据库配置，但是可以有额外的覆盖，比如限制3-12长度，虽然可能数据库长度为64
 */

// 状态stateShow能否有对应关系



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
