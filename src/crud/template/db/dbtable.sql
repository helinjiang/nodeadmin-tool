-- ----------------------------
-- Table structure for <%= tableFullName %>
-- ----------------------------
DROP TABLE IF EXISTS `<%= tableFullName %>`;
CREATE TABLE `<%= tableFullName %>` (
    <%
        var resultArr = [], primaryKey;
        fieldData.forEach(function(item){
            if(!item.db){
                return;
            }

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
            resultArr.push(arr.join(' '));
        })
    %>
  <%= resultArr.join(',\n') %>,
  PRIMARY KEY (`<%= primaryKey %>`) 

) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of <%= tableFullName %>
-- ----------------------------