import Card from "../../../view/site/common/card/card";
import CardRow from "../../../view/site/common/card/cardRow";
export default {
  data: function () {
    return {
      // 关闭站点
      closeList: [],
      closeSelectList: [],
      radio: "1",
      radio2: "2",
      expireRadio: "1",
      // fileList:[],
      loading: true,
      fullscreenLoading: false,
      // siteTheme: 1,
      siteName: "",
      siteIntroduction: "",
      siteKeywords: "",
      siteTitle: "",
      siteMode: "1", //站点模式选择
      sitePrice: "",
      siteExpire: "",
      siteAuthorScale: "",
      siteMasterScale: "",
      siteClose: "1", //关闭站点选择
      // siteLogoFile: {},
      siteLogoFile: [],
      siteMasterId: "",
      siteRecord: "",
      recodeNumber: "",
      siteStat: "",
      siteCloseMsg: "",
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [],
      deleBtn: false,
      disabled: true, // 付费模式置灰
      loginaes: true,
      AesKey: "",
      AesIv: "",
      numberimg: [
        {
          imageUrl: "",
          imgWidht: 0,
          imgHeight: 0,
          text: "站点LOGO",
          textrule: "尺寸：438px*88px"
        },
        {
          imageUrl: "",
          imgWidht: 0,
          imgHeight: 0,
          text: "首页头部LOGO",
          textrule: "尺寸：438px*88px"
        },
        {
          imageUrl: "",
          imgWidht: 0,
          imgHeight: 0,
          text: "首页头部背景",
          textrule: "尺寸：750px*400px"
        },
        {
          imageUrl: "",
          imgWidht: 0,
          imgHeight: 0,
          text: "站点ICON",
          textrule: "尺寸：120px*120px"
        }
      ]
    };
  },

  // 默认有效时间
  defaultExprie: 6,

  created: function () {
    //初始化请求设置
    this.loadStatus();
  },
  computed: {
    // uploadDisabled:function() {
    //     return this.fileList.length >0
    // },
    changeCloseList() {
      return this.closeSelectList.length != this.closeList.length;
    }
  },

  methods: {
    loadStatus() {
      //初始化设置
      this.appFetch({
        url: 'forum_get_v3',
        method: "get",
        data: {}
      })
        .then(data => {
          if (data.errors) {
            this.$message.error(data.errors[0].code);
          } else {
            if (data.Code !== 0) {
              this.$message.error(data.Message);
              return
            }
            const {Data: forumData} = data;
            // 微信支付关闭时置灰付费模式
            if (forumData.paycenter.wxpayClose == false) {
              this.disabled = true;
            } else {
              this.disabled = false;
            }
            // 付费加入永久有效判断
            if (forumData.setSite.siteExpire === '') {
              this.expireRadio = '2';
            } else {
              this.expireRadio = '1';
            }
            // logo size
            // this.siteTheme = forumData.setSite.site_skin;
            // this.numberimg[0].textrule = this.siteTheme === 1
            //   ? "尺寸：438px*88px"
            //   : "尺寸：300px*100px";
            this.siteName = forumData.setSite.siteName;
            this.siteIntroduction =
              forumData.setSite.siteIntroduction;
            this.siteKeywords = forumData.setSite.siteKeywords;
            this.siteTitle = forumData.setSite.siteTitle;
            this.siteMode = forumData.setSite.siteMode;
            this.numberimg[0].imageUrl = forumData.setSite.siteLogo;
            this.numberimg[1].imageUrl =
              forumData.setSite.siteHeaderLogo;
            this.numberimg[2].imageUrl =
              forumData.setSite.siteBackgroundImage;
            // icon
            this.numberimg[3].imageUrl =
              forumData.setSite.siteFavicon;
            if (this.siteMode == "pay") {
              this.radio = "2";
            } else {
              this.radio = "1";
            }
            this.sitePrice = forumData.setSite.sitePrice;
            this.siteExpire = forumData.setSite.siteExpire || 6;
            this.defaultExprie = forumData.setSite.siteExpire || 6;
            this.siteAuthorScale =
              forumData.setSite.siteAuthorScale;
            this.siteMasterScale =
              forumData.setSite.siteMasterScale;
            // this.siteLogoFile = forumData.siteLogoFile;
            this.siteRecord = forumData.setSite.siteRecord;
            this.recodeNumber = forumData.setSite.siteRecordCode;
            this.siteStat = forumData.setSite.siteStat;
            this.loginaes = forumData.setSite.loginaes;
            this.AesKey = forumData.setSite.aesKey.trim();
            this.AesIv = forumData.setSite.aesIv.trim();

            if (
              forumData.setSite.siteAuthor &&
              forumData.setSite.siteAuthor.id
            ) {
              this.siteMasterId = forumData.setSite.siteAuthor.id;
            }

            // if (forumData.logo) {
            //   this.fileList.push({url: forumData.logo});
            // }

            // 旧关闭站点
            this.siteClose = forumData.setSite.siteClose;
            if (this.siteClose === true) {
              this.radio2 = "1";
            } else {
              this.radio2 = "2";
            }
            // 新的关闭站点
            // console.log(data);
            // this.closeList = forumData.setSite.site_manage || [];
            // this.closeSelectList = this.closeList.reduce((result, item) => {
            //   if (item.value) {
            //     result.push(item.key);
            //   }
            //   return result;
            // }, []);

            this.siteCloseMsg = forumData.setSite.siteCloseMsg;
            // 微信支付关闭时置灰付费模式
            if (forumData.paycenter.wxpayClose == false) {
              this.disabled = true;
            } else {
              this.disabled = false;
            }
            this.getScaleImgSize(this.numberimg[0].imageUrl, {
              width: 140,
              height: 140
            }).then(res => {
              this.numberimg[0].imgWidht = res.width;
              this.numberimg[0].imgHeight = res.height;
            });
            this.getScaleImgSize(this.numberimg[1].imageUrl, {
              width: 140,
              height: 140
            }).then(res => {
              this.numberimg[1].imgWidht = res.width;
              this.numberimg[1].imgHeight = res.height;
            });
            this.getScaleImgSize(this.numberimg[2].imageUrl, {
              width: 140,
              height: 140
            }).then(res => {
              this.numberimg[2].imgWidht = res.width;
              this.numberimg[2].imgHeight = res.height;
            });
            this.getScaleImgSize(this.numberimg[3].imageUrl, {
              width: 140,
              height: 140
            }).then(res => {
              this.numberimg[3].imgWidht = res.width;
              this.numberimg[3].imgHeight = res.height;
            });
          }
        })
        .catch(error => { });
    },
    //删除已上传logo
    deleteImage(file, index, fileList) {
      let type = "";
      switch (index) {
        case 0:
          type = "logo";
          break;
        case 1:
          type = "header_logo";
          break;
        case 2:
          type = "background_image";
          break;
        case 3:
          type = "favicon";
          break;
        default:
          this.$message.error("未知类型");
      }
      this.numberimg[index].imageUrl = "";
      this.appFetch({
        url: "delete_logo_post_v3",
        method: "post",
        data: {
          type: type
        }
      })
        .then(data => {
          if (data.Code !== 0) {
            this.$message.error(data.Message);
            return
          }
          if (data.errors) {
            this.$message.error(data.errors[0].code);
          } else {
            this.$message("删除成功");
          }
        })
        .catch(error => { });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    radioChange(siteMode) {
      this.siteMode = siteMode;
    },
    radioChangeClose(closeVal) {
      if (closeVal == "1") {
        this.siteClose = true;
      } else {
        this.siteClose = false;
      }
    },
    // 关闭站点
    closeListChange(data) {
      this.closeSelectList = data.slice();
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleFile() { },
    getScaleImgSize(url, obj) {
      if (url === "") {
        return;
      }
      //处理等比例上传图片，
      return new Promise((resolve, reject) => {
        this.getImageSize(url)
          .then(res => {
            const scale = res.height / res.width;
            if (scale > obj.height / obj.width) {
              resolve({
                width: obj.height / scale,
                height: obj.height
              });
            } else {
              resolve({
                width: obj.width,
                height: obj.width * scale
              });
            }
          })
          .catch(err => {
            console.log(err);
            // reject(err);
          });
      });
    },
    getImageSize(url) {
      const img = document.createElement("img");
      return new Promise((resolve, reject) => {
        img.onload = ev => {
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.src = url;
        img.onerror = reject;
      });
    },

    //上传时，判断文件的类型及大小是否符合规则
    beforeAvatarUpload(file) {
      const isJPG =
        file.type == "image/jpeg" ||
        file.type == "image/png" ||
        file.type == "image/gif" ||
        file.type == "image/ico" ||
        file.type == "image/vnd.microsoft.icon" ||
        file.type == "image/x-icon";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.warning("上传头像图片只能是 JPG/PNG/GIF/ICO 格式!");
        return isJPG;
      }
      if (!isLt2M) {
        this.$message.warning("上传头像图片大小不能超过 2MB!");
        return isLt2M;
      }
      return isJPG && isLt2M;
    },
    // 上传图片
    uploaderLogo(e, index) {
      let type = "";
      switch (index) {
        case 0:
          type = "logo";
          break;
        case 1:
          type = "header_logo";
          break;
        case 2:
          type = "background_image";
          break;
        case 3:
          type = "favicon";
          break;
        default:
          this.$message.error("未知类型");
      }
      let logoFormData = new FormData();
      logoFormData.append("logo", e.file);
      logoFormData.append("type", type);
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
            this.numberimg[index].imageUrl = data.Data.value;
            this.getScaleImgSize(this.numberimg[index].imageUrl, {
              width: 140,
              height: 140
            }).then(res => {
              this.numberimg[index].imgWidht = res.width;
              this.numberimg[index].imgHeight = res.height;
            });
            this.$message({ message: "上传成功", type: "success" });
          }
        })
        .catch(error => { });
    },
    siteSetPost() {
      if(this.radio === '2' && this.expireRadio === '1' && !this.siteExpire) {
        this.$message({
          message: "有效时间必须大于等于1，小于等于1000000",
          type: "error"
        });
        return
      }

      const closeData = this.closeList.map((item) => {
        item.value = this.closeSelectList.indexOf(item.key) != - 1;
        return item;
      })

      const params = [
        {
          key: "site_name",
          value: this.siteName ? this.siteName : "",
          tag: "default"
        },
        {
          key: "site_introduction",
          value: this.siteIntroduction ? this.siteIntroduction : "",
          tag: "default"
        },
        {
          key: "site_keywords",
          value: this.siteKeywords ? this.siteKeywords : "",
          tag: "default"
        },
        {
          key: "site_title",
          value: this.siteTitle ? this.siteTitle : "",
          tag: "default"
        },
        {
          key: "site_author",
          value: this.siteMasterId,
          tag: "default"
        },
        {
          key: "site_mode",
          value: this.siteMode,
          tag: "default"
        },
        {
          key: "site_price",
          value: this.sitePrice,
          tag: "default"
        },
        {
          key: "site_author_scale",
          value: this.siteAuthorScale,
          tag: "default"
        },
        {
          key: "site_master_scale",
          value: this.siteMasterScale,
          tag: "default"
        },
        {
          key: "site_record",
          value: this.siteRecord,
          tag: "default"
        },
        {
          key: "site_record_code",
          value: this.recodeNumber,
          tag: "default"
        },
        {
          key: "site_stat",
          value: this.siteStat,
          tag: "default"
        },
        {
          key: "site_close",
          value: this.siteClose,
          tag: "default"
        },
        {
          key: "site_manage",
          value: closeData,
          tag: "default"
        },
        {
          key: "site_close_msg",
          value: this.siteCloseMsg,
          tag: "default"
        },
        {
          key: "loginaes",
          value: this.loginaes,
          tag: "default"
        },
        {
          key: "AesKey",
          value: this.AesKey,
          tag: "default"
        },
        {
          key: "AesIv",
          value: this.AesIv,
          tag: "default"
        },
      ];

      if(this.siteMode === 'pay') {
        params.push({
          key: "site_expire",
          value: this.expireRadio === "2"  ? 0 : this.siteExpire,
          tag: "default"
        },)
      }

      this.appFetch({
        url: "settings_post_v3",
        method: "post",
        data: {
          data: params
        },
      })
        .then(data => {
          if (data.errors) {
            if (data.errors[0].detail) {
              this.$message.error(
                data.errors[0].code + "\n" + data.errors[0].detail[0]
              );
            } else {
              this.$message.error(data.errors[0].code);
            }
          } else {
            if (data.Code !== 0) {
              this.$message.error(data.Message);
              return
            }
            this.$message({
              message: "提交成功",
              type: "success"
            });
          }
        })
        .catch(error => { });
    },
    onblurFun() {
      if (this.siteAuthorScale == null || this.siteAuthorScale == "") {
        this.siteAuthorScale = 0;
      }
      if (this.siteMasterScale == null || this.siteMasterScale == "") {
        this.siteMasterScale = 0;
      }
      var countRes =
        parseFloat(this.siteAuthorScale) + parseFloat(this.siteMasterScale);
      if (countRes != 10) {
        this.$message({
          message: "分成比例相加必须为10",
          type: "error"
        });
      }
    },
    onExpireBlurFun() {
      var countRes = parseFloat(this.siteExpire);
      if (!(countRes >= 1 && countRes <= 1000000)) {
        this.siteExpire = '';
        this.$message({
          message: "有效时间必须大于等于1，小于等于1000000",
          type: "error"
        });
      }
    },
  },
  components: {
    Card,
    CardRow
  }
};
