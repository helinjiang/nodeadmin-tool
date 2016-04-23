var _ = require('lodash');

function ConfigDb() {
    /**
     * 在数据库中的名字，默认与sysNameEn定义应该是一致的，但也可能不一样
     * 如果此处设置有值，则以该值为准
     * @type {[type]}
     */
    this.fieldName = undefined;
    /**
     * 字符串 varchar|字符串 char|整型 int|日期 date|时间 datetime|文本 text
     * @type {String}
     */
    this.type = 'varchar';

    /**
     * 长度，一般而言，只有varchar\char和int需要定义长度
     * @type {Number}
     */
    this.length = 32;

    /**
     * 默认值，默认值为undefined，即不设置
     * @type {[type]}
     */
    this.defaultVar = undefined;

    /**
     * 是否为主键
     * @type {Boolean}
     */
    this.isPrimaryKey = false;

    /**
     * 是否为非空，默认为true，即全部都是必填字段
     * @type {Boolean}
     */
    this.isNotNull = true;

    /**
     * 是否为自增，一般而言，只有主键才是会自增的，默认为false
     * @type {Boolean}
     */
    this.isAutoIncrease = false;

    /**
     * 是否为唯一值（不重复），默认为false，即不需要数据库约束该字段唯一性
     * @type {Boolean}
     */
    this.isUnique = false;

    /**
     * 外键配置，如果不为null，则说明有外键配置
     * @type {Object}
     */
    this.foreignKeyConfig = undefined;

    /**
     * 属性，目前用得到的值主要为 UNSIGNED
     * @type {[type]}
     */
    this.property = undefined;

    /**
     * 注释
     * @type {[type]}
     */
    this.comment = undefined;
}

/**
 * 获得主键类型的默认配置
 */
function getDefaultPrimaryKey() {
    return _.assign(new ConfigDb(), {
        isPrimaryKey: true,
        isAutoIncrease: true,
        type: 'int',
        length: 11,
        property: 'UNSIGNED'
    });
}

/**
 * 获得普通字符串的默认配置
 * @param {boolean} required 是否为必须填写的字段
 */
function getDefaultString(required) {
    return _.assign(new ConfigDb(), {
        // defaultVar: '',
        isNotNull: !!required
    });
}

/**
 * 获得"状态"的默认配置
 */
function getDefaultState() {
    return _.assign(new ConfigDb(), {
        type: 'int',
        length: 1,
        defaultVar: '-1',
        comment: '数据有效性，-1:无效，1:有效'
    });
}

/**
 * 获得"时间"的默认配置，比如创建时间、更新时间等
 */
function getDefaultTime() {
    return _.assign(new ConfigDb(), {
        type: 'datetime',
        length: 0 // 注意：对datetime类型而言，length没有任何意义
    });
}

/**
 * 获得"r日期"的默认配置，比如生日等等
 */
function getDefaultDate() {
    return _.assign(new ConfigDb(), {
        type: 'date',
        length: 0 // 注意：对date类型而言，length没有任何意义
    });
}

/**
 * 获得"备注"的默认配置
 */
function getDefaultMark() {
    return _.assign(new ConfigDb(), {
        length: 127,
        defaultVar: ''
    });
}

module.exports = {
    getDefaultPrimaryKey: getDefaultPrimaryKey,
    getDefaultString: getDefaultString,
    getDefaultState: getDefaultState,
    getDefaultTime: getDefaultTime,
    getDefaultDate: getDefaultDate,
    getDefaultMark: getDefaultMark
}
