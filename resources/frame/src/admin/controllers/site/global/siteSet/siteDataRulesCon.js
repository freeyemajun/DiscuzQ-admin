import Card from "../../../../view/site/common/card/card";
import CardRow from "../../../../view/site/common/card/cardRow";
import webDb from 'webDbHelper';
import commonHelper from '../../../../../helpers/commonHelper';

export default {
  components:{
    Card,
    CardRow
  },
  data(){
    return {
      radio: '',
      exhibition: '',
      upgradeData: [],
      groupEdit: false,
      counter: '',
      toppingList: [],
    }
  },
  created(){
    // 初始化状态
    this.initializeData();
    this.toppingListObtain();
  },
  methods:{
    initializeData() {
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
            this.radio = forumData.setSite.openViewCount;
            this.exhibition = forumData.other.threadTab;
        }
      })
    },
    jumpDataRules() {
      this.$router.push({ path: '/admin/site-sort-set'});
    },
    ruleSubmission() {
      this.appFetch({
        url:'bopen_view_count_post',
        method:'post',
        data: {
          openViewCount: Number(this.radio),
        }
      }).then(res => {
        if (res.errors){
          this.$message.error(res.errors[0].code);
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.exhibitionPost();
          if (this.upgradeData.length > 0) {
            this.toppingSubmit();
          }
        }
      })
    },
    exhibitionPost() {
      this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
          data:[
            {
              key: "thread_tab",
              value: this.exhibition,
              tag: "default"
            }  
          ]
        }
      }).then(res => {
        if (res.errors){
          this.$message.error(res.errors[0].code)
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          this.initializeData();
        }
      })
    },
    toppingListObtain() {
      this.appFetch({
        url: 'thread_stick_get_v3',
        method: "get",
        data: {}
      })
      .then(res => {
        if (res.errors) {
          this.$message.error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.upgradeData = res.Data;
        }
      })
    },
    toppingSubmit() {
      let toppingList = [];
      this.upgradeData.forEach((item, index) => {
        toppingList.push({
          id: item.threadId,
          sort: index + 1,
        })
      });
      this.toppingListSort(toppingList)
    },
    toppingListSort(arr) {
      this.appFetch({
        url:'stick_sort_set_post_v3',
        method:'post',
        data:{
          data: arr,
        }
      })
      .then(res => {
        if (res.errors){
          this.$message.error(res.errors[0].code)
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.toppingListObtain();
        }
      })
    },
    rechargePost() {
      this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
          data:[
            {
              "key":"site_charge",
              "value": this.recharge ? 1 : 0,
              "tag": "default"
            },
          ]
        }
      }).then(res=>{
        if (res.errors){
          this.$message.error(res.errors[0].code)
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          this.loadFunctionStatus();
        }
  
      }).catch(err=>{
        this.$message.error('操作失败！');
      })
    },
    relieveTopping(scope) {
      this.appFetch({
        url: 'threads_batch_post_v3',
        method: 'post',
        data: {
          ids: scope.row.threadId,
          isSticky: 0,
        }
      })
      .then(res => {
        if (res.errors){
          this.$message.error(res.errors[0].code)
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message({
            message: '取消置顶成功',
            type: 'success'
          });
          this.toppingListObtain();
        }
      })
    },
    relieveToppingopen(scope) {
      this.$confirm('确认要取消置顶贴子吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false,
      }).then(() => {
        this.relieveTopping(scope);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
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
    filterContent(text) {
      const emojis = webDb.getLItem('Emoji');
      return commonHelper.convertEmoticon(text, emojis);
    }
  },
}