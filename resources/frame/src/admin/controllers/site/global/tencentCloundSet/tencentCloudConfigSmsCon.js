import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';

export default {
  data:function () {
    return {
      sdkAppId:'',
      appKey:'',
      smsId:'',
      smsSignature:'',//短信签名

    }
  },
  created(){
    var type = this.$route.query.type;
    this.type = type;
    this.tencentCloudSms()
  },
  methods:{
    tencentCloudSms(){
      this.appFetch({
        url:'forum_get_v3',
        method:'get',
        data:{}
      }).then(res=>{
        if (res.errors){
          this.$message.error(res.errors[0].code);
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          const {Data: forumData} = res;
          this.sdkAppId = forumData.qcloud.qcloudSmsAppId;
          this.appKey = forumData.qcloud.qcloudSmsAppKey;
          this.smsId = forumData.qcloud.qcloudSmsTemplateId;
          this.smsSignature = forumData.qcloud.qcloudSmsSign;
        }
      })
    },
    Submission(){
      this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
          "data":[
            {
              "key":'qcloud_sms_app_id',
              "value":this.sdkAppId,
              "tag": "qcloud"
            },
            {
              "key":'qcloud_sms_app_key',
              "value":this.appKey,
              "tag": "qcloud",
            },
            {
              "key":'qcloud_sms_template_id',
              "value":this.smsId,
              "tag": "qcloud",
            },
            {
              "key":'qcloud_sms_sign',
              "value":this.smsSignature,
              "tag": "qcloud"
            }
          ]
        }
      }).then(res=>{
        if (res.errors){
          this.$message.error(res.errors[0].code);
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message({message: '提交成功', type: 'success'});
        }
      })
    }

  },
  components:{
    Card,
    CardRow
  }
}
