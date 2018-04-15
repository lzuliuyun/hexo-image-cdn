## 说明
上传文章中的图片到七牛云，并在生成静态资源时，统一替换图片引用路径为cdn路径。
该插件基于`hexo-deployer-qiniu`修改，个人觉得添加qnimg标签太麻烦，与原生markdown语法不自然，感觉很鸡肋，因此删减了大部分功能，仅保留文件上传的部分。

## 使用
1. 安装命令
```
npm install hexo-image-cdn --save
```

2. `_config.yml`添加如下配置
```
##七牛云存储设置
##zone          对象存储所在区 https://developer.qiniu.com/kodo/manual/1671/region-endpoint
##bucket        空间名称
##access_key    上传密钥AccessKey
##secret_key    上传密钥SecretKey
##sync_dir      上传目录，默认上传: public/*，填写后上传: public/qiniu_dir(包含qiniu_dir目录本身)
##prefix        静态文件访问的前缀，例如：http://7xo6lp.com1.z0.glb.clouddn.com/images/用于标签解析解析
##extend        用于生成缩略图或加水印等操作的参数。具体请参考https://developer.qiniu.com/dora/manual/3683/img-directions-for-use
qiniu:
  zone: ***
  bucket: ***
  access_key: ***
  secret_key: ***
  sync_dir:  images
  prefix: ***
  extend: ***
```
3. 生成命令
```
hexo g cdn
```

## 引用
* hexo: https://github.com/lzuliuyun/hexo-image-cdn
* qiniu: http://www.qiniu.com/
* hexo-deployer-qiniu: https://github.com/ronesam/hexo-deployer-qiniu
* hexo-qiniu-sync: https://github.com/gyk001/hexo-qiniu-sync
