
var fs = require("fs");
var path = require("path");
 
deleteFolderRecursive = function(url) {
    var files = [];
    //判断给定的路径是否存在
    if(fs.existsSync(url) ) {
        //返回文件和子目录的数组
        files = fs.readdirSync(url);
         
        files.forEach(function(file,index){
           // var curPath = url + "/" + file;
            var curPath = path.join(url,file);
            //fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
                 
            // 是文件delete file  
            } else {
                fs.unlinkSync(curPath);
            }
        })
        fs.rmdirSync(url);
    }else{
        console.log("给定的路径不存在，请给出正确的路径");
    }
};
deleteFolderRecursive('./temp')

const rootDir = './build/dist'
if (fs.existsSync(rootDir)) {
    deleteFolderRecursive(rootDir)
}
fs.mkdirSync(rootDir)
fs.mkdirSync(rootDir + '/build')
fs.copyFile('./package.json',rootDir + '/package.json',function(err){
	if(err) console.log('something wrong was happened')
	else console.log('copy file succeed');
})
fs.copyFile('./build/index.js',rootDir + '/build/index.js',function(err){
	if(err) console.log('something wrong was happened')
	else console.log('copy file succeed');
})
