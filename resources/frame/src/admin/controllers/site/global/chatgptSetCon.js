
import Card from '../../../view/site/common/card/card';
import CardRow from '../../../view/site/common/card/cardRow';

export default {
  data:function () {
    return {
      fandaiurl:'',
      hosturl:'',
      airenge:'',
      apikey:'',
      model:'',
      aicid:0,
      aiuid:0,
      aiusername:'',
      aipassword:'',
      callai:false,
      offiaccount:false,
      offiaccount_close:false,
      revoice:false,
    }
  },
  created(){
    this.annexSet()
  },
  methods:{
    openoff(e) {
      console.log(e)
      if(!this.offiaccount_close){
        this.$message.error('请先开启公众号配置');
        this.offiaccount = false
        return;
      }
    },
    openrevoice(e) {
      console.log(e)
      if(!this.offiaccount_close){
        this.$message.error('请先开启公众号配置并开通腾讯云语音合成服务');
        this.revoice = false
        return;
      }
    },
    annexSet() {
      this.appFetch({
        url: 'forum_get_v3',
        method: 'get',
        data: {}
      }).then(res => {
        if (res.errors) {
          this.$message.error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          const {Data: forumData} = res;
          this.fandaiurl = forumData.setChatgpt.fandaiurl;
          this.hosturl = forumData.setChatgpt.hosturl;
          this.aicid = forumData.setChatgpt.aicid;
          this.aiuid = forumData.setChatgpt.aiuid;
          this.aiusername = forumData.setChatgpt.aiusername;
          this.aipassword = forumData.setChatgpt.aipassword;
          this.callai = forumData.setChatgpt.callai;
          this.airenge = forumData.setChatgpt.airenge;
          this.apikey = forumData.setChatgpt.apikey;
          this.model = forumData.setChatgpt.model;
          this.offiaccount = forumData.setChatgpt.offiaccount;
          this.revoice = forumData.setChatgpt.revoice;
          this.offiaccount_close = forumData.passport.offiaccountOpen;
        }
      })
    },

    changeModel(model){
      this.model = model;
    },

    submi() {
      var fandaiurl = this.fandaiurl;
      var hosturl = this.hosturl;
      var aicid = this.aicid;
      var aiuid = this.aiuid;
      var aiusername = this.aiusername;
      var aipassword = this.aipassword;
      var callai = this.callai;
      var airenge = this.airenge;
      var apikey = this.apikey;
      var model = this.model;

      if (!fandaiurl) {
        this.$message.error('请配置反代');
        return
      }

      if (!hosturl) {
        this.$message.error('请配置自己的网站地址');
        return
      }

      if (!apikey) {
        this.$message.error('请配置OpenApiKey');
        return
      }

      if (!aicid) {
        this.$message.error('请配置分类id');
        return
      }

      if (!aiuid) {
        this.$message.error('请配置AI的uid');
        return
      }

      if (!aiusername) {
        this.$message.error('请配置AI的用户名');
        return
      }

      if (!aipassword) {
        this.$message.error('请配置AI的用户密码');
        return
      }

      if (!airenge) {
        this.$message.error('请配置AI的人格');
        return
      }

      this.appFetch({
        url: 'settings_post_v3',
        method: 'post',
        data: {
          "data": [
            {
              "key": 'fandaiurl',
              "value": this.fandaiurl,
              "tag": "chatgpt"
            },
            {
              "key": 'hosturl',
              "value": this.hosturl,
              "tag": "chatgpt"
            },
            {
              "key": 'aicid',
              "value": this.aicid,
              "tag": "chatgpt",
            },
            {
              "key": 'aiuid',
              "value": this.aiuid,
              "tag": "chatgpt",
            },
            {
              "key": 'aiusername',
              "value": this.aiusername,
              "tag": "chatgpt",
            },
            {
              "key": 'aipassword',
              "value": this.aipassword,
              "tag": "chatgpt",
            },
            {
              "key": 'callai',
              "value": this.callai,
              "tag": "chatgpt",
            },
            {
              "key": 'apikey',
              "value": this.apikey,
              "tag": "chatgpt",
            },
            {
              "key": 'airenge',
              "value": this.airenge,
              "tag": "chatgpt",
            },
            {
              "key": 'model',
              "value": this.model,
              "tag": "chatgpt",
            },
            {
              "key": 'offiaccount',
              "value": this.offiaccount,
              "tag": "chatgpt",
            },
            {
              "key": 'revoice',
              "value": this.revoice,
              "tag": "chatgpt",
            },
          ]
        }
      }).then(res => {
        if (res.errors) {
          if (res.errors[0].detail) {
            this.$message.error(res.errors[0].code + '\n' + res.errors[0].detail[0])
          } else {
            this.$message.error(res.errors[0].code);
          }
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message({ message: '提交成功', type: 'success' });
        }
      })
    }
  },
  components:{
    Card,
    CardRow
  }
}
