const fs = require('fs')
const path = require('path')

// 返回文件下所有内容，包括文件和文件夹
var dir = path.join(__dirname, './')
var inter;
var filesArr = []

fileReader(dir)

function fileReader(dir) {
  fs.readdir(dir, (erro, files) => {
    if (erro) {
      throw erro
    } else {
      // 处理异步方法二,迭代器方法
      (function iterator(i) {
        if(i == files.length) {
          // console.log(filesArr)
          return;
        }
        var theFile = files[i];
        // 判断当前是为文件夹
        var newDir = path.join(dir, theFile)
        fs.stat(newDir, (erro, stats) => {
          //       // 判断当前是为文件夹
          if(erro) {
            throw erro;
          }
          if (stats.isDirectory()) {
            fileReader(newDir)
          }else {
            if(/\.css/g.test(newDir)) {
              del(newDir)
              filesArr.push(newDir);
            }
          }
          iterator(i + 1);
        })
      })(0)
    }
  })
}
function del(dir) {
  fs.unlink(dir, (err) => {
    if(err){
      throw err
    }
    console.log('delete')
  })
}