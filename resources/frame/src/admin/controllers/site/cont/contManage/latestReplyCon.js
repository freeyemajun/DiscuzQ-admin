/*
* 内容管理：最新回复控制器
* */

import ContArrange from '../../../../view/site/common/cont/contArrange';
import tableNoList from '../../../../view/site/common/table/tableNoList'
import Page from '../../../../view/site/common/page/page';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import webDb from 'webDbHelper';
import commonHelper from '../../../../../helpers/commonHelper';


export default {
  data:function () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      searchData:{
        pageSelect:'10',         //每页显示数
        themeAuthor:'',          //主题作者
        themeKeyWords:'',        //主题关键词
        dataValue:['',''],            //发表时间范围
      },

      checkAll: false,      //全选状态
      checkAllNum:0,        //多选打勾数
      themeListAll : [],    //主题列表全部
      checkedTheme:[],      //多选列表初始化
      isIndeterminate: false,   //全选不确定状态

      themeList:[],         //主题列表
      currentPag: 1,        //当前页数
      total:0,              //主题列表总条数
      pageCount:1,          //总页数
      showViewer:false,     //预览图
      subLoading:false,     //提交按钮状态 
      visible: false,
    }
  },
  methods:{
    closeDelet(index) {
      this.$refs[index][0].doClose();
    },
    searchClick(){
      //处理时间为空
      this.searchData.dataValue = this.searchData.dataValue == null?['','']:this.searchData.dataValue;
      this.currentPag = 1;
      this.getPostsList(1);
    },

    /*
    * 格式化日期
    * */
    formatDate(data){
      return this.$dayjs(data).format('YYYY-MM-DD HH:mm')
    },

    handleCheckAllChange(val){
      this.checkedTheme = val ? this.themeListAll : [];
      this.isIndeterminate = false;
    },

    handleCheckedCitiesChange(index, id, status) {
      let checkedCount = this.checkedTheme.length;
      this.checkAll = checkedCount === this.themeListAll.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.themeListAll.length;

    },

    handleCurrentChange(val){
      document.getElementsByClassName('index-main-con__main')[0].scrollTop = 0;
      this.isIndeterminate = false;
      this.currentPag = val;
      this.checkAll = false;
      this.getPostsList(val);
    },

    deleteAllClick(){
      this.subLoading = true;

      /*let deleList = [];
      this.themeList.forEach((item,index)=>{
        deleList.push(item._data.id)
      });*/

      let data = [];

      this.checkedTheme.forEach((item)=>{
        data.push(
          {
            "id": item,
            "isDeleted": true
          },
        )
      });

      this.deletedPostsBatch(data)
    },

    imgShowClick(list,imgIndex){
      this.url = [];
      let urlList = [];

      list.forEach((item)=>{
        urlList.push(item.url)
      });

      this.url.push(urlList[imgIndex]);

      urlList.forEach((item,index)=>{
        if (index > imgIndex){
          this.url.push(item);
        }
      });

      urlList.forEach((item,index)=>{
        if (index < imgIndex){
          this.url.push(item);
        }
      });

      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    },

    singleOperationSubmit(val, postId,threadId){
      switch (val){
        case 1:
          this.deletedPosts(postId);
          break;
        case 2:
          let routeData = this.$router.resolve({
            path: `/reply-to-topic/${threadId}/${postId}`,query:{edit:'reply'}
          });
          window.open(routeData.href, '_blank');
          break;
        default:
          this.$message.error("系统错误，请刷新页面");
      }
    },

    titleIcon(item){
      return commonHelper.titleIcon(item);
    },

    /*
    * 接口请求
    * */
    getPostsList(pageNumber){
      let searchData = this.searchData;
      this.appFetch({
        url:'posts_get_v3',
        method:'get',
        data:{
          page: pageNumber,
          perPage: searchData.pageSelect,
          isDeleted: 'no',
          isApproved: 1,
          q: searchData.themeKeyWords,
          nickname: searchData.themeAuthor,
          createdAtBegin: searchData.dataValue[0],
          createdAtEnd: searchData.dataValue[1],
          sort: '-created_at',
        }
      }).then(res=>{
        if (res.errors){
          this.$message.error(res.errors[0].code);
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.themeList = res.Data.pageData;
          this.total = res.Data.totalCount;
          this.pageCount = res.Data.totalPage;
          this.themeListAll = [];
          this.themeList.forEach((item, index) => {
            this.themeListAll.push(item.postId);
          });
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    deletedPostsBatch(data){
      this.appFetch({
        url:'submit_review_post_v3',
        method:'post',
        data:{
          type: 2,
          data
        }
      }).then(res=>{
        this.subLoading = false;
        if (res.errors){
          this.$message.error(res.errors[0].code);
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.getPostsList(Number(webDb.getLItem('currentPag')) || 1);
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.isIndeterminate = false;
          this.checkAll = false;
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    deletedPosts(id){
      this.appFetch({
        url:'submit_review_post_v3',
        method:'post',
        data:{
          type: 2,
          data:[
            {
              id: id,
              isDeleted: true,
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
          this.getPostsList(Number(webDb.getLItem('currentPag')) || 1);
          this.$message({
            message: '操作成功',
            type: 'success'
          });
        }
      })
    },

    contentIndexes(data, val) {
      return commonHelper.dataTypeJudgment(data, val);
    },
    filterContent(text) {
      const emojis = webDb.getLItem('Emoji');
      return commonHelper.convertEmoticon(text, emojis);
    }
  },
  created(){
    this.currentPag = Number(webDb.getLItem('currentPag'))||1;
    this.getPostsList(Number(webDb.getLItem('currentPag'))||1);
  },
  components:{
    ContArrange,
    tableNoList,
    ElImageViewer,
    Page
  }
}
