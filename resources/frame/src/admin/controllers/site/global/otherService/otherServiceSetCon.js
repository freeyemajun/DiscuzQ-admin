
import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';

export default {
  data:function () {
    return {
      settingStatus:[
        {
          name: '腾讯位置服务',
          type: 'lbs_close',
          icon: 'iconweizhi1',
          description: '配置KEY后，才可使用腾讯位置的WebServiceAPI服务，<a href="https://discuz.com/manual-admin/2.html#_2-10-1-%E8%85%BE%E8%AE%AF%E4%BD%8D%E7%BD%AE%E6%9C%8D%E5%8A%A1" target="_blank">查看文档</a>',
          tag:'lbs',
          status:'',
          open: true,
        },
        {
          name: '微信小商店',
          type: 'wechat_shop',
          icon: 'icon-shangdian',
          description: '为站点关联微信小商城，实现电商盈利',
          tag:'shop',
          status:'',
          open: true,
        },
        // {
        //   name: '内容导入',
        //   type: 'import',
        //   icon: 'icon-daoru1',
        //   description: '为站点一键填充站点内容，营造活跃气氛',
        //   tag:'import',
        //   status:'',
        //   open: false,
        // },
      ],
      key: '',
      appId: '',
      shopAppId: '',
      shopTranslate: '',
      shopSecretKey: '',
    }
  },
  created:function(){
    this.loadStatus();
    this.pluginUnitList();
  },
  methods:{
    loadStatus(){
      this.appFetch({
        url:'forum_get_v3',
        method:'get',
        data:{
        }
      }).then(data=>{
        if (data.errors){
          this.$message.error(data.errors[0].code);
        }else {
          if (data.Code !== 0) {
            this.$message.error(data.Message);
            return
          }
          const {Data: forumData} = data;
          const lbsData = forumData.lbs;
          this.key = forumData.lbs.qqLbsKey;
          if (lbsData.lbs) {
            this.settingStatus[0].status = true;
          } else {
            this.settingStatus[0].status = false;
          }
        }
      })
    },
    pluginUnitList(){
      this.appFetch({
        url:'plugin_list_get_v3',
        method:'get',
        data:{}
      }).then(data=>{
        if (data.errors){
          this.$message.error(data.errors[0].code);
        }else {
          if (data.Code !== 0) {
            this.$message.error(data.Message);
            return
          }
          let num = '';
          data.Data.forEach(item => {
            if (item.name_en === 'shop') {
              num = item.setting;
              this.appId = item.app_id;
            }
          })
          this.settingStatus[1].status = num.publicValue.wxshopOpen === 1 ? true : false;
          this.shopAppId = num.publicValue.wxAppId;
          this.shopTranslate = num.publicValue.description;
          this.shopSecretKey = num.privateValue.wxAppSecret;
        }
      })
    },
    statusSetting(statusVal, tag) {
      if (tag === 'lbs') {
        this.lbsSetting(statusVal);
      }
      if (tag === 'shop') {
        this.shopSetting(statusVal)
      }
    },
    shopSetting(statusVal) {
      this.appFetch({
        url:'plugin_settings_post_v3',
        method:'post',
        data:{
          appId: this.appId,
          appName: 'wxshop',
          type:1,
          privateValue: {
            wxAppSecret: this.shopSecretKey
          },
          publicValue: {
            wxshopOpen: statusVal ? 1 : 0,
            wxAppId: this.shopAppId,
            description: this.shopTranslate,
          }
        }
      }).then(data=>{
        if (data.errors){
          this.$message.error(data.errors[0].code);
        }else {
          if (data.Code !== 0) {
            this.$message.error(data.Message);
            return
          }
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          let num = '';
          data.Data.forEach(item => {
            if (item.name_en === 'shop') {
              num = item.setting;
            }
          })
          this.settingStatus[1].status = num.publicValue.wxshopOpen === 1 ? true : false;
        }
      })
    },
    lbsSetting(statusVal){
      if(statusVal && !this.key) {
        this.$message.error('请先配置key');
        return;
      }
      //状态修改
      this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
         "data":[
            {
              "key":"lbs",
              "value":statusVal,
              "tag": 'lbs'
            },
         ]
        }
      }).then(data=>{
        if (data.errors){
          this.$message.error(data.errors[0].code);
        }else {
          if (data.Code !== 0) {
            this.$message.error(data.Message);
            return
          }
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.loadStatus();
        }
      }).catch(error=>{
        this.$message.error('修改失败');
      })
    },
    configClick(type){
      switch (type) {
        case 'lbs':
          this.$router.push({ path:'/admin/other-service-set-key', query: {type: type} });
          break;
        case 'import':
          this.$router.push({ path:'/admin/other-service-content'});
          break;
        case 'shop':
          this.$router.push({ path:'/admin/other-service-wechat-shop'});
          break;  
        default:
          break;
      }
    },
  },
  components:{
    Card,
    CardRow
  }
}
