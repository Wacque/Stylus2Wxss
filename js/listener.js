const fs = require('fs')
const path = require('path')

// 返回文件下所有内容，包括文件和文件夹
var dir = path.join(__dirname, '../')
var inter
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
              filesArr.push(newDir);
              // 只执行一次watch
              wxssCreator(newDir, true)
            }
          }
          iterator(i + 1);
        })
      })(0)
    }
  })
}

function wxssCreator(dir, watch) {
  fs.readFile(dir, 'utf-8', (err,res) => {
    var cssContent = res.toString()
    var wxss = dir.replace('.css', '.wxss')
    fs.exists(wxss, (exist) => {
      fs.writeFile(wxss, cssContent, (err) => {
        console.log('changed')
        if (err) {throw err}

        if(watch) {
          fileWatch(dir)
        }

        if(inter) {
          clearInterval(inter)
        }
      })
    })
  })
}

function fileWatch(dir) {
  fs.watch(dir, { encoding: 'buffer' }, (eventType, filename) => {
    if (filename) {
      clearInterval(inter)
      inter = setInterval(_ => {
        wxssCreator(dir, false)
      }, 3000)
    }
  });
}
