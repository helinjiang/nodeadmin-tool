'use strict';

import BaseCrud from './basecrud.js';

export default class extends BaseCrud {
    /**
     * index action
     * @return {Promise} []
     */
    indexAction() {
        //auto render template file index_index.html
        return this.display();
    }

    /**
     * 获得数据库表 <%=tableFullName%> 中所有的<%=sysNameCn%>信息
     * 
     * @return {object} JSON 格式数据
     */
    async getdataAction() {
        // 查询数据库，获取所有的<%=sysNameCn%>信息
        let data = await this.model('<%=sysNameEn%>').order({
            id: "DESC",
        }).select();

        // 为了最后的显示，进行数据处理
        data = this.convertToDatagrid(data, item => {
            <%  // 转义date类型的数据
            var dateTypeArr = [];
            fieldData.forEach(function(item) {
                if (item.moduleDatagrid && item.moduleDatagrid.show && item.db && item.db.type == 'date') {
                    dateTypeArr.push(item);
                }
            });           
           %>
            <% if (dateTypeArr.length) { %>
                <%=dateTypeArr.map((item)=>{return ['// '+item.title, 'item.'+item.fieldName+' = this.getCurDateStr(item.'+item.fieldName+');'].join('\n')}).join('\n\n')%>
            <% } %>
            

            <%// 转义dateTime类型的数据
            var dateTimeTypeArr = [];
            fieldData.forEach(function(item) {
                if (item.moduleDatagrid && item.moduleDatagrid.show && item.db && item.db.type == 'datetime') {
                    dateTimeTypeArr.push(item);
                }
            });%>
            <% if (dateTimeTypeArr.length) { %>
                <%=dateTimeTypeArr.map((item)=>{return ['// '+item.title, 'item.'+item.fieldName+' = this.getCurTimeStr(item.'+item.fieldName+');'].join('\n')}).join('\n\n')%>
            <% } %>


            return item;
        });

        // 成功返回
        return this.success(data);
    }

    /**
     * 新增数据到数据库表 <%=tableFullName%> 中
     * 
     * @return {object} JSON 格式数据
     */
    addAction() {
        // 获取参数
        let {
            name, pwd, state, birthday
        } = this.post();

        let datetime = this.getCurTimeStr();

        pwd = think.md5('think_' + pwd);

        let record = {
            name: name,
            pwd: pwd,
            createTime: datetime,
            updateTime: datetime,
            state: state,
            birthday: birthday
        };

        let model = this.model('<%=sysNameEn%>');

        // 参数校验，在logic中已完成

        // 保存
        return this.saveToDB(model, record, {
            keyId: 'id',
            uniqueCheck: {
                name: record.name
            }
        });

    }

    /**
     * 修改数据到数据库表 <%=tableFullName%> 中
     * 
     * @return {object} JSON 格式数据
     */
    modifyAction() {
        // 获取参数
        let {
            id, name, state, birthday
        } = this.post();

        let datetime = this.getCurTimeStr();

        let record = {
            id: id,
            name: name,
            updateTime: datetime,
            state: state,
            birthday: birthday
        };

        let model = this.model('<%=sysNameEn%>');

        // 参数校验，在logic中已完成

        // 保存
        return this.saveToDB(model, record, {
            keyId: 'id'
        });

    }

    /**
     * 从数据库表 <%=tableFullName%> 中删除一条记录
     *
     * @return {object} JSON 格式数据
     */
    deleteAction() {
        // 获取参数
        let id = this.post('id');
        let model = this.model('<%=sysNameEn%>');

        // 参数校验，在logic中已完成

        // TODO 检查外键情况，查询是否有其他的数据表有用到该数据

        // 删除
        return this.deleteFromDB(model, {
            id: id
        });
    }
}
