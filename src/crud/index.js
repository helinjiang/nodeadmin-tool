var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var beautify = require('js-beautify').js_beautify;
var walkSync = require('walk-sync');

/**
 * 遍历某路径下所有的文件。
 * @param {string} paths 路径
 * @return {function} 回调，接收一个参数item: {basePath,relativePath,size,mtime,mode}
 * Entry {
  relativePath: 'decodeURI.html',
  basePath: 'G:/991.git/oschina/local-html-project/api/javascript',
  mode: 33206,
  size: 1403,
  mtime: 1449528759429 }
 * @see https://www.npmjs.com/package/walk-sync
 */
function walk(paths, callback) {
    var entry = walkSync.entries(paths, {
        directories: false
    });

    entry.forEach(function(item) {
        callback(item);
    });
}

/**
 * 获得标准的data对象，同时也备份一些数据
 * @param  {string}   fullPath       初始文件的路径
 * @param  {string}   resultDataPath 要备份的文件夹
 * @return {object}                  标准化之后的data对象
 */
function getStandardData(fullPath, resultDataPath) {
    var fileName = path.basename(fullPath, path.extname(fullPath));
    if (!fileName) {
        return null;
    }

    // 原始的data.js的内容，将其备份一份
    var configDataContent = fs.readFileSync(fullPath, 'utf8'),
        configDataSavePath = path.join(resultDataPath, fileName, 'data_bak.js');

    save(configDataSavePath, configDataContent);

    // 计算之后的data数据，也将其备份一份
    var initData = require(fullPath),
        initDataSavePath = path.join(resultDataPath, fileName, 'data_init.js');

    save(initDataSavePath, beautify(JSON.stringify(initData)));

    // 标准化的data数据，也将其备份一份
    var config2standard = require('./lib/config2standard'),
        data = config2standard.getStandardData(initData),
        dataSavePath = path.join(resultDataPath, fileName, 'data.js');

    save(dataSavePath, beautify(JSON.stringify(data)));

    return data;
}


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

/**
 * 处理函数
 * @param  {string}   basePath 根目录
 */
function deal(basePath) {
    var BASE_PATH = basePath,
        DATA_BASE_PATH = path.join(BASE_PATH, 'data'),
        TEMPLATE_BASE_PATH = path.join(BASE_PATH, 'template'),
        RESULT_BASE_PATH = path.join(BASE_PATH, 'result'),
        RESULT_SRC_PATH = path.join(RESULT_BASE_PATH, 'src'),
        RESULT_CLIENTSRC_PATH = path.join(RESULT_BASE_PATH, 'clientsrc'),
        RESULT_DATA_PATH = path.join(RESULT_BASE_PATH, 'data'),
        MODULE = 'admin';

    // 遍历data中的文件并依次处理
    walk(DATA_BASE_PATH, function(item) {
        // console.log(item);
        var data = getStandardData(path.join(item.basePath, item.relativePath), RESULT_DATA_PATH);
        if (!data) {
            return;
        }

        // page的结果文件夹
        var RESULT_PAGE_PATH = path.join(RESULT_CLIENTSRC_PATH, 'pages', data.sysNameEn + '_index');

        // 要处理的数组
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
        }, {
            from: path.join(TEMPLATE_BASE_PATH, 'db/dbtable.sql'),
            to: path.join(RESULT_DATA_PATH, path.basename(item.relativePath, path.extname(item.relativePath)), 'dbtable.sql'),
            data: data
        }];

        // 依次处理
        arr.forEach(function(item) {
            saveTo(item.from, item.to, item.data);
        });
    });
}

// 执行
deal('D:/code/nodeadmin-tool/src/crud');
