# efadmin-ui
基于eladmin-web改造增强的项目
基于2019-07-04的[定时任务加入漏掉的新增与编辑dialog]节点

20191227同步至eladmin-web的20191224的[:bookmark: v2.4 优化]节点

# 本项目与eladmin-web的主要差异
```
1.列表头支持后端排序; --已完成
2.支持捕捉后端的业务逻辑错误--R对象内; --已完成
3.支持高级搜索功能;  --已完成
4.支持国际化:前端的界面及后端的接口; --已完成
5.支持多租户模式，不同租户独立的数据库和Redis数据库; --已完成 2.1.0+
6.修正了一些eladmin-web的已发现的问题;  --持续进行
```

#### 项目源码

|        | 后端源码                                 | 前端源码                                    |
|:-------|:----------------------------------------|:-------------------------------------------|
| github | https://github.com/vip-efactory/efadmin | https://github.com/vip-efactory/efadmin-ui |
| gitee  | https://gitee.com/vip-efactory/efadmin  | https://gitee.com/vip-efactory/efadmin-ui  |

#### 体验地址
##### 管理多租户,可以管理其他租户的数据源  
因阿里云服务器宽带仅1M,即理论最大128K/s文件传输速度,因此登录可能会慢一些，请知悉。  
<https://efadmin.ddbin.com/>  
用户名密码：root/123456

注意:因为下面两个租户的https证书使用的是efadmin.ddbin.com的，所以访问时，浏览器会说证书无效，信任即可!
##### 租户1
<https://t1.ddbin.com/>  
用户名密码：admin1/123456
##### 租户2
<https://t2.ddbin.com/>  
用户名密码：admin2/123456

#### 文档说明
<http://docs.efactory.vip/>

#### Build Setup
``` bash
# 安装依赖
npm install

# 启动服务 localhost:8013
npm run dev

# 构建生产环境
npm run build
```

#### 项目图片展示

![image](https://gitee.com/vip-efactory/efadmin-ui/raw/master/public/proj_imgs/zh_Login.png)

![image](https://gitee.com/vip-efactory/efadmin-ui/raw/master/public/proj_imgs/switch_lang_Login.png)

![image](https://gitee.com/vip-efactory/efadmin-ui/raw/master/public/proj_imgs/en_Login.png)

![image](https://gitee.com/vip-efactory/efadmin-ui/raw/master/public/proj_imgs/zh_main.png)

![image](https://gitee.com/vip-efactory/efadmin-ui/raw/master/public/proj_imgs/en_main.png)

![image](https://gitee.com/vip-efactory/efadmin-ui/raw/master/public/proj_imgs/en_employee.png)

![image](https://gitee.com/vip-efactory/efadmin-ui/raw/master/public/proj_imgs/i18n_zh_api.png)

![image](https://gitee.com/vip-efactory/efadmin-ui/raw/master/public/proj_imgs/i18n_en_api.png)


#### 反馈交流

- QQ交流群：601693868


