## 说明
上传文章中的图片到七牛云，并在生成静态资源时，统一替换图片引用路径为cdn路径。
该插件基于`hexo-deployer-qiniu`修改，个人觉得添加qnimg标签太麻烦，与原生markdown语法不自然，感觉很鸡肋，因此删减了大部分功能，仅保留文件上传的部分。
## 使用
### 安装命令
```
npm install hexo-image-cdn --save
```
### `_config.yml`添加如下配置
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
### 修改node-qiniu包中qiniu.js文件中的配置（如果该问题已经修改好，则不用修改）
![](/images/eaf62561-250b-4219-a11c-c3cf8b0eb11b.png)
### 生成命令
使用前，先清除目录。如果想在本地服务查看cdn使用，执行以下两个命令，再发布即可。如果本地执行的是hexo g, 那发布前先执行下面两条命令。
之所以这样，是因为在生成的阶段处理图片链接的。
```
hexo clean
hexo g cdn
```
说明： hexo g cdn 命令新加了cdn参数。
## 引用
* hexo: https://github.com/lzuliuyun/hexo-image-cdn
* qiniu: http://www.qiniu.com/
* hexo-deployer-qiniu: https://github.com/ronesam/hexo-deployer-qiniu
* hexo-qiniu-sync: https://github.com/gyk001/hexo-qiniu-sync
