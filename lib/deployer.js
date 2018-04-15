var path = require('path');
var fs = require('fs');
var qiniu = require('node-qiniu');
require('colors');

module.exports = function (args) {
  var public_dir = this.config.public_dir;
  var log = this.log;
  var sync_dir = path.join(public_dir, args.sync_dir);

  if (!args.zone || !args.bucket || !args.access_key || !args.secret_key || !fs.existsSync(sync_dir)) {
    var help = '';

    help += 'You should configure qiniu deployment settings in _config.yml first!\n\n';
    help += 'Example:\n';
    help += 'qiniu:\n';
    help += '    zone: <zone>\n';
    help += '    bucket: <bucket>\n';
    help += '    access_key: <access_key>\n';
    help += '    secret_key: <secret_key>\n';
    help += '    sync_dir: <sync_dir> # Default is public.Now is ' + sync_dir + '.\n';
    help += '    prefix: <prefix>\n';
    help += '    extend: <extend>\n';
    help += 'For more help, you can check the docs: https://github.com/lzuliuyun/hexo-image-cdn';

    console.log(help);
    return;
  }

  log.i('Now start to deploy: '.yellow + sync_dir);

  // 引入七牛 Node.js SDK
  // 设置全局参数，包括必须的 AccessKey 和 SecretKey，
  qiniu.config({
    access_key: args.access_key,
    secret_key: args.secret_key
  });

  // 获得空间对象  需要传参uploadUrl调用node-qiniu
  var images_bucket = qiniu.bucket(args.bucket, {uploadUrl: args.zone});

  /**
   * 上传文件
   * file为本地路径(绝对路径或相对路径都可)
   * name为远程文件名
   */
  var upload = function (file, name) {
    images_bucket.putFile(name, file, function (err, reply) {
      if (err || reply.error) {
        err = err || reply.error;
        log.w('Upload err: '.red + err);
        return console.error(err);
      }
      log.i('Upload finished: '.green + reply.key);
    });
  };

  /**
   * 上传前预先检查
   * file为本地路径(绝对路径或相对路径都可)
   * name为远程文件名
   */
  var check = function (file, name) {
    var res = images_bucket.key(name);
    res.stat(function (err, stat) {
      if (err) {
        log.e('get file stat err: '.cyan + name + '\n' + err);
        return;
      }

      if (stat.hash) {
        fsstat = fs.lstatSync(file);
        var ftime = new Date(fsstat.mtime).getTime()*1000;
        if (fsstat.size != stat.fsize || ftime > stat.putTime) {
          res.remove(function(err) {
            if (err) {
              return console.error(err);
            }

            log.i('Need to update file: '.yellow + name);
          });
          upload(file, name);
        } else {
          log.i('The file is exist: '.green + name);
        }
      } else {
        log.i('Need to upload file: '.yellow + name);
        upload(file, name);
      }
    });
  };

  /**
   * 遍历目录进行上传
   */
  var sync = function (dir) {
    var files = fs.readdirSync(path.join(public_dir, dir));

    files.forEach(function (file) {
      var sync_name = path.join(dir, file);
      var fname = path.join(public_dir, sync_name);
      var stat = fs.lstatSync(fname);

      if (stat.isDirectory() == true) {
        sync(sync_name);
      } else  {
        //将'\'(win默认)替换为'/'，否则七牛会认为是两个不同的文件
        check(fname, sync_name.replace(/\\/g, '/').replace(/^\//g, ''));
      }
    })
  };

  return sync(args.sync_dir);
};