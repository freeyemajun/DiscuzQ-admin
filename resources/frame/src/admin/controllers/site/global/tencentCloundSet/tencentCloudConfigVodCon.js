import Card from "../../../../view/site/common/card/card";
import CardRow from "../../../../view/site/common/card/cardRow";

export default {
  data: function() {
    return {
      vodTranscode: "", // 转码模板
      vodWatermark: "", // 水印模板ID
      vodExt: "",
      vodSize: "", // 短信签名
      subApplication: "", // 子应用
      screenshot: "", // 截图模版
      vodTaskflowGif: "", // 动图封面任务流名称
      vodUrlKey: "", // 云点播防盗链
      vodUrlExpire: "", // 云点播防盗链签名有效期
      vodToken: "", // 云点播回调校验码
      videoDemand: false,
    };
  },
  created() {
    var type = this.$route.query.type;
    this.type = type;
    this.tencentCloudSms();
  },
  methods: {
    tencentCloudSms() {
      this.appFetch({
        url: 'forum_get_v3',
        method: "get",
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
          this.vodTranscode = forumData.qcloud.qcloudVodTranscode;
          this.vodWatermark = forumData.qcloud.qcloudVodWatermark;
          this.vodExt = forumData.qcloud.qcloudVodExt;
          this.vodSize = forumData.qcloud.qcloudVodSize;
          this.subApplication = forumData.qcloud.qcloudVodSubAppId;
          this.screenshot = forumData.qcloud.qcloudVodCoverTemplate;
          this.vodTaskflowGif = forumData.qcloud.qcloudVodTaskflowGif;
          this.vodUrlKey = forumData.qcloud.qcloudVodUrlKey;
          this.vodUrlExpire = forumData.qcloud.qcloudVodUrlExpire;
          this.vodToken = forumData.qcloud.qcloudVodToken;
          this.videoDemand = forumData.qcloud.qcloudVodAutoPlay;
        }
      });
    },
    Submission() {
      if (this.vodTranscode === "") {
        this.$message("请填写转码模板");
        return;
      }
      this.appFetch({
        url: "settings_post_v3",
        method: "post",
        data: {
          data: [
            {
              key: "qcloud_vod_sub_app_id",
              value: this.subApplication,
              tag: "qcloud"
            },
            {
              key: "qcloud_vod_transcode",
              value: this.vodTranscode,
              tag: "qcloud"
            },
            {
              key: "qcloud_vod_watermark",
              value: this.vodWatermark,
              tag: "qcloud"
            },
            {
              key: "qcloud_vod_cover_template",
              value: this.screenshot,
              tag: "qcloud"
            },
            {
              key: "qcloud_vod_ext",
              value: this.vodExt,
              tag: "qcloud"
            },
            {
              key: "qcloud_vod_size",
              value: this.vodSize,
              tag: "qcloud"
            },
            {
              key: "qcloud_vod_taskflow_gif",
              value: this.vodTaskflowGif,
              tag: "qcloud"
            },
            {
              key: "qcloud_vod_url_key",
              value: this.vodUrlKey,
              tag: "qcloud"
            },
            {
              key: "qcloud_vod_url_expire",
              value: this.vodUrlExpire,
              tag: "qcloud"
            },
            {
              key: "qcloud_vod_token",
              value: this.vodToken,
              tag: "qcloud"
            },
            {
              key: "qcloud_vod_auto_play",
              value: this.videoDemand,
              tag: "qcloud"
            }
          ]
        }
      }).then(res => {
        if (res.errors) {
          this.$message.error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message({ message: "提交成功", type: "success" });
          this.tencentCloudSms(); //提交成功后获取新数据
        }
      });
    }
  },
  components: {
    Card,
    CardRow
  }
};
