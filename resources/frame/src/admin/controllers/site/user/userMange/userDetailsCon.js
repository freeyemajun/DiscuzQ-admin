/*
 * 用户详情
 * */

import Card from "../../../../view/site/common/card/card";
import CardRow from "../../../../view/site/common/card/cardRow";
import browserDb from "../../../../../helpers/webDbHelper";

export default {
  data: function() {
    return {
      fileList: [],
      options: [],
      optionsList: [],
      imageUrl: "",
      userRole: '',
      userInfo: {},
      newPassword: "",
      wechatNickName: "",
      sex: "",
      // disabled: false,    // 
      noAdmin: false,  // 判断是否是admin
      disabledReason: false,
      oldPassword: '', // 旧密码
      confirmPassword: '', // 确认新密码
      reasonsForDisable: "", //禁用原用
      realname: "", //实名认证是否显示
      expired_at: "", // 选择过期时间
      userName: "",   // 修改用户名
      nickName: "",   // 修改用户昵称
      optionsStatus: [
        {
          value: 0,
          label: "正常"
        },
        {
          value: 1,
          label: "禁用"
        },
        {
          value: 2,
          label: "审核"
        },
        {
          value: 3,
          label: "审核拒绝"
        },
        {
          value: 10,
          label: "待填写注册扩展信息"
        }
      ],
      value: "",
      query: {},
      deleBtn: false,
      expandUsers:[],
      expandDatas: [],
      exends: [],
      groupList: [],
      userGroupId: '',
      userInviteList: [],
      pageLimit: 10,
      pageNum: 1,
      total: 0,
    };
  },
  watch: {
    $route: {
      handler() {
        this.query = this.$route.query;
        this.getUserDetail();
        this.getUserList();
        this.expandInformation();
        this.usersInviteList();
      }
    }
  },
  created() {
    this.query = this.$route.query;
    this.getUserDetail();
    this.getUserList();
    this.expandInformation();
    this.usersInviteList();
  },

  methods: {
    async getUserDetail() {
      try {
        var userId = browserDb.getLItem("tokenId");
        const response = await this.appFetch({
          method: "get",
          url: "user_get_v3",
          // splice: `/${this.query.id}`,
          data: {
            userId: this.query.id
          }
        });
        if (response.Code || (response.Code && response.Code !== 0)) {
          this.$message.error(response.Message);
        } else {
          this.userInfo = response.Data;
          this.imageUrl = this.userInfo.avatarUrl;
          this.userName = this.userInfo.username;
          this.nickName = this.userInfo.nickname;
          this.expired_at = this.userInfo.expiredAt && this.$dayjs(this.userInfo.expiredAt).format("YYYY-MM-DD HH:mm:ss");
          if (this.imageUrl != "" && this.imageUrl != null) {
            this.deleBtn = true;
          }
          this.reasonsForDisable = this.userInfo.banReason;
          this.userRole = response.Data.group.pid;
          this.userGroupId = response.Data.group.pid;
          if (response.isBindWechat) {
            this.wechatNickName = response.Data.nickname;
            this.sex = response.Data.sex;
          }
          if (userId == this.userInfo.id) {
            // this.disabled = false;
            this.noAdmin = true;
          }
          if (this.userInfo.status == 1) {
            this.disabledReason = true;
          }
          if (this.userInfo.realname == "") {
            this.realname = false;
          } else {
            this.realname = true;
          }
        }
      } catch (err) {}
    },

    // 推广邀请用户列表
    usersInviteList() {
      this.appFetch({
        url: 'users_invite_get_v3',
        method: 'get',
        data: {
          userId: this.query.id,
        },
      })
      .then(res => {
        if (res.errors) {
          this.$message.error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.userInviteList = res.Data.pageData;
        }
      })
    },
    // 扩展信息查询
    expandInformation() {
      this.appFetch({
        url: 'signinfields_get_v3',
        method: 'get',
        data: {},
      }).then(res => {
        if (res.Code !== 0) {
          this.$message.error(res.Message);
          return
        }
        res.Data.forEach(item => {
          if (item.status == 1) {
            this.expandDatas.push(item);
          }
        })
        this.userExpandInformation();
      }) 
    },

    // 用户扩展信息查询
    userExpandInformation() {
      let userId = this.query.id;
      this.appFetch({
        url: 'user_signinfields_get_v3',
        method: 'get',
        data: {
          uid: userId
        }
      }).then((res) => {
        if (res.Code !== 0) {
          this.$message.error(res.Message);
          return
        }
        if (res.Data && res.Data.length > 0) {
          res.Data.forEach((item, index) => {
            if (item.type > 1 && item.fieldsExt) {
              item.fieldsExt = JSON.parse(item.fieldsExt);
              this.expandUsers.push(item);
            } else {
              if (item.fieldsExt !== '') {
                this.expandUsers.push(item);
              }
            }
          })
        } else {
          this.expandUsers = [];
        }
      })
    },
    extendName(data) {
      let userName = '';
      this.expandDatas.forEach(items => {
        if (data === items._data.id) {
          userName = items._data.name;
        }
      })
      return userName;
    },
    handleRemove(file, fileList) {},
    deleteImage() {
      if (this.deleBtn == false) {
        return;
      }
      this.imageUrl = "";
      this.appFetch({
        url: "delete_avatar_post_v3",
        method: "post",
        data: {
          aid: this.query.id
        }
      }).then(res => {
        if (res.Code !== 0) {
          this.$message.error(res.Message);
        } else {
          this.deleBtn = false;
          this.$message.success("删除成功");
        }
      });
    },
    handlePreview(file) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.MessageBox.confirm(`确定移除 ${file.name}？`);
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleFile() {},
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
      }
      if (isJPG && isLt10M == true) {
      }
      return isJPG && isLt10M;
    },
    uploaderLogo(file) {
      let formData = new FormData();
      formData.append("aid", this.query.id);
      formData.append("avatar", file.file);
      this.appFetch({
        url: "users_avatar_post_v3",
        method: "post",
        data: formData
      }).then(res => {
        if (res.errors) {
          this.$message.error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message.success("上传成功");
          this.imageUrl = res.Data.avatarUrl;
          this.deleBtn = true;
        }
      });
    },

    submission() {
      var reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/; //手机号正则验证
      var mobile = this.userInfo.originalMobile;
      if (mobile == "") {
      } else if (!reg.test(mobile)) {
        return this.$toast("您输入的手机号码不合法，请重新输入");
      }
      // if (!reg.test(mobile)) { //手机号不合法
      // return  this.$toast("您输入的手机号码不合法，请重新输入");
      // }
      this.userExtensionModification();
      this.appFetch({
        url: "users_update_post_v3",
        method: "post",
        data: {
          id: this.query.id,
          newPassword: this.newPassword,
          mobile: mobile,
          groupId: this.userRole,
          status: this.userInfo.status,
          rejectReason: this.reasonsForDisable,
          expiredAt: this.expired_at,
          username: this.userName,
          nickname: this.nickName,
          // password: this.oldPassword,
          // newPassword: this.confirmPassword
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
          this.getUserDetail();
        }
      });
    },

    async getUserList() {
      //获取用户角色
      try {
        const response = await this.appFetch({
          method: "get",
          url: "groups_list_get_v3"
        });
        const data = response.Data;
        this.groupList = data;
        data.map(v => {
          if (v.id !== 7) {
            this.options.push({value: v.id, label: v.name});
          }
        });
      } catch (err) {
        console.error(err, "getUserList");
      }
    },
    userStatusChange(value) {
      this.disabledReason = value == 1;
      if (value != 1) {
        this.reasonsForDisable = "";
      }
    },
    extendUsers(code) {
      let extendArr = '';
      if (code.fieldsExt.options) {
        code.fieldsExt.options.forEach(item => {
          if (item.checked) {
            extendArr += item.value + ' ';
          }
        })
      } else {
        code.fieldsExt.forEach(item => {
          if (item.checked) {
            extendArr += item.value + ' ';
          }
        })
      }
      return extendArr;
    },

    userExtensionModification() {
      this.exends = [];
      this.expandUsers.forEach(item => {
        let data = {
          "type": "user_sign_in",
          "attributes": {
            "aid": item.aid,
            "fieldsDesc": item.fieldsDesc,
            "id": item.id,
            "remark": "",
            "status": item.status,
            "type": item.type,
            "userId": item.userId,      
          }
        };
        if (item.type > 1 && item.fieldsExt) {
          data.attributes.fieldsExt = JSON.stringify(item.fieldsExt);
          this.exends.push(data);
        } else {
          data.attributes.fieldsExt = item.fieldsExt;
          this.exends.push(data);
        }
      })
      // this.modificationUsers(this.exends);
    },

    modificationUsers(data) {
      let userId = this.query.id;
      this.appFetch({
        url: 'userSigninfields',
        method: 'post',
        splice: `/${userId}`,
        data: {
          data
        }
      }).then(res => {
        if (res.Code !== 0) {
          this.$message.error(res.Message);
          return
        }
        console.log(res);
      })
    },
    groupSwitch(value) {
      let groupType = '';
      let userGroup = '';
      this.groupList.forEach(item => {
        if (value === item.id) {
          groupType = item.isPaid;
        }
        if (this.userGroupId === item.id) {
          userGroup = item.isPaid;
        }
      });
      if (userGroup === 0 && groupType === 0) {
        this.userRole = value;
      }
      if (userGroup === 1 && groupType === 0) {
        const text = '移入新用户组后，原用户组的付费信息全部失效。';
        this.open(text, value);
      }
      if (userGroup === 1 && groupType === 1) {
        const text = '移入新用户组后，原用户组的付费信息全部失效。';
        this.open(text, value);
      }
      if (userGroup === 0 && groupType === 1) {
        const text = '移入新用户组后，用户将享受付费权益。';
        this.open(text, value);
      }
    },
    open(text, value) {
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false,
      }).then(() => {
        this.userRole = value;
      }).catch(() => {
        this.userRole = this.userRole;
      });
    },
    jumpUserDetails(userId) {
      this.$router.push({path:'/admin/user-details', query: {id: userId}});
    }
  },
  components: {
    Card,
    CardRow
  }
};
