
import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';

export default {
  data:function () {
    return {
      appId:'',
      mchId:'',
      apiKey:'',
      apiKeyV3:'',
      serialNo:'',
      appSecret:'',
      type:'',
      iOSPay: false,
      value: false,
      value2: false,
    }
  },

  created(){
    var type = this.$route.query.type;
    this.type = type;
    this.loadStatus();
  },
  methods:{
    loadStatus(){
      //初始化
      this.appFetch({
        url:'forum_get_v3',
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
          const {Data: forumData} = data;
          this.appId = forumData.paycenter.appId;
          this.mchId = forumData.paycenter.mchId;
          this.apiKey = forumData.paycenter.apiKey;
          this.apiKeyV3 = forumData.paycenter.apiKeyV3;
          this.appSecret = forumData.paycenter.appSecret;
          this.serialNo = forumData.paycenter.serialNo;
          this.iOSPay = forumData.paycenter.wxpayIos;
          this.value = forumData.paycenter.wxpayMchpayClose;
          this.value2 = forumData.paycenter.wxpayMchpayClose2;
        }
      }).catch(error=>{
      })
    },
    submitConfiguration(){

      this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
          "data":[
            {
              "key":"app_id",
              "value":this.appId,
              "tag": this.type
            },
            {
              "key":"mch_id",
              "value":this.mchId,
              "tag": this.type
            },
            {
              "key":"api_key",
              "value":this.apiKey,
              "tag": this.type
            },
            {
              "key":"app_secret",
              "value":this.appSecret,
              "tag": this.type
            },
            {
              "key":"wxpay_ios",
              "value":this.iOSPay,
              "tag": this.type
            },
            {
              "key":"wxpay_mchpay_close",
              "value":this.value,
              "tag": this.type
            },{
              "key":"wxpay_mchpay_close2",
              "value":this.value2,
              "tag": this.type
            },
            {
              "key":"apiKeyV3",
              "value":this.apiKeyV3,
              "tag": this.type
            },
            {
              "key":"serialNo",
              "value":this.serialNo,
              "tag": this.type
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
            message: '提交成功',
            type: 'success'
          });
        }
      })
    },
    openvalue(e){
      this.value2 = false
    },
    openvalue2(e){
      this.value = false
    }
  },
  components:{
    Card,
    CardRow
  }
}
