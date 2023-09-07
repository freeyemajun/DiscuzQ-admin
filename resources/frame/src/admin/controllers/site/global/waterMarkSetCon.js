import Card from "../../../view/site/common/card/card";
import CardRow from "../../../view/site/common/card/cardRow";

export default {
  data: function() {
    return {
      // picture: "", //图片扩展名
      // fileExtension: "", //文件扩展名
      // maximumSize: "", //最大尺寸
      switchBtn: false, //水印开关状态
      deleteBtn: false, //图片删除按钮显示状态
      imageUrl: "",
      imgWidth: 0,
      imgHeight: 0,
      posiCurrent: -1,
      posiList: [
        {
          name: "左上",
          val: 1
        },
        {
          name: "中上",
          val: 2
        },
        {
          name: "右上",
          val: 3
        },
        {
          name: "左中",
          val: 4
        },
        {
          name: "居中",
          val: 5
        },
        {
          name: "右中",
          val: 6
        },
        {
          name: "左下",
          val: 7
        },
        {
          name: "中下",
          val: 8
        },
        {
          name: "右下",
          val: 9
        }
      ],
      waterMarkPosi: 0,
      verticalSpacing: 0, // 垂直
      horizontalSpacing: 0 // 水平
    };
  },
  created() {
    // 初始化加载数据
    this.waterMarkSet();
  },
  methods: {
    waterMarkSet() {
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
          this.switchBtn = forumData.watermark.watermark;
          this.imageUrl = forumData.watermark.watermarkImage;
          if(this.imageUrl !== '' && this.imageUrl != null){
            this.deleteBtn = true;
          }
          if( forumData.watermark.position !== '' && forumData.watermark.position != null && forumData.watermark.position !== 0 ){
            this.posiCurrent = forumData.watermark.position - 1;
            this.waterMarkPosi = forumData.watermark.position;
          }

          this.verticalSpacing = forumData.watermark.verticalSpacing;
          this.horizontalSpacing = forumData.watermark.horizontalSpacing;
        }
      });
    },

    submi() {
      //提交水印信息
      const regSize = /^[0-9]*$/;
      if( this.switchBtn ){
        if (!this.imageUrl) {
          this.$message.error("请上传水印图片");
          return;
        }
        if (!this.waterMarkPosi) {
          this.$message.error("请选择水印位置");
          return;
        }
        if ( regSize.test(this.verticalSpacing) > 9999 ) {
          this.$message.error("请输入正确格式的垂直边距值");
          return;
        }
        if ( regSize.test(this.horizontalSpacing) > 9999 ) {
          this.$message.error("请输入正确格式的水平边距值");
          return;
        }
        if ( this.verticalSpacing > 9999 ) {
          this.$message.error("垂直边距值不能超过9999");
          return;
        }
        if ( this.horizontalSpacing > 9999 ) {
          this.$message.error("水平边距值不能超过9999");
          return;
        }
      }

      this.appFetch({
        url: "settings_post_v3",
        method: "post",
        data: {
          data: [
            {
              key: "watermark",
              value: this.switchBtn,
              tag: "watermark"
            },
            {
              key: "position",
              value: this.waterMarkPosi,
              tag: "watermark"
            },
            {
              key: "vertical_spacing",
              value: this.verticalSpacing,
              tag: "watermark"
            },
            {
              key: "horizontal_spacing",
              value: this.horizontalSpacing,
              tag: "watermark"
            },
          ]
        }
      })
        .then(data => {
          if (data.errors) {
            this.$message.error(data.errors[0].code);
          } else {
            if (data.Code !== 0) {
              this.$message.error(data.Message);
              return
            }
            this.$message({ message: "提交成功", type: "success" });
            this.annexSet(); //提交成功后调取新数据
          }
        })
        .catch(error => {});
    },

    //上传时，判断文件的类型及大小是否符合规则
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.warning("上传水印图片只能是 PNG 格式!");
        return isJPG;
      }
      if (!isLt2M) {
        this.$message.warning("上传头像图片大小不能超过 2MB!");
        return isLt2M;
      }
      return isJPG && isLt2M;
    },
    // 上传
    uploaderLogo(e) {
      let logoFormData = new FormData();
      logoFormData.append("logo", e.file);
      logoFormData.append("type", "watermark_image");
      this.appFetch({
        url: "settings_logo_post_v3",
        method: "post",
        data: logoFormData
      })
        .then(data => {
          if (data.errors) {
            this.$message.error(data.errors[0].code);
          } else {
            if (data.Code !== 0) {
              this.$message.error(data.Message);
              return
            }
            this.imageUrl = data.Data.value;
            this.$message({ message: "上传成功", type: "success" });
            this.deleteBtn = true;
          }
        })
        .catch(error => {});
    },
    //删除已上传logo
    deleteImage(file, fileList) {
      if (this.deleteBtn === false) {
        return;
      }
      this.imageUrl = "";
      this.appFetch({
        url: "delete_logo_post_v3",
        method: "post",
        data: {
          type: 'watermark_image',
        }
      })
        .then(data => {
          if (data.errors) {
            this.$message.error(data.errors[0].code);
          } else {
            if (data.Code !== 0) {
              this.$message.error(data.Message);
              return
            }
            this.$message("删除成功");
            this.deleteBtn = false;
          }
        })
        .catch(error => {});
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleFile() {},
    // 选择水印位置
    posiClick(val, index) {
      this.posiCurrent = index;
      this.waterMarkPosi = val;
    }
  },
  components: {
    Card,
    CardRow
  }
};
