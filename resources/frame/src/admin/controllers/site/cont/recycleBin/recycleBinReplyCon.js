/*
* 回收站-回帖控制器
* */

import Card from '../../../../view/site/common/card/card';
import ContArrange from '../../../../view/site/common/cont/contArrange';
import Page from '../../../../view/site/common/page/page';
import tableNoList from '../../../../view/site/common/table/tableNoList';
import webDb from 'webDbHelper';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import commonHelper from "../../../../../helpers/commonHelper";


export default {
  data:function () {
    return {
      searchUserName:'',  //作者
      keyWords:'',        //关键词
      operator:'',        //操作人
      // categoriesList:[],
      // categoriesListSelect:'',    //搜索分类选中
      categoriesList: [
        {
          label: '所有分类',
          value: 0
        }
      ], 
      categoriesListSelect:[0],
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
      releaseTime: ['',''],       //发布时间范围
      deleteTime: ['',''],        //删除时间范围

      radioList:'',               //主题左侧单选
      deleteStatusList:[],        //硬删除列表

      appleAll:false,             //应用其他页面
      themeList:[],               //主题列
      currentPaga: 1,             //当前页数
      total:0,                    //主题列表总条数
      pageCount:1,                //总页数
      submitForm:[],              //提交操作表单
      showViewer:false,           //预览图
      url:[],
      subLoading:false,           //提交按钮状态
      btnLoading:0,               //0表示没有loading状态，1：全部还原、2：全部删除
      visible: false,

    }
  },

  methods:{

    titleIcon(item){
      return commonHelper.titleIcon(item);
    },
    filterContent(text) {
      const emojis = webDb.getLItem('Emoji');
      return commonHelper.convertEmoticon(text, emojis);
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

    searchClick(){
      this.releaseTime = this.releaseTime == null ? ['',''] : this.releaseTime;
      this.deleteTime = this.deleteTime == null ? ['',''] : this.deleteTime;
      this.currentPaga = 1;
      this.getPostsList(1);
    },

    handleCurrentChange(val){
      document.getElementsByClassName('index-main-con__main')[0].scrollTop = 0;
      webDb.setLItem('currentPag',val);
      this.currentPaga = val;
      this.getPostsList(val);
    },

    submitClick() {
      this.subLoading = true;
      this.deleteStatusList = [];
      const submitData = [];
      this.submitForm.forEach((item,index)=>{
        if (item.radio === '删除') {
          submitData.push({
            isDeleted: true,
            id: item.id
          })
        }
        if (item.radio === '还原') {
          submitData.push({
            isDeleted: false,
            id: item.id
          })
        }
      });
      if (submitData.length > 0){
        this.patchPostsBatch(submitData);
      }

    },

    allOperationsSubmit(val){
      this.btnLoading = val;
      let deleteStr = '';
      let submitData = [];
      switch (val){
        case 1:
          this.submitForm.forEach((item,index)=>{
            submitData.push({
              isDeleted: false,
              id: item.id
            })
          });
          this.patchPostsBatch(submitData);
          break;
        case 2:
          this.submitForm.forEach((item,index)=>{
            submitData.push({
              isDeleted: true,
              id: item.id
            })
          });
          this.patchPostsBatch(submitData);
          break;
        default:
      }
    },

    /*
    * 格式化日期
    * */
    formatDate(data){
      return this.$dayjs(data).format('YYYY-MM-DD HH:mm')
    },


    /*
    * 接口请求
    * */
    getPostsList(pageNumber){
      this.appFetch({
        url:'posts_get_v3',
        method:'get',
        data:{
          'isDeleted':'yes',
          'nickname':this.searchUserName,
          'page':pageNumber,
          'perPage':10,
          'q':this.keyWords,
          'categoryId':this.categoriesListSelect[this.categoriesListSelect.length - 1],
          'deletedNickname':this.operator,
          'createdAtBegin':this.releaseTime[0],
          'createdAtEnd':this.releaseTime[1],
          'deletedAtBegin':this.deleteTime[0],
          'deletedAtEnd':this.deleteTime[1],
          'sort':'-deleted_at'
        }
      }).then(res=>{
        if (res.errors){
          this.$message.error(res.errors[0].code);
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          const {Data: data} = res;
          this.themeList = [];
          this.submitForm = [];
          this.themeList = data.pageData || [];
          this.total = data.totalCount;
          this.pageCount = data.totalPage;

          this.themeList.forEach((item, index) => {
            this.submitForm.push({
              radio: '',
              id: item.postId
            })
          });
        }
      }).catch(err=>{
      })
    },
    getCategories(){
      this.appFetch({
        url:'categories_get_v3',
        method:'get',
        data:{}
      }).then(res=>{
        if (res.errors){
          this.$message.error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          const {Data: data} = res;
          data.forEach(item => {
            if (item.children.length > 0) {
              const child = []
              item.children.forEach(c => {
                child.push({
                  label: c.name,
                  value: c.searchIds
                })
              })
              this.categoriesList.push({
                label: item.name,
                value: item.searchIds,
                children: child
              })
            } else {
              this.categoriesList.push({
                label: item.name,
                value: item.searchIds
              })
            }
          })
        }
      }).catch(err=>{
      })
    },
    patchPostsBatch(data){
      this.appFetch({
        url:'submit_review_post_v3',
        method:'post',
        data:{
          type: 2,
          data
        }
      }).then(res=>{
        this.subLoading = false;
        this.btnLoading = 0;
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
      }).catch(err=>{

      })
    },
    getCreated(state){
      if(state){
        this.getPostsList(1);
      } else {
        this.getPostsList(Number(webDb.getLItem('currentPag'))||1);
      }
    }

  },
  created(){
    this.getCategories();
    // this.getPostsList(Number(webDb.getLItem('currentPag'))||1);
  },
  beforeRouteEnter(to,from,next){
    next(vm => {
      if (to.name !== from.name && from.name !== null){
        vm.getCreated(true)
      }else {
        vm.getCreated(false)
      }
    })
  },
  components:{
    Card,
    ContArrange,
    Page,
    tableNoList,
    ElImageViewer
  }

}
