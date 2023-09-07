
/*
* 腾讯云设置：对象存储管理器
* */

import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';

export default {
  data:function () {
    return {
      cosName:'',
      cosArea:'',
      cosDomainName:'',
      cosSignUrl: '',
      cosDocPreview: '',
    }
  },
  methods:{
    submission(){
      this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
          "data":[
            {
              "key":'qcloud_cos_bucket_name',
              "value":this.cosName,
              "tag": "qcloud"
            },
            {
              "key":'qcloud_cos_bucket_area',
              "value":this.cosArea,
              "tag": "qcloud",
            },
            {
              "key":'qcloud_cos_cdn_url',
              "value":this.cosDomainName,
              "tag": "qcloud",
            },
            {
              "key":'qcloud_cos_sign_url',
              "value":this.cosSignUrl,
              "tag": "qcloud",
            },
            {
              "key":'qcloud_cos_doc_preview',
              "value":this.cosDocPreview,
              "tag": "qcloud",
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
    },

    //接口请求
    getTencentCloudCon(){
      this.appFetch({
        url:'forum_get_v3',
        method:'get',
        data:{}
      }).then(res=>{
        if (res.errors){
          this.$message.error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          const {Data: forumData} = res;
          this.cosName = forumData.qcloud.qcloudCosBucketName;
          this.cosArea = forumData.qcloud.qcloudCosBucketArea;
          this.cosDomainName = forumData.qcloud.qcloudCosCdnUrl;
          this.cosSignUrl = forumData.qcloud.qcloudCosSignUrl;
          this.cosDocPreview = forumData.qcloud.qcloudCosDocPreview;
        }
      })
    },
  },
  created(){
    this.getTencentCloudCon();
  },
  components:{
    Card,
    CardRow
  }
}
