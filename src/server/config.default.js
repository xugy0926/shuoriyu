/**
 * config
 */

var path = require('path');

var config = {

  name: '', // 社区名字
  description: '', // 社区的描述
  keywords: '',

  // 添加到 html head 中的信息
  site_headers: [
    '<meta name="xxx" content="xxx@gmail.com" />'
  ],

  site_logo: '/public/images/cnodejs_light.svg', // default is `name`
  site_icon: '/public/images/cnode_icon_32.png', // 默认没有 favicon, 这里填写网址

  // cdn host，如 http://cnodejs.qiniudn.com
  site_static_host: '', // 静态文件存储域名

  // 默认的Google tracker ID，自有站点请修改，申请地址：http://www.google.com/analytics/
  google_tracker_id: '',

  // 默认的cnzz tracker ID，自有站点请修改
  cnzz_tracker_id: '',


  app_id_pro: '56c6c309243cb728205a3dff',
  app_id_dev: '56c6c309243cb728205a3dee',

  session_secret: 'node_club_secret', // 务必修改
  auth_cookie_name: 'shuoriyu_site_001', // 务必修改

  mongodb_pro: 'mongodb://192.168.0.2/shuoriyu_club_product',
  mongodb_dev: 'mongodb://127.0.0.1/shuoriyu_club_test_db',

  redis_pro: {
    host: '192.168.0.3',
    port: 6379,
    db: 0,
    password: ''
  },

  redis_dev: {
    host: '127.0.0.1',
    port: 6379,
    db: 0,
    password: ''
  },

  // 话题列表显示的话题数量
  list_topic_count: 50,

  // RSS配置
  rss: {
    title: '说日语',
    link: 'http://shuoriyu.cn',
    language: 'zh-cn',
    description: 'shuoriyu：日语学习社区',
    //最多获取的RSS Item数量
    max_rss_items: 50
  },

  // 邮箱配置
  mail_opts: {
    host: 'smtp.qq.com',
    port: 25,
    auth: {
      user: 'young_xu@qq.com',
      pass: 'ydpilwnjzuqhbgcj'
    }
  },

  //weibo app key
  weibo_key: 10000000,
  weibo_id: 'your_weibo_id',

  // admin 可删除话题，编辑标签。把 user_login_name 换成你的登录名
  admins: { admin: true },

  // github 登陆的配置
  GITHUB_OAUTH: {
    clientID: 'your GITHUB_CLIENT_ID',
    clientSecret: 'your GITHUB_CLIENT_SECRET',
    callbackURL: 'http://cnodejs.org/auth/github/callback'
  },
  // 是否允许直接注册（否则只能走 github 的方式）
  allow_sign_up: true,

  // oneapm 是个用来监控网站性能的服务
  oneapm_key: '',

  // 下面两个配置都是文件上传的配置

  // 7牛的access信息，用于文件上传
  qn_access: {
    accessKey: 'hwRpmKTAHOo3OpJBmKuL6VwqsGV5oHZ8DMffohHk',
    secretKey: 'kE51DWulIo8M0dyqIRZh8uQZ7FPTVtN3_m1EO82j',
    bucket: 'speak-japanese',
    origin: 'http://qiniu.shuoriyu.cn',
    // 如果vps在国外，请使用 http://up.qiniug.com/ ，这是七牛的国际节点
    // 如果在国内，此项请留空
    uploadURL: '',
  },

  // 文件上传配置
  // 注：如果填写 qn_access，则会上传到 7牛，以下配置无效
  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },

  file_limit: '1MB',

  // 极光推送
  jpush: {
    appKey: 'YourAccessKeyyyyyyyyyyyy',
    masterSecret: 'YourSecretKeyyyyyyyyyyyyy',
    isDebug: false,
  },

  create_post_per_day: 1000, // 每个用户一天可以发的主题数
  create_reply_per_day: 1000, // 每个用户一天可以发的评论数
  visit_per_day: 1000, // 每个 ip 每天能访问的次数
};

module.exports = config;
