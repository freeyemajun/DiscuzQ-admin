/**
 * 角色权限编辑
 */
 import Card from "../../../../view/site/common/card/card";
 import CardRow from "../../../../view/site/common/card/cardRow";
 
 export default {
   data: function () {
     return {
       textarea: '',
       groupId: 0, // 用户组 ID
       checked: [], // 选中的权限
       videoDisabled: false, // 是否开启云点播
       captchaDisabled: false, // 是否开启验证码
       realNameDisabled: false, // 是否开启实名认证
       isSubordinate: false, // 是否开启推广下线
       scale: 0, // 提成比例
       bindPhoneDisabled: false, // 是否开启短信验证
       wechatDisabled: false,  // 是否开启微信
       appletDisabled: false,  // 是否开启小程序
       postDisabled: false,
       categoriesList: [], // 分类列表
       pluginUnit: false,
       plugInPermissions: [],
       selectList: {
         "createThread": [], // 发布帖子
         'viewThreads': [], // 查看主题列表扩展
         'thread.reply': [], // 回复主题扩展项
         'thread.edit': [], // 编辑主题扩展
         'thread.hide': [], // 删除主题扩展
         'thread.essence': [], // 加精扩展
         'thread.viewPosts': [], // 查看主题详情扩展
         'thread.hidePosts': [], // 删除回复扩展
         'thread.editOwnThreadOrPost': [], // 编辑自己的主题、回复
         'thread.hideOwnThreadOrPost': [], // 删除自己的主题、回复
         'thread.freeViewPosts': [],
       },
       activeTab: {
         // 设置权限当前项
         title: "操作权限",
         name: "userOperate"
       },
       menuData: [
         // 设置权限
         {
           title: "操作权限",
           name: "userOperate"
         },
         {
           title: "安全设置",
           name: "security"
         },
         // {
         //   title: "价格设置",
         //   name: "pricesetting"
         // },
         {
           title: "其他设置",
           name: "other"
         }
         // {
         //   title: '默认权限',
         //   name: 'default'
         // },
       ],
       value: "",
       purchasePrice: "",
       dyedate: "",
       ispad: "",
       allowtobuy: "",
       defaultuser: false,
       checkAll: false, //是否全选
       isIndeterminate: false,//全选不确定状态
       selectText: '全选', //全选文字
       checkAllPermission: [], //所有操作权限
       temporaryChecked: [], //接口返回权限
       // 扩展全选
       expandItem: [
         "createThread",
         'viewThreads',
         'thread.reply',
         'thread.edit',
         'thread.hide',
         'thread.essence',
         'thread.viewPosts',
         'thread.hidePosts',
         'thread.editOwnThreadOrPost',
         'thread.hideOwnThreadOrPost',
         'thread.freeViewPosts',
       ],
       mapCategoryId: new Map(),
       keyValue: 0,
       groupType: '', // 用户组类型
       groupName:'',      //是否显示用户组名称
       groupFeeName:'',  // 付费用户组名字
       groupPrice: '',   // 付费用户组价格
       groupDays: '',    // 付费用户组日期
       groupDescription: '', // 付费用户组描述
       groupNotice: '购买金额将用于升级您所在的用户组。\n如果购买多次同一用户组，有效期将累加。\n如果购买不同用户组，则新购买的用户组权限立即生效，在此之前的用户组有效期将叠加计算。\n付费站点中，如果您的站点有效期低于付费用户组有效期，则以付费用户组有效期为准。',   // 付费须知
       groupFeeList: [],
       groupDataName: '',
       groupLevel: '',
       invitaOptions: [{
          value: 30,
          label: '30'
        }, {
          value: 3,
          label: '3'
        }],
        invitaValue: '',
        limitedDaysValue: ''
      };
   },
   watch: {
     checked(val) {
       let isEqual = true;
       this.checkAllPermission.forEach(item => {
         if (val.indexOf(item) === -1) {
           isEqual = false;
           return;
         }
       });
       if (isEqual) {
         this.checkAll = true;
       } else {
         this.checkAll = false;
       }
     },
     checkAll(val) {
       if (val) {
         this.isIndeterminate = false;
         this.selectText = "取消全选";
       } else {
         this.isIndeterminate = true;
         this.selectText = "全选";
       }
     }
   },
   methods: {
     duedata: function (evn) {
       this.duedata = evn.replace(/[^\d]/g, "");
     },
     addprice: function (evn) {
       setTimeout(() => {
         this.purchasePrice = evn
           .replace(/[^\d.]/g, "")
           .replace(/\.{2,}/g, ".")
           .replace(".", "$#$")
           .replace(/\./g, "")
           .replace("$#$", ".")
           .replace(/^(-)*(\d+)\.(\d\d).*$/, "$1$2.$3")
           .replace(/^\./g, "");
       }, 5);
     },
 
     getData() {
       Promise.all([this.getCategories(), this.getGroupResource(), this.getSiteInfo(), this.operateRequest()])
         .then(
           res => {
             this.handleCategories(res[0]);
             this.handleGroupResource(res[1]);
             this.signUpSet(res[2]);
             this.operateList(res[3]);
           },
           err => {
             console.log(err);
           }
         )
     },

     paymentProcess() {
      Promise.all([this.getCategories(), this.getSiteInfo()])
        .then(
          res => {
            this.handleCategories(res[0]);
            this.signUpSet(res[1]);
          },
          err => {
            console.log(err);
          }
        )
     },
     handleCategories(res) {
       if (res.errors) return this.$message.error(res.errors[0].code);
 
       this.categoriesList = [{ id: "", name: "全局", children: [] }]
       res.Data.forEach(item => {
         this.mapCategoryId.set(parseInt(item.pid), item.parentid);
         const category = {
           id: item.pid,
           name: item.name,
           children: []
         }
         if (item.children) {
           item.children.forEach(subItem => {
             this.mapCategoryId.set(subItem.pid, subItem.parentid);
             category.children.push({
               id: subItem.pid,
               name: subItem.name
             })
           })
         }
         this.categoriesList.push(category);
       });
     },
     handleGroupResource(res) {
       if (res.Code !== 0) {
         return this.$message.error(`${res.Code} ${res.Message}`)
       }
 
       const data = res.Data;
       this.ispad = data.isPaid;
       this.scale = data.scale;
       // this.dyedate = data.days;
       // this.purchasePrice = data.fee;
       this.defaultuser = data.default;
       this.isSubordinate = data.isSubordinate;
       // this.value = data.isPaid;
       this.groupFeeName = data.name;
       this.groupLevel = data.level
       this.groupPrice = data.fee;
       this.groupDays = data.days;
       this.groupDescription = data.description;
       this.groupNotice = data.notice;
       this.invitaValue = data.timeRange;
       this.limitedDaysValue = data.contentRange;
       const permissions = data.permission || [];
       this.checked = [];
       permissions.forEach(item => {
         this.checked.push(item.permission);
       });
       // 回显选择值
       this.setSelectValue(this.checked);
     },
     signUpSet(res) {
       if (res.errors) return this.$message.error(res.errors[0].code);
 
       const data = res.Data;
       const siteData = res.Data.setSite;
       this.videoDisabled = data.qcloud.qcloudVod === false;
       this.captchaDisabled = data.qcloud.qcloudCaptcha === false;
       this.realNameDisabled = data.qcloud.qcloudFaceid === false;
       this.bindPhoneDisabled = data.qcloud.qcloudSms === false;
       this.wechatDisabled = data.passport.offiaccountOpen === false;
       this.appletDisabled = data.passport.miniprogramOpen === false;
       this.allowtobuy = siteData.sitePayGroupClose;
       this.postDisabled = this.wechatDisabled && this.appletDisabled;
       // if (!this.allowtobuy) {
       //   this.value = false;
       // }
     },
     operateList(res) {
       if (res.errors) return this.$message.error(res.errors[0].code);
       this.plugInPermissions = [];
       res.Data.forEach(item => {
         this.plugInPermissions.push({
           appId: item.appId,
           name: item.name,
           canUsePlugin: item.authority.canUsePlugin,
           title: item.authority.title,
           description: item.description,
         })
       })
     },
     // 扩展项回显
     setSelectValue(data) {
       const checkedData = data;
       const selectList = this.selectList;
       checkedData.forEach((value, index) => {
         // 1 分类-非全局状态回显
         if (value.includes("category")) {
           const splitIndex = value.indexOf(".");
           const obj = value.substring(splitIndex + 1);
           if (checkedData.includes(obj)) {
             checkedData.splice(index, 1);
             return;
           }
           const id = value.substring(8, splitIndex);
           const parentId = this.mapCategoryId.get(parseInt(id));
           const selectItem = parentId === 0 ? [id] : [parentId, id];
           if (selectList[obj]) {
            selectList[obj].push(selectItem);
           }
           return;
         }
 
         // 2 分类-全局状态回显
         this.expandItem.includes(value) && selectList[value].push([""]);
       });
       this.selectList = selectList;
       this.checked = checkedData;
     },
     getGroups(){
      this.appFetch({
        url:'groups_list_get_v3',
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
          const groupList = res.Data;
          this.groupFeeList = [];
          groupList.forEach(items => {
            if (items.isPaid) {
              this.groupFeeList.push(items);
            }
          });
          if (this.groupType === 'pay') {
            this.groupIncrease();
          }
          if (this.groupType === 'isPaid') {
            this.getData();
          }
        }
      })
     },
     // 提交权限选择
     submitGroupList() {
       if (this.groupType === 'pay' || this.groupType === 'isPaid') {
         if (this.groupFeeName === '') {
          this.$message.error("用户组名称不能为空");
          return;
         }
         if (this.groupPrice === '') {
          this.$message.error("付费金额不能为空");
          return;
         }
         if (this.groupPrice < 0.1 || this.groupPrice > 10000) {
          this.$message.error("付费金额为0.1~10000之间");
          return;
         }
         if (this.groupDays === '') {
          this.$message.error("付费有效期不能为空");
          return;
         }
         if (this.groupDays < 1 || this.groupDays > 10000) {
           this.$message.error("付费有效期为1~10000之间的整数");
           return;
          }
         if (this.groupType === 'pay') {
           this.getGroups();
         }
         if (this.groupType === 'isPaid') {
          this.submitClick();
        }
      } else {
        this.submitClick();
        if (Number(this.groupId) === 8) {
          this.freeExperienceGroup();
        }
      }
     },
     groupIncrease() {
      this.appFetch({
        url: "groups_create_post_v3",
        method: "post",
        data: {
          "name": this.groupFeeName,
          "type": "groups",
          "default": false,
          "isDisplay": false,
          "isPaid": 1,
          "fee": this.groupPrice,
          "days": this.groupDays,
          "level": this.groupFeeList.length + 1,
          "description": this.groupDescription,
          "notice": this.groupNotice
        }
      })
      .then( res => {
        if (res.errors){
          this.$message.error(res.errors[0].code);
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          const groupData = res.Data;
          this.groupId = groupData.id;
          this.groupDataName = groupData.name;
          this.submitClick();
        }
      })
     },
     submitClick() {
       if (!this.checkNum()) {
         return;
       }
       if (!this.checkSelect()) {
         return;
       }
       if (this.value) {
         if (this.purchasePrice <= 0) {
           this.$message.error("价格不能为0");
           return;
         } else if (this.purchasePrice == " ") {
           this.$message.error("价格不能为空");
           return;
         } else if (this.dyedate <= 0) {
           this.$message.error("到期时间不能为0");
           return;
         } else if (this.dyedate == " ") {
           this.$message.error("到期时间不能为空");
           return;
         } else {
           this.patchGroupScale();
         }
       } else {
         this.patchGroupScale();
       }  
     },
 
     /*
      * 接口请求
      * */
     getSiteInfo() {
       return this.appFetch({ url: 'forum_get_v3', method: "get" });
     },
     getCategories() {
       return this.appFetch({ url: "categories_list_get_v3", method: "get" });
     },
     getGroupResource() {
       return this.appFetch({
         url: "permission_get_v3",
         method: "get",
         params: {
           id: this.groupId,
           include: 'permission',
         }
       })
     },
     operateRequest() {
      return this.appFetch({url: "permissionlist_get", method: "get", data: {groupId: this.groupId}})
     },
     patchGroupPermission() {
       let checked = this.checked;
       if (this.isSubordinate) {
         if (checked.indexOf("other.canInviteUserScale") === -1) {
           checked.push("other.canInviteUserScale");
         }
       } else {
         checked = checked.filter(v => v !== "other.canInviteUserScale");
       }
 
       const param = {
         groupId: this.groupId,
         permissions: checked,
       }
 
       this.appFetch({
         url: "permission_update_v3",
         method: "post",
         data: param,
       })
         .then(res => {
           if (res.Code === 0) {
             this.$message({
               showClose: true,
               message: "提交成功",
               type: "success"
             });
             this.getData();
           } else {
             this.$message.error(res.Message);
           }
         })
         .catch(err => { });
     },
 
     patchGroupScale() {
       let params = [];
       if (this.groupType === 'pay') {
         params = [{
            id: this.groupId,
            name: this.groupDataName,
            scale: this.scale,
            isSubordinate: this.isSubordinate,
         }];
       } else if (this.groupType === 'isPaid') {
         if (this.activeTab.name === 'other') {
            params = [{
              id: this.groupId,
              name: this.groupFeeName,
              scale: this.scale,
              isSubordinate: this.isSubordinate,
            }];
         } else {
           this.groupFeeList.forEach(item => {
             item.default = false;
             if (Number(this.groupId) === item.id) {
              item.name = this.groupFeeName;
              item.fee = this.groupPrice;
              item.days = Number(this.groupDays);
              item.description = this.groupDescription;
              item.notice = this.groupNotice;
             }
           });
           params = this.groupFeeList;
         }
       } else {
         params = [{
          id: this.groupId,
          name: this.$route.query.name,
          scale: this.scale,
          isSubordinate: this.isSubordinate,
        }];
       }
       this.appFetch({
         url: "groups_batchupdate_post_v3",
         method: "post",
         // splice: "/" + this.groupId,
         data: {
           data: params,
         }
       })
         .then(res => {
           if (res.errors) {
             this.$message.error(res.errors[0].code);
           } else {
            if (res.Code !== 0) {
              this.$message.error(res.Message);
              return
            }
             this.patchGroupPermission();
             if (this.groupType !== 'pay') {
               this.operatePost();
             }
           }
         })
         .catch(err => { });
     },
 
     handlePromotionChange(value) {
       this.isSubordinate = value;
     },
 
     checkNum() {
       if (!this.scale) {
         return true;
       }
       const reg = /^([0-9](\.\d)?|10)$/;
       if (!reg.test(this.scale)) {
         this.$message({
           message: "提成比例必须是0~10的整数或者一位小数",
           type: "error"
         });
         return false;
       }
       return true;
     },
     // 分类下拉改变
     changeCategory(value, obj) {
       let threadValue = value;
       let checked = this.checked;
       const isAll = this.checked.includes(obj);
 
      // 获取当前选中的权限字符串;全选权限不用加category
      let selectPermission = [];
      let arr = [];
      value.forEach(item => {
       if (item.length > 1) {
         if (arr.indexOf(item[0]) === -1) {
           arr.push(item[0]);
           threadValue.push([item[0]]);
           this.selectList[obj] = threadValue.filter(v => v[0] !== "");
          //  this.selectList[obj] = threadValue;
         } 
         item.map((val)=> {
           if (selectPermission.indexOf(`category${val}.${obj}` && !selectPermission.includes(obj))) {
             selectPermission.push(`category${val}.${obj}`);
           }
         })
       } else {
         if (item[0]) {
           arr.push(item[0]);
         }
         const data = item[0] ? `category${item[0]}.${obj}` : obj;
         selectPermission.push(data);
       }
      })
       if (isAll) {
         // 取消全选
         this.selectList[obj] = value.filter(v => v[0] !== "");
         selectPermission.shift();
         checked = checked.filter(item => item !== obj);
         checked = [...checked, ...selectPermission];
 
       } else if (selectPermission.includes(obj)) {
         // 非全选-选中全选
         this.selectList[obj].splice(1);
         checked = checked.filter(item => !selectPermission.includes(item));
         checked.push(obj);
         this.keyValue = Math.random();
       } else {
         // 非全选-选中一二级分类项
         checked = checked.filter(item => {
           return !(item.includes('category') && item.includes(obj));
         });
         checked = [...checked, ...selectPermission];
       }
       this.checked = checked;
     },
     // 清除tag
     clearItem(value, obj) {
       let checked = this.checked;
       const removedPermission = value[0] ? `category${value[value.length - 1]}.${obj}` : obj;
       checked = checked.filter(v => v !== removedPermission);
       this.selectList[obj].shift();
       this.checked = checked;
       this.keyValue = Math.random();
     },
     changeChecked(value, obj) {
       if (value) {
          // this.$message({
          //   showClose: true,
          //   message: "编辑权限包含查看权限",
          //   type: "success"
          // });
         this.open();
         if (this.checked.indexOf('switch.thread.viewPosts') === -1) {
          this.checked.push('switch.thread.viewPosts');
         }
        return;
       }
       const checkedData = this.checked;
       const selectedPermission = this.selectList[obj].map(item => {
         return item[0] ? `category${item[item.length - 1]}.${obj}` : obj;
       })
       this.checked = checkedData.filter(v => !selectedPermission.includes(v));
       this.selectList[obj] = [];
     },
     checkSelect() {
       if (this.checked.includes('switch.createThread')) {
         if (this.selectList.createThread.length === 0) {
           this.$message.error("请选择发布帖子权限");
           return false;
         }
       }
 
       if (this.checked.indexOf('switch.thread.reply') !== -1) {
         if (this.selectList['thread.reply'].length === 0) {
           this.$message.error("请选择回复主题权限");
           return false;
         }
       }
 
       if (this.checked.indexOf('switch.viewThreads') !== -1) {
         if (this.selectList.viewThreads.length === 0) {
           this.$message.error("请选择查看主题列表权限");
           return false;
         }
       }
       if (this.checked.indexOf('switch.thread.viewPosts') !== -1) {
         if (this.selectList['thread.viewPosts'].length === 0) {
           this.$message.error("请选择查看主题详情权限");
           return false;
         }
       }
       if (this.checked.indexOf('switch.thread.freeViewPosts') !== -1) {
         if (this.selectList['thread.freeViewPosts'].length === 0) {
           this.$message.error("请选择免费查看付费帖子权限");
           return false;
         }
       }
       if (this.checked.indexOf('switch.thread.essence') !== -1) {
         if (this.selectList['thread.essence'].length === 0) {
           this.$message.error("请选择加精权限");
           return false;
         }
       }
       if (this.checked.indexOf('switch.thread.edit') !== -1) {
         if (this.selectList['thread.edit'].length === 0) {
           this.$message.error("请选择编辑主题权限");
           return false;
         }
       }
       if (this.checked.indexOf('switch.thread.hide') !== -1) {
         if (this.selectList['thread.hide'].length === 0) {
           this.$message.error("请选择删除主题权限");
           return false;
         }
       }
       if (this.checked.indexOf('switch.thread.hidePosts') !== -1) {
         if (this.selectList['thread.hidePosts'].length === 0) {
           this.$message.error("请选择删除回复权限");
           return false;
         }
       }
       if (this.checked.indexOf('switch.thread.editOwnThreadOrPost') !== -1) {
         if (this.selectList['thread.editOwnThreadOrPost'].length === 0) {
           this.$message.error("请选择编辑自己的主题或回复权限");
           return false;
         }
       }
       if (this.checked.indexOf('switch.thread.hideOwnThreadOrPost') !== -1) {
         if (this.selectList['thread.hideOwnThreadOrPost'].length === 0) {
           this.$message.error("请选择删除自己的主题或回复权限");
           return false;
         }
       }
       return true;
     },
 
     // 全选切换
     handleCheckAllChange(val) {
       this.checked = [];
       this.selectList = {
         "createThread": [], // 发布帖子
         'viewThreads': [],
         'thread.reply': [], // 回复主题扩展项
         'thread.edit': [],
         'thread.hide': [],
         'thread.essence': [],
         'thread.viewPosts': [],
         'thread.hidePosts': [],
         'thread.editOwnThreadOrPost': [],
         'thread.hideOwnThreadOrPost': [],
         'thread.freeViewPosts': [],
       };
       if (val) {
         // 1 主权限全选
         this.checkAllPermission.forEach(item => {
           this.checked.push(item);
         })
         // 2 分类扩展全选
         this.checked.push(...this.expandItem)
 
         this.checkAll = true;
         this.setSelectValue(this.checked);
       } else {
         this.checkAll = false;
       }
     },
     operatePost() {
      let params = [];
      this.plugInPermissions.forEach(item => {
        params.push({
          "appId": item.appId,
          "status": item.canUsePlugin ? 1 : 0,
        })
      });
      if (params.length > 0) {
        this.appFetch({
          url: "permission_switch_post",
          method: "post",
          data: {
            "groupId": this.groupId,
            "permissions": params,
          },
        }).then(res => {
          if (res.Code !== 0) {
            setTimeout(() => {
              this.$message.error(res.Message);
            }, 2000)
          }
        })
      } 
    },
    freeExperienceGroup(){
      this.appFetch({
       url:'groups_batchupdate_post_v3',
       method:'post',
       data:{
         data: [
           {
             "name": "免费体验",
             "id": 8,
             "timeRange": this.invitaValue,
             "contentRange": this.limitedDaysValue,
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
       }
     }).catch(err=>{
     })
   },
     open() {
      this.$alert('编辑权限包含查看权限', '提示', {
        confirmButtonText: '确定',
        lockScroll: false,
        callback: action => {
          if (this.checked.indexOf('switch.thread.viewPosts') === -1) {
            this.checked.push('switch.thread.viewPosts');
          }
        }
      });
    }
   },
   created() {
     this.groupType = this.$route.query.type || 'normal';
     this.groupFeeList = this.$route.query.groupFeeData || [];
     this.groupId = this.$route.query.id;
     this.activeTab.title = this.$route.query.title || "操作权限";
     this.activeTab.name = this.$route.query.names || "userOperate";
     if (this.groupType === 'normal') {
       this.getData();
     } else if (this.groupType === 'isPaid') {
       this.getGroups();
     } else {
       this.paymentProcess();
     }
     if (this.groupId === '7') {
       // 游客权限
       this.checkAllPermission = [
         "switch.viewThreads", //查看主题列表
         "switch.thread.viewPosts", //查看主题详情
         "switch.thread.freeViewPosts", //免费查看付费帖子
       ];
     } else {
       this.checkAllPermission = [
         "switch.createThread", // 发布帖子
         "thread.insertImage", // 插入图片
         "thread.insertVideo", // 插入视频
         "thread.insertAudio", // 插入语音
         "thread.insertAttachment", // 插入附件
         "thread.insertPay", // 插入付费
         "thread.insertReward", // 插入悬赏
         "thread.insertRedPacket", // 插入红包
         "thread.insertPosition", // 插入位置
         "thread.insertVote", // 插入投票
         "thread.allowAnonymous", // 发布匿名
         "dialog.create", // 发布私信
         "switch.thread.reply", //回复主题
         "switch.viewThreads", //查看主题列表
         "switch.thread.viewPosts", //查看主题详情
         "switch.thread.freeViewPosts", //免费查看付费帖子
         "thread.viewVideo",  // 查看视频
         "thread.viewAttachment",  // 查看附件
         "thread.downloadAttachment",  // 下载附件
         "thread.sticky", //置顶
         "thread.poster", //海报
         "switch.thread.essence", //加精
         "switch.thread.edit", //编辑主题
         "switch.thread.hide", //删除主题
         "switch.thread.hidePosts", //删除回复
         "switch.thread.editOwnThreadOrPost", //编辑自己的主题或回复
         "switch.thread.hideOwnThreadOrPost", //删除自己的主题或回复
       ];
     }
   },
   components: {
     Card,
     CardRow
   }
 };