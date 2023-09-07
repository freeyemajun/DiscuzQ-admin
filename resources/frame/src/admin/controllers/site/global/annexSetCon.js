
import Card from '../../../view/site/common/card/card';
import CardRow from '../../../view/site/common/card/cardRow';

export default {
  data: function () {
    return {
      picture: '',       // 图片扩展名
      fileExtension: '', // 文件扩展名
      maximumSize: '',  // 最大尺寸
      restrictionsOn: '', // 附件限制选项
      downloads: '',
      quantityLimit: '9',
      maxUpload: 50,
    }
  },
  created() {
    this.annexSet()
  },
  methods: {
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
          this.picture = forumData.setAttach.supportImgExt;
          this.fileExtension = forumData.setAttach.supportFileExt;
          this.maximumSize = forumData.setAttach.supportMaxSize;
          this.quantityLimit = forumData.setAttach.supportMaxUploadAttachmentNum;
          this.maxUpload = forumData.setAttach.maxUploadAttachmentNum;
          if (Number(forumData.setAttach.supportMaxDownloadNum) > 0) {
            this.restrictionsOn = '2';
            this.downloads = Number(forumData.setAttach.supportMaxDownloadNum);
          } else {
            this.restrictionsOn = '1';
            this.downloads = '';
          }
        }
      })
    },
    onblurFun () {
      if (this.maximumSize > 100) {
        this.$message('最大尺寸不能超过100MB');
      }
    },
    // downloadsNumInput(value) {
    //   if (Number(value) <= 0) {
    //     this.$message.error('请输入大于0的正整数');
    //     this.downloads = '';
    //   }
    // },
    submi() { //提交附件信息
      var reg = /^(?:[a-zA-Z]{3},)*[a-zA-Z]{3}$/;
      var regs = /^\d+$|^\d+[.]?\d+$/;
      var regSize = /^[0-9]*$/;
      var picture = this.picture;
      var fileExtension = this.fileExtension;
      var maximumSize = this.maximumSize;
      if (!picture) {
        this.$message.error('请您输入图片扩展名');
        return
      }
      if (!fileExtension) {
        this.$message.error('请您输入文件扩展名');
        return
      }
      if (!maximumSize) {
        this.$message.error('请您输入支持的最大尺寸');
        return
      }
      if (maximumSize > 100 ) {
        this.$message.error('最大尺寸不能超过100MB');
        return
      }
      if (!regs.test(maximumSize)) {
        this.$message.error('请输入正确的支持最大尺寸格式');
        return
      }
      if (!regSize.test(maximumSize)) {
        this.$message.error('请输入正确的支持最大尺寸格式');
        return
      }
      if (this.restrictionsOn === '2') {
        if (this.downloads <= 0 || this.downloads === '') {
          this.$message.error('下载次数请输入大于0的正整数');
          return
        }
        if (!regSize.test(this.downloads)) {
          this.$message.error('下载次数请输入大于0的正整数');
          return
        }
      }
      if (Number(this.quantityLimit) < 1) {
        this.$message.error('发帖时一次性可添加附件数为大于0的整数');
        return
      }
      this.appFetch({
        url: 'settings_post_v3',
        method: 'post',
        data: {
          "data": [
            {
              "key": 'support_img_ext',
              "value": this.picture,
              "tag": "default"
            },
            {
              "key": 'support_file_ext',
              "value": this.fileExtension,
              "tag": "default",
            },
            {
              "key": 'support_max_size',
              "value": this.maximumSize,
              "tag": "default",
            },
            {
              "key": 'support_max_download_num',
              "value": this.restrictionsOn === '1' ? 0 : this.downloads,
              "tag": "default",
            },
            {
              "key": "support_max_upload_attachment_num",
              "value": this.quantityLimit,
              "tag": "default"
          }
          ]
        }
      }).then(data => {
        if (data.errors) {
          this.$message.error(data.errors[0].code);
        } else {
          if (data.Code !== 0) {
            this.$message.error(data.Message);
            return
          }
          this.$message({ message: '提交成功', type: 'success' });
          this.annexSet()  //提交成功后调取新数据
        }
      }).catch(error => {
      })
    }
  },
  components: {
    Card,
    CardRow
  }
}
