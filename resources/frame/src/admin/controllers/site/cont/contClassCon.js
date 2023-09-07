/*
* 内容分类控制器
* */

import Card from '../../../view/site/common/card/card';
import TableContAdd from '../../../view/site/common/table/tableContAdd';

export default {
  data:function () {
    return {
      categoriesList: [],           //分类列表
      alternateLength:0,    //数据长度备份
      categoriesListLength:'',      //分类列表长度
      createCategoriesStatus:false, //添加分类状态
      deleteStatus:true,
      multipleSelection:[],         //分类多选列表
      visible:false,
      delLoading:false,             //删除按钮状态
      subLoading:false,             //提交按钮状态
      showClass:false,              //分类权限显示隐藏
      dialogVisible: false,
      classcCnfirm: false
    };
  },

  methods:{
    // 新增。当前父类添加二级子类，携带父级id
    childAdd(row){
      const num = this.alternateLength.filter(v => v.pid === row.id);
      if (row.children.length <= num[0].children.length) {
        row.children.push({
          id: '',
          name: '',
          description: '',
          sort: '',
          parentid: row.id
        });
      }
    },
    
    // 新增。删除带id子项，无id的等等提交刷新列表
    deleteChildClick(row){
      if(row.id){
        this.batchDeleteCategories(row.id).then(()=>{
          this.getCategories();
        });
      }else{
        let p=this.categoriesList.find(item=>{
            return item.id===row.parentid;
        })
        p.children.splice(p.children.indexOf(row),1);
      }
    },

    // 新增。确认子类
    submitChildClick(row, scope){
      if(!row.name){
        this.$message.warning('名称不能为空！')
        return
      }
      if(row.id){
        this.$message.warning('修改子类，请点击页面底部的提交按钮')
        return
      }
      this.classcCnfirm = true;
      this.createCategories([row]).then(()=>{
        this.getCategories();
      })
    },

    addClick() {
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;

      if (this.multipleSelection.length >= 1){
        this.deleteStatus = false
      } else {
        this.deleteStatus = true
      }

    },

    tableContAdd(){
      this.showClass = false;
      this.createCategoriesStatus = true;
      this.categoriesList.push({
        name:"",
        id:"",
        description:"",
        sort:"",
        parentid:0,
        children: [],
        isShow: true, 
        idx: this.categoriesList.length+1
      })
    },

    submitClick(){     //提交
      this.subLoading = true;
      this.showClass = true;

      /*if (this.createCategoriesStatus && this.multipleSelection.length > 0){
        this.$message({
          showClose: true,
          message: '新增内容分类未提交！请先提交，再勾选其他分类',
          type: 'warning'
        });
      } else */

      if (this.createCategoriesStatus){
        this.createCategories(this.categoriesList.slice(this.categoriesListLength,this.categoriesList.length)).then(()=>{
          this.getCategories();
          this.createCategoriesStatus = false;
        })
      } else {
        let data = [];
        this.categoriesList.forEach((item)=>{
          data.push({
            'id':item.id,
            "name": item.name,
            "description": item.description,
            "parentId":item.parentid,
            "sort": item.sort
          });
          item.children && item.children.forEach(item_child=>{
            if (!item_child.id){
              return
            }
            data.push({
              'id':item_child.id,
              "name": item_child.name,
              "description": item_child.description,
              "sort": item_child.sort,
              "parentId": item_child.parentid
            })
          });
        });
        this.batchUpdateCategories(data).then(()=>{
          this.getCategories();
        });
      }
    },

    // deleteClick(id,index){

    //   if (this.createCategoriesStatus && index > this.categoriesListLength -1){
    //     this.categoriesList.splice(index,1);
    //   } else {
    //     this.deleteCategories(id).then(()=>{
    //       this.getCategories();
    //     });
    //   }
    // },
    deleteClick(row){
      if(row.id){
        // 删除父类(包含子类批量删除，不包含单独删除)
        if(row.children){
          let id=[];
          id.push(row.id)
          row.children.forEach(item=>{
            if(item.id){
              id.push(item.id)
            }
          })

          this.batchDeleteCategories(id.join(',')).then(()=>{
            this.getCategories();
          });
        }else{
          this.deleteCategories(row.id).then(()=>{
            this.getCategories();
          });
        }
      }else{
        this.categoriesList.splice(this.categoriesList.indexOf(row),1);
      }
    },

    deleteAllClick(){
      this.delLoading = true;
      let id = [];
      this.multipleSelection.forEach((item,index)=>{
        // if (index < this.multipleSelection.length){
        //   id.push(item.id)
        // }
        item.id && id.push(item.id)
        item.children && item.children.forEach(item_child=>{
          if(item_child.id){
            id.push(item_child.id)
          }
        })
      });
      id = [...new Set(id)]
      this.batchDeleteCategories(id.join(',')).then(()=>{
        this.getCategories();
      });
      this.visible = false;
    },

    /*
    * 接口请求
    * */
    getCategories(){
      this.appFetch({
        url:'categories_get_v3',
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
          this.classcCnfirm = false;
          const {Data: data} = res
          this.categoriesListLength = data.length;
          this.categoriesList = [];
          this.alternateLength = data;
          data.forEach((item, index) => {
            let children = [];
            item.children.forEach(citem => {
              children.push({
                canCreateThread: citem.canCreateThread,
                description: citem.description,
                icon: citem.icon,
                name: citem.name,
                parentid: citem.parentid,
                id: citem.pid,
                property: citem.property,
                searchIds: citem.searchIds,
                sort: citem.sort,
                threadCount: citem.threadCount
              })
            })
            this.categoriesList.push({
              name: item.name,
              id: item.pid,
              description: item.description,
              sort: item.sort,
              parentid: item.parentid,
              children: children,
              isShow:true, // 本地显示需要，显示父类操作
              idx:index, // 本地删除需要，记录父类下标
            })
          })
        }
      }).catch(err=>{
      })

    },
    deleteCategories(id){
      return this.appFetch({
        url:'categories_delete_v3',
        method:'post',
        data:{
          "id": id
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
          this.$message({
            message: '操作成功',
            type: 'success'
          });
        }
      }).catch(err=>{
      })
    },
    batchDeleteCategories(id){
      return this.appFetch({
        url:'categories_delete_v3',
        method:'post',
        data:{
          "id": id
        }
      }).then(res=>{
        this.delLoading = false;
        if (res.Code !== 0) {
          this.$message.error(res.Message);
          return
        }
        this.$message({
          message: '操作成功',
          type: 'success'
        });
      }).catch(err=>{
      })
    },
    createCategories(data){
      let datas = [];
      data.forEach((item)=>{
        datas.push({
          "name": item.name,
          "description": item.description,
          "sort": item.sort,
          "parentId":item.parentid
        })
      });

      return  this.appFetch({
                url:'categories_create_v3',     //批量创建分类
                method:'post',
                data:{
                  "data": datas
                }
              }).then(res=>{
                this.subLoading = false;
                if (res.Code !== 0) {
                  this.$message.error(res.Message);
                  return
                }
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
              }).catch(err=>{
              })
    },
    batchUpdateCategories(data) {
      return this.appFetch({
        url: 'categories_update_v3',      //批量修改分类
        method: 'post',
        data: {
          data
        }
      }).then(res => {
        this.subLoading = false;
        if (res.Code !== 0) {
          this.$message.error(res.Message);
          return
        }
        this.$message({
          message: '操作成功',
          type: 'success'
        });
      }).catch(err => {
        console.log(err);
      })
    }
  },

  created(){
    this.getCategories();
  },

  components:{
    Card,
    TableContAdd
  }

}
