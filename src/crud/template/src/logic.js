'use strict';

/**
 * logic
 */
export default class extends think.logic.base {
    /**
     * index action logic
     * @return {} []
     */
    indexAction() {

    }

    addAction() {
        // 只允许post操作
        this.allowMethods = "post";
        <%
        var rulesRequired = [];
        fieldData.forEach(function(item) {
            if (item.moduleAdd && item.moduleAdd.show && item.validator && item.validator.required && item.validator.required.rule) {
                rulesRequired.push(item.fieldName);
            }
        });
        %>
        <% if (rulesRequired.length) { %>
        // 校验规则
        this.rules = {
            <%=rulesRequired.map((item)=>{return item+":'required'"}).join(',')%>
        };
        <% } %>
    }

    modifyAction() {
        // 只允许post操作
        this.allowMethods = "post";
        <%
        var rulesRequired = [];
        fieldData.forEach(function(item) {
            if (item.moduleModify && item.moduleModify.show && item.validator && item.validator.required && item.validator.required.rule) {
                rulesRequired.push(item.fieldName);
            }
        });
        %>
        <% if (rulesRequired.length) { %>
        // 校验规则
        this.rules = {
            <%=rulesRequired.map((item)=>{return item+":'required'"}).join(',')%>
        };
        <% } %>
    }

    deleteAction() {
        // 只允许post操作
        this.allowMethods = "post";
        <%
        var rulesRequired = [];
        fieldData.forEach(function(item) {
            if (item.moduleDelete && item.moduleDelete.show && item.moduleDelete.options && item.moduleDelete.options.deleteDepend) {
                rulesRequired.push(item.fieldName);
            }
        });
        %>
        <% if (rulesRequired.length) { %>
        // 校验规则
        this.rules = {
            <%=rulesRequired.map((item)=>{return item+":'required'"}).join(',')%>
        };
        <% } %>
    }
}
