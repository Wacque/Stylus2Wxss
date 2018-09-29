const fs = require('fs')
const path = require('path')

const updateInterVal = 3000        // 更新延时
const ifLog = true                 // 是否输出日志

// 返回文件下所有内容，包括文件和文件夹
//__dirname为当前目录路径，'./'为当前目录
let dir = path.join(__dirname, './'), inter, filesArr = []

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
        let theFile = files[i];
        // 判断当前是为文件夹
        let newDir = path.join(dir, theFile)
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
    let cssContent = res.toString()
    let wxss = dir.replace('.css', '.wxss')
    fs.exists(wxss, (exist) => {
      fs.writeFile(wxss, cssContent, (err) => {
        let filenameArr = wxss.split('\\')
        let filename = filenameArr[filenameArr.length - 1]

        if(ifLog) {
          console.log(`${filename}--changed--${new Date().toLocaleString()}`)
        }

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
      }, updateInterVal)
    }
  });
}
