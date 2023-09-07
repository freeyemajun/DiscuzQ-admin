
import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';

export default {
  data:function () {
    return {
      forums: '', // forum数据
      loginStatus:'default',   //default h5 applets pc
      settingStatus: [{
        name: '公众号配置',
        type: 'offiaccount_close',
        tag: 'wx_offiaccount',
        description: '用户在微信内使用微信授权登录，需配置服务号',
        status:'',
        icon:'fuwuhao'
      }, {
        name: '小程序配置',
        type:'miniprogram_close',
        tag: 'wx_miniprogram',
        description: '用户在小程序使用微信授权登录',
        status:'',
        icon:'iconxiaochengxu'
      },
    ]
    }
  },
  created:function(){
    this.loadStatus();
  },
  methods:{
    loadStatus(){
      //初始化登录设置状态
      this.appFetch({
        url:'forum_get_v3',
        method:'get',
        data:{
        }
      }).then(data=>{
        if (data.errors){
          this.$message.error(res.errors[0].code);
        }else {
          if (data.Code !== 0) {
            this.$message.error(data.Message);
            return
          }
          const {Data: forumData} = data;
          this.forums = forumData;
          this.settingStatus[0].status = (forumData.passport.offiaccountOpen != '0');
          this.settingStatus[1].status = (forumData.passport.miniprogramOpen != '0');
        }
      }).catch(error=>{
      })
    },

    configClick(type){
      if (type === 'ucenter') {
        this.$router.push({
          path:'/admin/worth-mentioning-config/ucenter',
          query: {type:type}
        });
      } else {
        this.$router.push({
          path:'/admin/worth-mentioning-config/h5wx',
          query: {type:type}
        });
      }
    },
    //修改配置状态
    loginSetting(index,type,status){
      if(status == '1') {
        if(type == 'offiaccount_close'){
          if(!this.forums.passport.offiaccountAppId || !this.forums.passport.offiaccountAppSecret){
            this.$message.error('请先填写配置再开启');
            return;
          }
        }
        if(type == 'miniprogram_close'){
          if(!this.forums.passport.miniprogramAppId || !this.forums.passport.miniprogramAppSecret){
            this.$message.error('请先填写配置再开启');
            return;
          }
        }
      }

      if (type === 'ucenter_close') {
        if (!this.forums.ucenter.ucenterAppid || !this.forums.ucenter.ucenterKey || !this.forums.ucenter.ucenterUrl){
          this.$message.error('请先填写配置再开启');
          return;
        }
      }

      if(type == 'offiaccount_close') {
        this.changeSettings('offiaccount_close',status,'wx_offiaccount');
      } else if( type == 'miniprogram_close'){
        this.changeSettings('miniprogram_close',status,'wx_miniprogram');
      } else if (type == 'ucenter_close') {
        this.changeSettings('ucenter', status == '1' ? true : false, 'ucenter');
      } else {
        if(status == '1') {
          if(!this.forums.passport.offiaccountOpen){
            this.$message.error('请先开启公众号配置');
            return;
          }
        }
        this.changeSettings('oplatform_close', status, 'wx_oplatform');
      }
    },
    //修改配置时请求接口
    changeSettings(typeVal,statusVal,TagVal){
      //登录设置状态修改
      this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
          "data":[
            {
              "key":typeVal,
              "value":statusVal,
              "tag": TagVal
            }
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
    }
  }
  ,
  components:{
    Card,
    CardRow
  }
}
