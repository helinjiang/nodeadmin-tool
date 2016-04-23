var _ = require('lodash');
var configDb = require('../lib/configdb');

var data = {
    sysNameEn: 'user',
    sysNameCn: '用户',
    tableName: 'user',
    tableFullName: 'hlj_user'
}

var fieldData = [];

// ID
fieldData.push({
    fieldName: 'id',
    title: 'ID',

    db: configDb.getDefaultPrimaryKey(),

    moduleDatagrid: true,
    moduleModify: {
        options: {
            param: {
                readonly: true
            }
        }
    },
    moduleDetail: true,
    moduleDelete: {
        options: {
            deleteDepend: 'id'
        }
    }
});


// name
fieldData.push({
    fieldName: 'name',
    title: '用户名',

    db: _.merge(configDb.getDefaultString(true), {
        isUnique: true
    }),

    moduleDatagrid: true,
    moduleAdd: true,
    moduleModify: {
        options: {
            param: {
                readonly: true
            }
        }
    },
    moduleDetail: true,
    moduleDelete: true,
    validator: {
        required: {
            rule: true,
            message: '用户名不能为空！'
        },
        minlength: {
            rule: 3,
            message: '最小长度为3'
        },
        maxlength: {
            rule: 64,
            message: '最大长度为64'
        }
    }
});

// pwd
fieldData.push({
    fieldName: 'pwd',
    title: '密码',

    db: _.merge(configDb.getDefaultString(true), {
        type: 'char'
    }),

    moduleAdd: {
        options: {
            param: {
                type: 'password'
            }
        }
    },
    validator: {
        required: {
            rule: true,
            message: '密码不能为空！'
        },
        minlength: {
            rule: 5,
            message: '最小长度为5'
        },
        maxlength: {
            rule: 32,
            message: '最大长度为32'
        }
    }
});

// state
fieldData.push({
    fieldName: 'state',
    title: '状态',

    db: configDb.getDefaultState(),

    moduleAdd: {
        options: {
            value: 1
        }
    },
    moduleModify: true
});

// 生日
// fieldData.push({
//     fieldName: 'birthday',
//     title: '生日',

//     db: configDb.getDefaultDate(),

//     moduleDatagrid: true,
//     moduleAdd: {
//         options: {
//             value: '2016-03-01'
//         }
//     },
//     moduleModify: true,
//     moduleDetail: true,
//     moduleDelete: true,
//     validator: {
//         required: {
//             rule: true,
//             message: '生日不能为空！'
//         }
//     }
// });

// 创建时间
fieldData.push({
    fieldName: 'createTime',
    title: '创建时间',

    db: configDb.getDefaultTime(),

    moduleDatagrid: true
});

// 更新时间
fieldData.push({
    fieldName: 'updateTime',
    title: '更新时间',

    db: configDb.getDefaultTime(),

    moduleDatagrid: true
});

// 状态，对应的是state
fieldData.push({
    fieldName: 'stateShow',
    title: '状态',

    moduleDatagrid: true,
    moduleDetail: true,
    moduleDelete: true
});


data.fieldData = fieldData;

// data.fieldDefine = {};

module.exports = data;
