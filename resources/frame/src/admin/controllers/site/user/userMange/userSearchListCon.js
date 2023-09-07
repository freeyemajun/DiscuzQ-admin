/*
* 用户搜索结果
* */

import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';
import Page from '../../../../view/site/common/page/page';
import webDb from 'webDbHelper';

export default {
  data: function () {
    return {
      tableData: [],
      getRoleNameById: {},
      multipleSelection: [],
      deleteStatus: true,
      pageLimit: 20,
      pageNum: 1,
      query: {},
      total: 0,
      disabled: true,//禁用表单上的游客
    }
  },

  created() {
    this.query = this.$route.query;
    // this.handleGetUserList();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.name !== from.name && from.name !== null) {
        vm.getCreated(true)
      } else {
        vm.getCreated(false)
      }
    })
  },
  methods: {
    getCreated(state) {
      if (state) {
        this.pageNum = 1;
      } else {
        this.pageNum = Number(webDb.getLItem('currentPag')) || 1;
      }
      this.handleGetUserList(true);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.deleteStatus = this.multipleSelection.length < 1
    },

    async handleGetUserList() {
      try {
        const {
          username,
          uickname,
          userUID,
          userRole,
          userPhone,
          userStatus,
          userWeChat,
          isReal,
        } = this.query;
        const response = await this.appFetch({
          method: "get",
          url: 'user_list_get_v3',
          data: {
            "perPage": this.pageLimit,
            "page": this.pageNum,
            "filter[username]": username,
            "filter[nickname]": uickname,
            "filter[id]": userUID,
            "filter[groupId][]": userRole,
            "filter[mobile]": userPhone,
            "filter[status]": userStatus,
            "filter[wechat]": userWeChat,
            "filter[isReal]": isReal
          }
        });
        if (response.errors) {
          throw new Error(response.errors[0].code);
        } else {
          this.total = response.Data.totalCount;
          // this.pageNum = response.meta.pageCount;
          // this.total = response.meta ? response.meta.total : 0;
          this.tableData = response.Data.pageData;
        }
      } catch (err) {

      }
    },

    // handleCurrentChange(val){
    //   this.pageNum = val;
    //   webDb.setLItem('currentPag',val);
    //   this.handleGetUserList();
    // },

    async exporUserInfo() {
      try {
        let usersIdList = [];
        this.multipleSelection.forEach((v) => {
          usersIdList.push(v.userId)
        });
        const {
          username,
          uickname,
          userUID,
          userRole,
          userPhone,
          userStatus,
          userWeChat,
          isReal,
        } = this.query;
        let paramData = {};
        if (this.tableData.length > 0) {
          paramData = {
            "ids": usersIdList.toString(),
            "filter[username]": username,
            "filter[nickname]": uickname,
            "filter[id]": userUID,
            "filter[group_id]": userRole,
            "filter[mobile]": userPhone,
            "filter[status]": userStatus,
            "filter[wechat]": userWeChat,
            "filter[isReal]": isReal
          }
        }
        const response = await this.appFetch({
          method: 'get',
          url: 'export_users_post_v3',
          data: paramData,
          responseType: 'arraybuffer'
        });
        const blob = new Blob([response], { type: 'application/x-xls' });
        const url = window.URL || window.webkitURL || window.moxURL;
        const downloadHref = url.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = downloadHref;
        a.download = 'user_excel.xlsx';
        a.click();
        a = null;
      } catch (err) {
      }
    },

    // async deleteBatch() {
    //   if (this.multipleSelection.length <= 0) {
    //     return;
    //   }
    //   try {
    //     let userIdList = [];
    //     this.multipleSelection.forEach((v) => {
    //       userIdList.push(v._data.id)
    //     });

    //     await this.appFetch({
    //       method: 'delete',
    //       url: 'users',
    //       data: {
    //         "data": {
    //           "attributes": {
    //             "id": userIdList
    //           }
    //         }
    //       }
    //     });

    //     this.handleGetUserList();
    //   } catch (err) {
    //   }
    // },
		/**
		 * 批量禁用
		 * 日期 2020-02-11
		 */
    // async 
    disabledBatch() {
      // 如果未选择复选框，则不允许弹出弹框
      if (this.multipleSelection.length <= 0) {
        return;
      } else {
        this.$MessageBox.prompt('', '提示', {
          confirmButtonText: '提交',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入禁用理由'
        }).then((value) => {
          if (value.value === null) {
            this.$message.error('请填写禁用理由');
            return
          }
          // 点击提交后，将复选框内容对象放入数组
          let dataList = [];
          this.multipleSelection.forEach((v) => {
            dataList.push({
              "id": v.userId,
              "status": 1,
              "rejectReason": value.value
            })
          });
          // 进行后台请求
          this.appFetch({
            url: 'users_examine_post_v3',
            method: 'post',
            data: {
              "data": dataList
            }
          });

          // 数据提交完成之后 重新获取页面列表
          this.handleGetUserList();

          // } catch(err){
          // }
        }).catch((err) => {
        });
      }


      //   	this.$MessageBox.prompt('', '提示', {
      //     	confirmButtonText: '提交',
      //     	cancelButtonText: '取消',
      //     	inputPlaceholder:'请输入禁用理由'
      //   	}).then((value)=>{
      //     	data.id.push(id);
      //     	data.status = 3;
      //     	data.remark = value.value;
      //     	this.postReview(data);
      //   	}).catch((err) => {
      //   	});
      //    if(this.multipleSelection.length <= 0){
      //      return;
      //    }
      //    try{
      //      let dataList = [];
      //      this.multipleSelection.forEach((v)=>{
      //        dataList.push({
      //          "attributes": {
      //            "id": v._data.id,
      //            "groupId": v.groups[0] ? v.groups[0]._data.id : '',
      //            "status": 1
      //          }
      //        })
      //      });
      //
      //      await this.appFetch({
      //        method: 'PATCH',
      //        url: 'users',
      //        data: {
      //          "data": dataList
      //        }
      //      });
      //
      //      this.handleGetUserList();
      //    } catch(err){
      //    }
    },

		/**
		 * 独立禁用
		 * 日期 2020-02-11
		 */
    handleDisable(scope) {
      // 弹出提示框，提示是否要禁用用户
      this.$MessageBox.prompt('', '提示', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入禁用理由'
      }).then((value) => {
        if (value.value === null) {
          this.$message.error('请填写禁用理由');
          return
        }
        // 获取当前行的对象值
        const data = scope.row;
        // 进行后台请求
        this.appFetch({
          url: 'users_examine_post_v3',
          method: "post",
          // splice: `/${data.id}`,
          data: {
            "data": [
              {
                id: data.userId,
                "status": 1,
                'rejectReason': value.value
              }
            ]
          }
        }).then(res => {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.handleGetUserList();
          //将禁用置灰
          this.tableData[scope.$index].status = 1;
        });
        // } catch(err){
        // }
      }).catch((err) => {
      });

      //    try{
      //      const data = scope.row._data;
      //      await this.appFetch({
      //        method: "PATCH",
      //        url: 'users',
      //        splice: `/${data.id}`,
      //        data: {
      //          "data": {
      //            "attributes": {
      //              "status": 1
      //            }
      //          }
      //        }
      //      })
      //      this.tableData[scope.$index]._data.status = 1;
      //    } catch(err){
      //    }
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.handleGetUserList();
    }
  },
  components: {
    Card,
    CardRow,
    Page
  }
}
