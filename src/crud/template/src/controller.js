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
            <%/* 转义dateTime类型的数据*/%>
            <%   var dateTypeArr = [];
            fieldData.forEach(function(item) {
                if (item.moduleDatagrid && item.moduleDatagrid.show && item.db && item.db.type == 'date') {
                    dateTypeArr.push(item);
                }
            });           
           %>
            <% if (dateTypeArr.length) { %>
                <%=dateTypeArr.map((item)=>{return ['// '+item.title, 'item.'+item.fieldName+' = this.getCurDateStr(item.'+item.fieldName+');'].join('\n')}).join('\n\n')%>
            <% } %>


            <%/* 转义dateTime类型的数据*/%>
            <% var dateTimeTypeArr = [];
            fieldData.forEach(function(item) {
                if (item.moduleDatagrid && item.moduleDatagrid.show && item.db && item.db.type == 'datetime' && ['createTime', 'updateTime'].indexOf(item.fieldName)<0) {
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
        <% var addItemArr = [], foreinKeyArr = [], getDateTimeStr='', getPwdStr='', recordObj={};
            fieldData.forEach(function(item) {
                if (item.moduleAdd && item.moduleAdd.show) {
                    addItemArr.push(item);
                    recordObj[item.fieldName] = item.fieldName;

                    if (item.moduleAdd.options 
                        && item.moduleAdd.options.param
                        && item.moduleAdd.options.param.type 
                        &&  item.moduleAdd.options.param.type === 'password') {
                        getPwdStr = item.fieldName + " = think.md5('think_' + " + item.fieldName + ");";
                    }
                }

                // TODO 这里最好不要写死，使用配置的方式会更好
                if(item.fieldName == 'createTime'){
                    getDateTimeStr='let datetime = this.getCurTimeStr();';
                    recordObj['createTime'] = 'datetime';
                }
                if(item.fieldName == 'updateTime'){
                    getDateTimeStr='let datetime = this.getCurTimeStr();';
                    recordObj['updateTime'] = 'datetime';
                }

                // 外键
                if(item.db && item.db.foreignKeyConfig){
                    foreinKeyArr.push(item.fieldName);
                }
            });
        %>
        // 获取参数
        let {
            <%= addItemArr.map((item)=>{return item.fieldName}).join(',') %>
        } = this.post();

        <%= getDateTimeStr %>        

        <%= getPwdStr %>

        let record = {
            <%= Object.keys(recordObj).map((item)=>{return item+': '+recordObj[item]}).join(',') %>          
        }
        
        <% if (foreinKeyArr.length){%>
            // 注意，当页面端未选择时，外键的值可能会被更改为0或者undefined，必须要修改成null，否则会被数据库外键策略限制
            <%=  foreinKeyArr.map((item)=>{return 'record.'+item+'=null;'}).join('\n')%>
        <%}%>

        let model = this.model('<%=sysNameEn%>');

        // 参数校验，在logic中已完成

        <% var pStr='', pArr=[];
            if(typeof primaryKey != 'undefined'){
                pArr.push("keyId: '"+primaryKey+"'");
            }
            if(typeof uniqueArr != 'undefined' && uniqueArr.length){
                var puArr = uniqueArr.map((item)=>{return item + ': record.' + item});
                pArr.push('uniqueCheck: {'+puArr.join(',')+'}');
            }

            if(pArr.length){
                pStr = ',{'+pArr.join(',')+'}';
            }
        %>
        // 保存
        return this.saveToDB(model, record<%= pStr %>);

    }

    /**
     * 修改数据到数据库表 <%=tableFullName%> 中
     * 
     * @return {object} JSON 格式数据
     */
    modifyAction() {
        <% var modifyItemArr = [], foreinKeyArr = [], getDateTimeStr='', getPwdStr='', recordObj={};
            fieldData.forEach(function(item) {
                if (item.moduleModify && item.moduleModify.show) {
                    modifyItemArr.push(item);
                    recordObj[item.fieldName] = item.fieldName;

                    if (item.moduleModify.options 
                        && item.moduleModify.options.param
                        && item.moduleModify.options.param.type 
                        &&  item.moduleModify.options.param.type === 'password') {
                        getPwdStr = item.fieldName + " = think.md5('think_' + " + item.fieldName + ");";
                    }
                }

                if(item.fieldName == 'updateTime'){
                    getDateTimeStr='let datetime = this.getCurTimeStr();';
                    recordObj['updateTime'] = 'datetime';
                }

                // 外键
                if(item.db && item.db.foreignKeyConfig){
                    foreinKeyArr.push(item.fieldName);
                }
            });
        %>
        // 获取参数
        let {
            <%= modifyItemArr.map((item)=>{return item.fieldName}).join(',') %>
        } = this.post();

        <%= getDateTimeStr %>        

        <%= getPwdStr %>

        let record = {
            <%= Object.keys(recordObj).map((item)=>{return item+': '+recordObj[item]}).join(',') %>    
        };

        <% if (foreinKeyArr.length){%>
            // 注意，当页面端未选择时，外键的值可能会被更改为0或者undefined，必须要修改成null，否则会被数据库外键策略限制
            <%=  foreinKeyArr.map((item)=>{return 'record.'+item+'=null;'}).join('\n')%>
        <%}%>
        let model = this.model('<%=sysNameEn%>');

        // 参数校验，在logic中已完成

        <% var pStr='', pArr=[];
            if(typeof primaryKey != 'undefined'){
                pArr.push("keyId: '"+primaryKey+"'");
            }
            if(typeof uniqueArr != 'undefined' && uniqueArr.length){
                var puArr = uniqueArr.map((item)=>{return item + ': record.' + item});
                pArr.push('uniqueCheck: {'+puArr.join(',')+'}');
            }

            if(pArr.length){
                pStr = ',{'+pArr.join(',')+'}';
            }
        %>
        // 保存
        return this.saveToDB(model, record<%= pStr %>);

    }

    /**
     * 从数据库表 <%=tableFullName%> 中删除一条记录
     *
     * @return {object} JSON 格式数据
     */
    deleteAction() {
        <% var deleteItemArr = [];
            fieldData.forEach(function(item) {
                if (item.moduleDelete && item.moduleDelete.show && item.moduleDelete.options && item.moduleDelete.options.deleteDepend) {
                    deleteItemArr.push(item);
                }
            });
        %>
        // 获取参数
        <%= deleteItemArr.map((item)=>{return "let "+item.fieldName+" = this.post('"+item.fieldName+"');"}).join('') %>

        let model = this.model('<%=sysNameEn%>');

        // 参数校验，在logic中已完成

        // TODO 检查外键情况，查询是否有其他的数据表有用到该数据

        // 删除
        return this.deleteFromDB(model, {
            <%= deleteItemArr.map((item)=>{return item.fieldName+": "+item.fieldName}).join(',') %>
        });
    }
}
