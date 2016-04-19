var Vue = require('lib/vue');

var Model = require('../model');
var mixinsIndexModal = require('mixins/modal/crudindex/main');

module.exports = Vue.extend({
    template: __inline('main.html'),
    data: function() {
        return {
            moduleName: '<%=sysNameCn%>',
            moduleCgiBase: '/<%=sysModuleName%>/<%=sysNameEn%>'
        }
    },
    mixins: [mixinsIndexModal],
    methods: {
        beforeShowDataGrid: function() {
            this.datagridTitle = this.moduleName + '列表';
            this.datagridCgi = this.moduleCgiBase + '/getdata';

            this.datagridItem = Model.getDatagridItem([{
                name: 'id',
                title: '操作',
                render: 'commonOperate | detail modify delete',
                disableorder: true
            }]);
        },
        beforeShowAddPage: function() {
            this.modalTitle = '新增' + this.moduleName;
            this.modalCgi = this.moduleCgiBase + '/add';

            this.modalFieldDefine = Model.getAddFieldDefine();
        },
        beforeShowModifyPage: function(data) {
            this.modalTitle = '修改' + this.moduleName;
            this.modalCgi = this.moduleCgiBase + '/modify';

            this.modalFieldDefine = Model.getModifyFieldDefine();
        },
        beforeShowDetailPage: function(data) {
            this.modalTitle = '查看' + this.moduleName;

            this.modalFieldDefine = Model.getDetailFieldDefine();
        },
        beforeShowDeletePage: function(data) {
            this.modalTitle = '删除' + this.moduleName;
            this.modalCgi = this.moduleCgiBase + '/delete';

            this.modalFieldDefine = Model.getDeleteFieldDefine();
        },
    },
    ready: function() {

    }
});