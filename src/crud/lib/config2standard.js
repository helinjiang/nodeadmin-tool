/**
 * 用户输入尽可能简单，因此在程序处理之前，要将其再进行加工处理，将其丰富化，以便逻辑处理
 * 状态stateShow能否有对应关系
 * 在表单中的name值可能与后台处理的不一致
 */
var fs = require('fs');
var _ = require('lodash');

function optionShow(isShow) {
    return {
        show: !!isShow
    }
}

/**
 * 将各模块如何展示的配置丰富化，完善，并给与默认值，返回一个合格的数据
 *
 * TODO 还有个priority，以便控制显示的顺序
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

                // 特殊情况，删除options.param.type，这是因为判断dbConfig.type时默认了个options.param.type=“text"
                if (options.param.type) {
                    delete options.param.type;
                }
                
                break;
            default:
                break;
        }
    }

    // 用户配置的参数有最高的优先级
    if (typeof value.options === 'object') {
        _.merge(options, value.options);
    }

    var result = _.merge({}, optionShow(true));

    // 只有options非空情况下才设置
    if (!_.isEmpty(options)) {
        _.merge(result, {
            options: options
        });
    }

    return result;
}

/**
 * 获得标准的数据，并返回
 * @param  {object}   initData 初始数据
 * @return {object}            标准化的数据
 */
function getStandardData(initData) {
    var data = _.merge({}, initData);
    // fs.writeFileSync('./test1.json', JSON.stringify(data, null, 4));

    var defaultConfig = {
        'sysMenu': '<%=sysNameCn%>管理',
        'sysMenuId': 'menu<%=_.capitalize(sysNameEn)%>',
        'sysModuleName': 'admin',
        'sysCrumb': '首页|/<%=sysModuleName%>|home;系统管理;<%=sysNameCn%>管理',
        'sysDesc': '管理<%=sysNameCn%>信息',
    }

    data.sysNameCn = data.sysNameCn || data.sysNameEn;
    data.sysMenu = _.template(data.sysMenu || defaultConfig.sysMenu)(data);
    data.sysMenuId = _.template(data.sysMenuId || defaultConfig.sysMenuId)(data);
    data.sysModuleName = _.template(data.sysModuleName || defaultConfig.sysModuleName)(data);
    data.sysCrumb = _.template(data.sysCrumb || defaultConfig.sysCrumb)(data);
    data.sysDesc = _.template(data.sysDesc || defaultConfig.sysDesc)(data);

    // 处理fieldData字段
    var fieldData = data.fieldData;

    // 数据库主键
    var primaryKey;

    // 需要保持唯一的字段
    var uniqueArr = [];

    fieldData.forEach(item => {
        var fieldName = item.fieldName,
            title = item.title || fieldName,
            dbData = item.db;

        //有可能title都没配置
        item.title = title;

        // 如果该字段不是数据库字段，则它是没有这个配置项的
        if (dbData) {
            // 数据库表中的字段名称，默认应该和fieldName一致，但也可能会不一样哦
            dbData.fieldName = dbData.fieldName || fieldName;

            // 判断是否为主键
            if (dbData.isPrimaryKey) {
                primaryKey = fieldName;
            }

            var validator = {};

            // 判断是否为非空
            if (dbData.isNotNull) {
                validator.required = {
                    rule: true,
                    message: title + '不能为空！'
                }
            }

            // 是否需要保持唯一性
            if (dbData.isUnique) {
                uniqueArr.push(fieldName);
            }

            // 如果是int类型的，则需要判断其是否为数字
            switch (dbData.type) {
                case 'int':
                    if (dbData.property && dbData.property.toUpperCase() == 'UNSIGNED') {
                        validator.digits = {
                            rule: true,
                            message: title + '必须为数字！'
                        }
                    }
                    // if(!dbData.isAutoIncrease){
                    //     validator.maxlength = dbData.length;
                    // }
                    break;

                case 'varchar':
                case 'char':
                    if (dbData.length) {
                        validator.maxlength = {
                            rule: dbData.length,
                            message: '最大长度为' + dbData.length
                        }
                    }
                    break;

                default:
                    break;
            }
        }
        /**
         * validator
         * 默认校验标准为数据库配置，但是可以有额外的覆盖，比如限制3-12长度，虽然可能数据库长度为64
         *
         * 如果定义了validator则合并之
         */
        if (typeof item.validator == 'object') {
            _.merge(validator, item.validator);
        }

        if (!_.isEmpty(validator)) {
            item.validator = validator;
        }

        item.moduleDatagrid = moduleShow(item.moduleDatagrid, false, item);
        item.moduleAdd = moduleShow(item.moduleAdd, true, item);
        item.moduleModify = moduleShow(item.moduleModify, true, item);
        item.moduleDelete = moduleShow(item.moduleDelete, false, item);
        item.moduleDetail = moduleShow(item.moduleDetail, false, item);
    });


    data.primaryKey = primaryKey;
    data.uniqueArr = uniqueArr;

    // fs.writeFileSync('./test2.json', JSON.stringify(data, null, 4));
    return data;
}

module.exports = {
    getStandardData: getStandardData
}