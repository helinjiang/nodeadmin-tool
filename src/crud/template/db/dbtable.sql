-- ----------------------------
-- Table structure for <%= tableFullName %>
-- ----------------------------
DROP TABLE IF EXISTS `<%= tableFullName %>`;
CREATE TABLE `<%= tableFullName %>` (
    <%
        var fieldDefineArr = [], primaryKey,uniqueArr=[],resultArr=[];
        fieldData.forEach(function(item){
            if(!item.db){
                return;
            }

            // TODO 可能有多主键的场景
            if (item.db.isPrimaryKey){
                primaryKey = item.db.fieldName;
            }

            var arr = [];
            arr.push('`'+item.db.fieldName+'`');

            if (['int', 'varchar', 'char'].indexOf(item.db.type) > -1){
                arr.push(item.db.type + '(' +item.db.length + ')');

                if (item.db.isPrimaryKey){
                    arr.push('unsigned');
                }
            } else {
                arr.push(item.db.type);
            }

            if (item.db.isNotNull){
                arr.push('NOT NULL');
            }

            if (item.db.isAutoIncrease){
                arr.push('AUTO_INCREMENT');
            }

            // TODO isUnique
            if (typeof item.db.defaultVar !== 'undefined'){
                if (typeof item.db.defaultVar === 'string'){
                    arr.push("DEFAULT '" + item.db.defaultVar + "'");
                }else {
                    arr.push('DEFAULT ' + item.db.defaultVar);
                }                
            }

            if(item.db.comment){
                arr.push("COMMENT '" + item.db.comment + "'");
            }
            fieldDefineArr.push(arr.join(' '));

            if (item.db.isUnique){
                uniqueArr.push('UNIQUE KEY `'+item.db.fieldName+'` (`'+item.db.fieldName+'`)');
            }
        })

        resultArr.push(fieldDefineArr.join(',\n'));
        resultArr.push('PRIMARY KEY (`'+ primaryKey + '`) ');
        if (uniqueArr.length){
            resultArr.push(uniqueArr.join(',\n'));
        }
        
    %>
  <%= resultArr.join(',\n') %>

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of <%= tableFullName %>
-- ----------------------------