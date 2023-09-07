/*
* 用户角色控制器
* */

import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';
import TableContAdd from '../../../../view/site/common/table/tableContAdd';

export default {
  data:function () {
    return {
      tableData: [],
      alternateLength:0,    //数据长度备份
      feeDataLength: 0,
      radio:'',             //设为加入站点的默认级别
      alternateRadio:'',    //默认级别选中备份
      radioName:'',         //默认级别名称
      radioIndex:'',        //默认级别序号
      deleteStatus:true,
      multipleSelection:[],
      addStatus:false,
      btnLoading:false,     //提交按钮状态
      paidLoading: false,
      delLoading:false,     //删除按钮状态
      groupId: '',       // 用户组id
      upgradeData: [],
      groupEdit: false,
      counter: '',
    }
  },
  methods:{
    handleSelectionChange(val) {
      this.multipleSelection = val;

      if (this.multipleSelection.length >= 1){
        this.deleteStatus = false
      } else {
        this.deleteStatus = true
      }
    },
    /*checkSelect(val){

    },*/

    radioChange(val,index){
      this.radioName = val.name;
      this.radioIndex = index;
      this.groupId = val.id;
    },

    checkSelectable(row){
      switch (row.id){
        case 1:
          return false;
        case 6:
          return false;
        case 7:
          return false;
        case 10:
          return false;
        default:
          return true;
      }
    },

    addList(){
      if (this.alternateLength >= this.tableData.length){
        this.tableData.push(
          {
            "name": "",
            "type": "",
            "color": "",
            "icon": ""
          }
        );
      }
      this.addStatus = true;
    },
    
    upgradeList() {
      this.$router.push({ path: '/admin/rol-permission', query: { type: 'pay', groupFeeData: this.upgradeData} });
    },
    paidNewbtn() {
      this.paidLoading = true;
      this.groupEdit = false;
      let data = []
      this.upgradeData.forEach((item, index) => {
        data.push({
          "name": item.name,
          'id': item.id,
          'isDisplay': item.isDisplay,
          'level': index + 1,
          'visible': false,
        })
        item.level = index + 1;
      });
      this.batchPatchGroup(data);
    },
    submitClick(){
      this.btnLoading = true;
      /*if (this.addStatus && this.multipleSelection.length > 0){
        this.$message({
          showClose: true,
          message: '新增用户角色未提交！请先提交，再操作其他角色',
          type: 'warning'
        });
      } else*/
      if (this.addStatus){
        let singleData = {
          "type": "groups",
          "name": "",
          'default':''
        };    //单个

        let batchData = [];   //批量

        for (let i = this.alternateLength;i < this.tableData.length;i++){
          /*
          * 批量添加写法，接口暂时不支持
          * */
          /*batchData.push({
            "type": "groups",
            "attributes": {
              "name": this.tableData[i].name,
              "type": "",
              "color": "",
              "icon": ""
            }
          })*/

          /*
          * 单个添加用户组写法
          * */
          singleData.name = this.tableData[i].name;
        }

        if (this.radioIndex + 1 === this.tableData.length){
          singleData.default = 1;
        }

        this.postGroups(singleData);
      } else {
        let data = [];
        this.tableData.forEach((item)=>{
          data.push({
            "name": item.name,
            'id': item.id,
            'isDisplay': item.isDisplay,
            'default': item.id == this.radio,
          })
        });
        this.batchPatchGroup(data);
      }
      // this.PermissionPurchaseAllowed();
    },

    singleDelete(index, id, type) {
      if (type === 'normal') {
        if (index > this.alternateLength - 1){
          this.tableData.pop();
          this.addStatus = false;
        } else {
          this.singleDeleteGroup(id);
        }
      } else if (type === 'pay') {
        this.upgradeData[index].visible = false;
        if (index > this.upgradeData.length - 1){
          this.upgradeData.pop();
        } else {
          this.singleDeleteGroup(id);
        }
      }
    },

    deleteClick(){
      this.delLoading = true;
      let data = {
        id:[]
      };
      this.multipleSelection.forEach((item)=>{
        data.id.push(item.id)
      });

      this.batchDeleteGroup(data)
    },

    /*
    * 接口请求
    * */
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
          this.tableData = [];
          this.upgradeData = [];
          groupList.forEach(items => {
            if (items.isPaid === 1) {
              this.upgradeData.push(items);
            } else {
              this.tableData.push(items);
            }
          })
          // this.tableData = res.Data;
          this.alternateLength = this.tableData.length;
          this.tableData.forEach((item) => {
            this.groupName = item.isDisplay;
            if (item.default == 1) {
              this.radio = item.id;
              this.alternateRadio = item.id;
            }
          })
          this.orderList();
        }
      }).catch(err=>{
      })
    },
    postGroups(data){
      this.appFetch({
        url:"groups_create_post_v3",
        method:"post",
        data: data
      }).then(res=>{
        this.btnLoading = false;
        this.paidLoading = false;
        if (res.errors){
          if (res.errors[0].detail){
            this.$message.error(res.errors[0].code + '\n' + res.errors[0].detail[0])
          } else {
            this.$message.error(res.errors[0].code);
          }
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message({
            message: '提交成功！',
            type: 'success'
          });
          this.addStatus = false;
          this.getGroups();
        }
      }).catch(err=>{
      })
    },
    singleDeleteGroup(id){
      this.appFetch({
        url:'groups_batchdelete_post_v3',
        method:'post',
        data:{
          ids: id
        }
      }).then(res=>{
        if (res.errors){
          this.$message.error(res.errors[0].code);
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.getGroups();
        }
      }).catch(err=>{
      })
    },
    batchDeleteGroup(data){
      const idString = data.id.toString();
      this.appFetch({
        url:'groups_batchdelete_post_v3',
        method:'post',
        data: {
          ids: idString
        }
      }).then(res=>{
        this.delLoading = false;
        if (res.errors){
          this.$message.error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.getGroups();
        }
      }).catch(err=>{
      })
    },
    // singlePatchGroup(id,name){s
    //   this.appFetch({
    //     url:'groups',
    //     method:'patch',
    //     splice:'/' + id,
    //     data:{
    //       data:{
    //         "attributes": {
    //           'name':name,
    //           'default':1
    //         }
    //       }
    //     }
    //   }).then(res=>{
    //     this.btnLoading = false;
    //     if (res.errors){
    //       this.$message.error(res.errors[0].code);
    //     }else {
    //       this.$message({
    //         message: '提交成功！',
    //         type: 'success'
    //       });
    //       this.getGroups();
    //     }
    //   }).catch(err=>{
    //   })
    // },
    batchPatchGroup(data){
      this.appFetch({
        url:'groups_batchupdate_post_v3',
        method:'post',
        data:{
          data
        }
      }).then(res=>{
        this.btnLoading = false;
        this.paidLoading = false;
        if (res.errors){
          this.$message.error(res.errors[0].code);
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message({
            message: '提交成功！',
            type: 'success'
          });
          this.getGroups();
        }
      }).catch(err=>{
      })
    },
    PermissionPurchaseAllowed () {
      this.appFetch({
        url: "groups",
        method: "PATCH",
        splice: "/" + this.groupId,
        data: {
          data: {
            attributes: {
              name: this.radioName,
              is_paid: 0,
            }
          }
        }
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {});
    },

    extension(id) {
      this.appFetch({
        url: "invite_link_v3",
        method: 'get',
        data: {
          groupId: id
        }
      }).then(res => {
        if (res.errors){
        this.$message.error(res.errors[0].code);
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          const oInput = document.createElement('input');
          oInput.value = `${window.location.protocol}//${window.location.host}/forum/partner-invite?inviteCode=${res.Data.code}`;
          oInput.id = 'copyInput';
          document.body.appendChild(oInput);
          oInput.select();
          document.execCommand('Copy');
          this.$message({
            message: '链接已复制到剪贴板',
            type: 'success'
          });
          setTimeout(() => {
            oInput.remove();
          }, 100);
        }
      });
    },
    riseOperation(scope) {
      this.groupEdit = true;
      let payData = [...this.upgradeData];
      let newData = [...this.upgradeData];
      newData.splice(scope.$index, 1);
      newData.splice(scope.$index - 1, 0, payData[scope.$index]);
      this.counter = scope.$index - 1;
      setTimeout(() => {
        this.counter = '';
      }, 500);
      this.upgradeData = newData;
    },
    dropOperation(scope) {
      this.groupEdit = true;
      let payData = [...this.upgradeData];
      let newData = [...this.upgradeData];
      newData.splice(scope.$index, 1);
      newData.splice(scope.$index + 1, 0, payData[scope.$index]);
      this.counter = scope.$index + 1;
      setTimeout(() => {
        this.counter = '';
      }, 500);
      this.upgradeData = newData;
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === this.counter) {
        return 'success-row';
      }
      return '';
    },
    cancelClick(scope) {
      this.upgradeData[scope.$index].visible = false;
    },
    // 数据排序
    orderList() {
      this.upgradeData.sort(this.soreoder('level'));
    },
    // 数据排序
    soreoder(property) {
      return (a, b) => {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
      }
    },
  },
  created(){
    this.getGroups();
  },
  components:{
    Card,
    CardRow,
    TableContAdd
  }
}
