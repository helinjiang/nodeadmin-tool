var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var mkdirp = require('mkdirp');

var data = require('./data');

var BASE_PATH = 'D:/code/nodeadmin-tool/src/crud',
    RESULT_BASE_PATH = path.join(BASE_PATH, 'result'),
    TEMPLATE_BASE_PATH = path.join(BASE_PATH, 'template'),
    RESULT_SRC_PATH = path.join(RESULT_BASE_PATH, 'src'),
    MODULE = 'admin';


function saveTo(tplFullPath, saveFullPath) {
    var savePath = path.dirname(saveFullPath),
        content = fs.readFileSync(tplFullPath, 'utf8');

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

// saveSrcModel();
// console.log(path.relative(process.argv[1],'./template/src/model.js'));
var arr = [{
    from: path.join(TEMPLATE_BASE_PATH, 'src/model.js'),
    to: path.join(RESULT_SRC_PATH, MODULE, 'model', data.sysNameEn + '.js')
}, {
    from: path.join(TEMPLATE_BASE_PATH, 'src/logic.js'),
    to: path.join(RESULT_SRC_PATH, MODULE, 'logic', data.sysNameEn + '.js')
}];
// saveTo(path.join(TEMPLATE_BASE_PATH, 'src/model.js'), path.join(RESULT_SRC_PATH, MODULE, 'model', data.sysNameEn + '.js'));

// arr.forEach(function(item) {
//     saveTo(item.from, item.to);
// });

var fieldDefine = data.fieldDefine,
    fieldArr = Object.keys(fieldDefine);

var test =  _.template(data.sysCrumb)(data);
console.log(test);

