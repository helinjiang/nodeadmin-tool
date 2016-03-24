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

function saveSrcModel() {
    var savePath = path.join(RESULT_SRC_PATH, MODULE, 'model'),
        saveFileName = data.sysNameEn + '.js',
        saveFullPath = path.join(savePath, saveFileName),
        tplFullPath =  path.join(TEMPLATE_BASE_PATH, 'src/model.js'),
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

saveSrcModel();
// console.log(path.relative(process.argv[1],'./template/src/model.js'));
