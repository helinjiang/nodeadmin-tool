var BaseModel = require('common/crudmodel');

class Model extends BaseModel {

}

<%
var map = {};

fieldData.forEach(function(item) {
    var obj = _.merge({}, item);

    // 不需要db字段信息
    delete obj.db;

    map[item.fieldName] = obj;
});

%>

var fieldDefine =<%= JSON.stringify(map) %>;


module.exports = new Model(fieldDefine);
