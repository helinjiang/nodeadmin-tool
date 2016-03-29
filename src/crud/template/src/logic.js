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
        console.log('---',rulesRequired);
        %>

        <% if (rulesRequired.length){%>
        // 其他规则
        this.rules = {
            <%=rulesRequired.map((item)=>{return "name:'required'"}).join(',');
        };
        <%}%>
    }

    modifyAction() {
        // 只允许post操作
        this.allowMethods = "post";

        // 其他规则
        this.rules = {
            id: "required",
            name: "required",
            state: "required",
            birthday: "required"
        };
    }

    deleteAction() {
        // 只允许post操作
        this.allowMethods = "post";

        // 其他规则
        this.rules = {
            id: "required"
        };
    }
}
