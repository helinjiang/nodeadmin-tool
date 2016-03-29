var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var mkdirp = require('mkdirp');

var BASE_PATH = 'D:/code/nodeadmin-tool/src/crud',
    RESULT_BASE_PATH = path.join(BASE_PATH, 'result'),
    TEMPLATE_BASE_PATH = path.join(BASE_PATH, 'template'),
    RESULT_SRC_PATH = path.join(RESULT_BASE_PATH, 'src'),
    RESULT_DATA_PATH = path.join(RESULT_BASE_PATH, 'data'),
    MODULE = 'admin';

// 原始的data.js的内容，将其备份一份
var configDataContent = fs.readFileSync(path.join(BASE_PATH, 'data.js'), 'utf8'),
    configDataSavePath = path.join(RESULT_DATA_PATH, 'data_bak.js');

save(configDataSavePath, configDataContent);

// 计算之后的data数据，也将其备份一份
var initData = require('./data'),
    initDataSavePath = path.join(RESULT_DATA_PATH, 'data_init.js');

save(initDataSavePath, JSON.stringify(initData, null, 4));

// 标准化的data数据，也将其备份一份
var config2standard = require('./lib/config2standard'),
    data = config2standard.getStandardData(initData),
    dataSavePath = path.join(RESULT_DATA_PATH, 'data.js');

save(dataSavePath, JSON.stringify(data, null, 4));


/**
 * 开始拷贝
 * @param  {string}   content  内容
 * @param  {string}   saveFullPath 保存的路径
 */
function save(saveFullPath, content) {
    var savePath = path.dirname(saveFullPath);

    mkdirp(savePath, function(err) {
        if (err) {
            console.error('mkdirp error: ', savePath, err);
            return;
        }

        fs.writeFile(saveFullPath, content, (err) => {
            if (err) {
                throw err;
            }
            console.log('It\'s saved : ' + saveFullPath);
        });
    });
}

/**
 * 开始拷贝
 * @param  {string}   tplFullPath  模版
 * @param  {string}   saveFullPath 保存的路径
 */
function saveTo(tplFullPath, saveFullPath, tplData) {
    var content = fs.readFileSync(tplFullPath, 'utf8');

    if (tplData) {
        content = _.template(content)(tplData);
    }

    // 保存
    save(saveFullPath, content);
}

// saveSrcModel();
// console.log(path.relative(process.argv[1],'./template/src/model.js'));
var arr = [{
    from: path.join(TEMPLATE_BASE_PATH, 'src/model.js'),
    to: path.join(RESULT_SRC_PATH, MODULE, 'model', data.sysNameEn + '.js'),
    data: data
}, {
    from: path.join(TEMPLATE_BASE_PATH, 'src/logic.js'),
    to: path.join(RESULT_SRC_PATH, MODULE, 'logic', data.sysNameEn + '.js'),
    data: data
}];

arr.forEach(function(item) {
    saveTo(item.from, item.to);
});
