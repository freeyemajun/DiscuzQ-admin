
import Card from '../../../view/site/common/card/card';
import CardRow from '../../../view/site/common/card/cardRow';

export default {
  data:function () {
    return {
      tableData: [],
      dialogVisible: false,
      fileList: [],
      uploadType: '',
      uploadDetails: '',
    }
  },
  created() {
    this.importDataBtn();
  },
  methods:{
    determineBtn(type, scope) {
      this.uploadType = type;
      this.uploadDetails = scope.row;
      this.dialogVisible = true;
    },
    // detailsClick() {
    //   this.dialogVisible = true;
    // },
    plugInRelease(id, num) {
      this.appFetch({
        url:'panel_operate_post_v3',
        method:'post',
        data: {
          appId: id,
          operate: num
        },
      })
      .then(data => {
        if (data.errors){
          this.$message.error(data.errors[0].code);
        }else {
          if (data.Code !== 0) {
            this.$message.error(data.Message);
            return
          }
          if (num === 1) {
            this.$message({
              message: '插件发布成功',
              type: 'success'
            });
          }
          if (num === 2) {
            this.$message({
              message: '插件下线成功',
              type: 'success'
            });
          }
          if (num === 3) {
            this.$message({
              message: '插件删除成功',
              type: 'success'
            });
          }
          this.importDataBtn();
        }
      })
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    beforePluginUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (isLt20M == true) {
      }
      return isLt20M;
    },
    uploaderPlugin(e) {
      let logoFormData = new FormData();
      logoFormData.append("file", e.file);
      this.appFetch({
        url:'panel_upload_post_v3',
        method:'post',
        data: logoFormData,
      })
      .then(data => {
        if (data.errors){
          this.$message.error(data.errors[0].code);
        }else {
          if (data.Code !== 0) {
            this.$message.error(data.Message);
            return
          }
          this.$message({
            message: '插件上传成功',
            type: 'success'
          });
          this.importDataBtn();
        }
      })
    },
    importDataBtn() {
      this.appFetch({
        url:'plugin_list_get_v3',
        method:'get',
        data:{}
      }).then(data=>{
        if (data.errors){
          this.$message.error(data.errors[0].code);
        }else {
          if (data.Code !== 0) {
            this.$message.error(data.Message);
            return
          }
          this.tableData = data.Data;
        }
      })
    },
    typeConversion(type) {
      switch (type) {
        case 0: return '完全自定义插件';
          break;
        case 1: return '帖子新增类型';
          break;
        case 2: return '外部数据导入';
          break;
        case 3: return '广告插件';
          break;
        case 4: return '首页banner插件';
          break;
        case 5: return '表情插件';
          break;
        default:
          break;
      }
    }
  },
  components:{
    Card,
    CardRow
  }
}