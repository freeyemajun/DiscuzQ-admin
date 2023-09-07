/**云API配置 */
import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';

export default {
  data:function () {
    return {
      configAddress: '',
      configName: '',
      configPatn: '',
    }
  },
  created(){
    this.tencentCloudList()//初始化云API配置
  },
  methods:{
    tencentCloudList(){
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
          this.configAddress = forumData.qcloud.qcloudSsrRegion;
          if (forumData.qcloud.qcloudSsrBucket) {
            this.configName = forumData.qcloud.qcloudSsrBucket.replace('discuz-ssr-', '');
          }
          this.configPatn = forumData.qcloud.qcloudSsrAccessPath;
        }
      })
    },
    submitClick(){
      this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
          "data": [
            {
              "key": "qcloud_ssr_region",
              "value": this.configAddress,
              "tag": "qcloud"
            },
            {
              "key": "qcloud_ssr_bucket",
              "value": `discuz-ssr-${this.configName}`,
              "tag": "qcloud"
            }
        ]
        }
      })
      .then(res=>{
        this.subLoading = false
        if(res.errors){
          this.$message.error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message({ message: '提交成功', type: 'success' });
          this.tencentCloudList();
        }
      })
      .catch(err => {
        this.subLoading = false
        this.$message({
          showClose: true,
          message: err
        });
      })
    },
  },
  components:{
    Card,
    CardRow
  }
}