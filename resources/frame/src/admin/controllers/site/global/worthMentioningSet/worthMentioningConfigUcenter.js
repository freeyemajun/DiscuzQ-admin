import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';

export default {
  data:function () {
    return {
      valueAppid: '',
      valueUrl: '',
      valueKey: '',
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
        } else {
          if (data.Code !== 0) {
            this.$message.error(data.Message);
            return
          }
          const {Data: forumData} = data;
          this.valueKey = forumData.ucenter.ucenterKey;
          this.valueUrl = forumData.ucenter.ucenterUrl;
          this.valueAppid = forumData.ucenter.ucenterAppid;
        }
      })
    },
    submitConfiguration(){
      this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
          "data":[
            {
              "key":"ucenter_appid",
              "value":this.valueAppid,
              "tag": 'ucenter'
           },
            {
              "key":"ucenter_url",
              "value":this.valueUrl,
              "tag": 'ucenter'
            },
            {
              "key":"ucenter_key",
              "value":this.valueKey,
              "tag": 'ucenter'
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
    }
  },
  components:{
    Card,
    CardRow
  }
}