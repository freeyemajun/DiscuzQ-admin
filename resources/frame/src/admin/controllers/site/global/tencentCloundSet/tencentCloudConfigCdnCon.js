/**云API配置 */
import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';

export default {
  data:function () {
    return {
      accelerateData:'',
      originAddress:'',
      sourceHost: '',
      subLoading: false,
      mainDomain: '',
      purgeCdnLoading: false
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
          this.accelerateData = forumData.qcloud.qcloudCdnSpeedDomain;
          this.mainDomain = forumData.qcloud.qcloudCdnMainDomain
          const num = forumData.qcloud.qcloudCdnOrigins || [];
          let text = '';
          num.forEach(item => {
            text += `${item}\n`
          });
          this.originAddress = text;
          this.sourceHost = forumData.qcloud.qcloudCdnServerName;
        }
      })
    },
    submitClick(){
      this.subLoading = true;
      let originAddressArr = [];
      if (this.originAddress) {
        let lines = this.originAddress.split(/\n/);
        for (var j = 0; j < lines.length; j++) {
          if (lines[j].trim() !== '') {
            originAddressArr.push(lines[j].trim());
          }
        }
      }
      this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
          "data":[
            {
              "key":'qcloud_cdn_speed_domain',
              "value":this.accelerateData,
              "tag": "qcloud"
            },
            {
              "key":'qcloud_cdn_origins',
              "value": originAddressArr,
              "tag": "qcloud",
            },
            {
              "key":'qcloud_cdn_server_name',
              "value":this.sourceHost,
              "tag": "qcloud",
            },
            {
              "key":'qcloud_cdn_main_domain',
              "value":this.mainDomain,
              "tag": "qcloud",
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
    purgeCdnClick() {
      this.purgeCdnLoading = true;
      this.appFetch({
        url:'purge_cdn_get_v3',
        method:'get',
        data:{}
      })
      .then(res => {
        this.purgeCdnLoading = false;
        if(res.errors){
          this.$message.error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message({ message: 'cdn缓存清除完毕', type: 'success' });
        }
      })
      .catch(err => {
        this.purgeCdnLoading = false;
        this.$message({
          showClose: true,
          message: err
        });
      })
    }
  },
  components:{
    Card,
    CardRow
  }
}