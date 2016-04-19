var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var beautify = require('js-beautify').js_beautify;

var BASE_PATH = 'D:/code/nodeadmin-tool/src/crud',
    RESULT_BASE_PATH = path.join(BASE_PATH, 'result'),
    TEMPLATE_BASE_PATH = path.join(BASE_PATH, 'template'),
    RESULT_SRC_PATH = path.join(RESULT_BASE_PATH, 'src'),
    RESULT_CLIENTSRC_PATH = path.join(RESULT_BASE_PATH, 'clientsrc'),
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
        tplData._ = _;
        content = _.template(content)(tplData);
    }

    if (path.extname(saveFullPath) == '.js') {
        // 使用js-beautify美化js文件
        content = beautify(content);

        // 如果有多个连续的换行，则保持一个即可
        content = content.replace(/\n[\s|.]*\r/g, '\n\r');
    }

    // 保存
    save(saveFullPath, content);
}

var RESULT_PAGE_PATH = path.join(RESULT_CLIENTSRC_PATH, 'pages', data.sysNameEn + '_index');

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
}, {
    from: path.join(TEMPLATE_BASE_PATH, 'src/controller.js'),
    to: path.join(RESULT_SRC_PATH, MODULE, 'controller', data.sysNameEn + '.js'),
    data: data
}, {
    from: path.join(TEMPLATE_BASE_PATH, 'client/model.js'),
    to: path.join(RESULT_PAGE_PATH, 'model.js'),
    data: data
}, {
    from: path.join(TEMPLATE_BASE_PATH, 'client/main.html'),
    to: path.join(RESULT_PAGE_PATH, 'main.html'),
    data: data
}, {
    from: path.join(TEMPLATE_BASE_PATH, 'client/main.js'),
    to: path.join(RESULT_PAGE_PATH, 'main.js'),
    data: data
}, {
    from: path.join(TEMPLATE_BASE_PATH, 'client/main.scss'),
    to: path.join(RESULT_PAGE_PATH, 'main.scss'),
    data: data
}, {
    from: path.join(TEMPLATE_BASE_PATH, 'client/mainarea/main.html'),
    to: path.join(RESULT_PAGE_PATH, 'mainarea/main.html'),
    data: data
}, {
    from: path.join(TEMPLATE_BASE_PATH, 'client/mainarea/main.js'),
    to: path.join(RESULT_PAGE_PATH, 'mainarea/main.js'),
    data: data
}, {
    from: path.join(TEMPLATE_BASE_PATH, 'client/mainarea/main.scss'),
    to: path.join(RESULT_PAGE_PATH, 'mainarea/main.scss'),
    data: data
}];

arr.forEach(function(item) {
    saveTo(item.from, item.to, item.data);
});
