var qiniuDeployer = require('./lib/deployer');

/**
 * 在文章生成之前，就替换掉所有的image图片标签为七牛云
 */
hexo.extend.filter.register('before_post_render', function(data){
  if ((process.argv.indexOf('generate') > -1 || process.argv.indexOf('g') > -1) &&  process.argv.indexOf('cdn') > -1){
      //根据配置替换路径
      var reg = /!\[(.*)\]\((.*)\)/g;
      data.content = data.content.replace(reg, '![$1](' +  prefix_url + '$2' + extend_url + ')');
      return data;
  }
});

/**
 * 在文章生成之前，就上传图片到七牛云中
 */
hexo.extend.filter.register('before_exit', function(data){
  if ((process.argv.indexOf('generate') > -1 || process.argv.indexOf('g') > -1) &&  process.argv.indexOf('cdn') > -1){
    // qiniuDeployer(hexo.config.qiniu).bind(hexo);
    qiniuDeployer.call(hexo, hexo.config.qiniu);
  }
});
