-- ----------------------------
-- Table structure for <%= tableFullName %>
-- ----------------------------
DROP TABLE IF EXISTS `<%= tableFullName %>`;
CREATE TABLE `<%= tableFullName %>` (
    <%
        var fieldDefineArr = [], 
            primaryKey,
            uniqueArr=[],
            foreignKeyArr=[],
            resultArr=[];

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

                if (item.db.property){
                    arr.push(item.db.property);
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

            // 默认值
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

            // 唯一值
            if (item.db.isUnique){
                uniqueArr.push('UNIQUE KEY `'+item.db.fieldName+'` (`'+item.db.fieldName+'`)');
            }

            // 外键
            if(item.db.foreignKeyConfig){
                var fkLength = foreignKeyArr.length,
                    fkKey = 'KEY `'+tableName+'_'+item.db.fieldName+'` (`'+item.db.fieldName+'`)',
                    fkDefine = 'CONSTRAINT `'+tableName+'_'+item.db.fieldName+'` FOREIGN KEY (`'+item.db.fieldName+'`) REFERENCES `'+item.db.foreignKeyConfig.tableName+'` (`'+item.db.foreignKeyConfig.tableFieldName+'`)';
                  
                    foreignKeyArr.splice(fkLength/2,0,fkKey);                    
                    foreignKeyArr.push(fkDefine);                
            }
        })

        resultArr.push(fieldDefineArr.join(',\n'));
        resultArr.push('PRIMARY KEY (`'+ primaryKey + '`) ');
        if (uniqueArr.length){
            resultArr.push(uniqueArr.join(',\n'));
        }

        if (foreignKeyArr.length){
            resultArr.push(foreignKeyArr.join(',\n'));
        }
        
    %>
  <%= resultArr.join(',\n') %>

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of <%= tableFullName %>
-- ----------------------------