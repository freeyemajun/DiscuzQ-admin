/*
* 内容过滤设置
* */

import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';
import TableContAdd from '../../../../view/site/common/table/tableContAdd';
import Page from '../../../../view/site/common/page/page';
import webDb from '../../../../../helpers/webDbHelper'
import appConfig from "../../../../../../config/appConfig";

export default {
  data: function () {
    let token = webDb.getLItem('Authorization');

    return {
      tableData: [],
      multipleSelection: [],
      tableDataLength: '',
      createCategoriesStatus: false,   //添加分类状态
      exportUrl: appConfig.baseUrl + '/api/backAdmin/stopWords/export',
      options: [
        {
          value: '{IGNORE}',
          label: '不处理'
        }, {
          value: '{MOD}',
          label: '审核'
        }, {
          value: '{BANNED}',
          label: '禁用'
        },
        {
          value: '{REPLACE}',
          label: '替换'
        }
      ],

      optionsUser: [
        {
          value: '{IGNORE}',
          label: '不处理'
        }, {
          value: '{BANNED}',
          label: '禁用'
        },
        // {
        //   value: '{MOD}',
        //   label: '审核'
        // }
      ],
      optionsIpData: [],
      serachVal: '',
      checked: false,
      searchData: [],//搜索后的数据
      replace: true,
      inputFind: false,
      radio2: "1",
      total: 0, //总条数
      pageLimit: 20, //每页多少条
      pageNum: 1, //当前页
      userLoadMoreStatus: true,
      userLoadMorePageChange: false,
      deleteStatus: true,
      deleteList: [],
      tableAdd: false,
      ipDeleteStatus: true,
      multipleSelectionIp: '',
    }
  },
  created() {
    // this.handleSearchUser(true);  //初始化页面数据
    // this.pageNum  = Number(webDb.getLItem('currentPag'))||1;
    // this.handleSearchUser(Number(webDb.getLItem('currentPag'))||1);
    this.tencentCloudStatus();
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
    tencentCloudStatus() {
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
          const ipData = forumData.other.innerNetIp;
          this.optionsIpData = [];
          if (ipData && ipData.length > 0) {
            ipData.forEach((item,index) => {
              const division = item.split('/');
              this.optionsIpData.push({
                domainName: division[0],
                domainMask: division[1],
                domainId: index,
              })
            })
          }
        }
      })
    },
    getCreated(state) {
      if (state) {
        this.pageNum = 1
      } else {
        this.pageNum = Number(webDb.getLItem('currentPag')) || 1;
      }
      this.handleSearchUser(true)

    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.deleteStatus = this.multipleSelection.length < 1;
    },
    deleteChanges(val) {
      this.multipleSelectionIp = val;
      this.ipDeleteStatus = val.length < 1;
    },
    ipDataDelete() {
      this.multipleSelectionIp.forEach((item, index) => {
        this.optionsIpData.forEach((items, indexs) => {
          if (item.domainId === items.domainId) {
            this.optionsIpData.splice(indexs, 1);
          }
        })
      })
      this.ipDataLoginStatus();
    },
    onSearch(val) {
      this.searchVal = val;
      this.pageNum = 1;
      this.handleSearchUser(true);
    },
    async exportUrlContent() {
      try {
        const response = await this.appFetch({
          url: 'stopwords_export_v3',
          method: 'get',
          data: {
            'keyword': this.serachVal,
          }
        })
        const blob = new Blob([response], { type: 'application/x-xls' });
        const url = window.URL || window.webkitURL || window.moxURL;
        const downloadHref = url.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = downloadHref;
        a.download = 'stop-words.txt';
        a.click();
        a = null;
      } catch (err) {

      }
    },
    async handleSearchUser(initStatus = false) {
      try {
        const response = await this.appFetch({
          url: 'stopwords_get_v3',
          method: 'get',
          data: {
            'filter[keyword]': this.serachVal,
            "perPage": this.pageLimit,
            "page": this.pageNum
          }
        })
        if (response.errors) {
          this.$message.error(response.errors[0].code);
        } else {
          if (response.Code !== 0) {
            this.$message.error(response.Message);
            return
          }
          if (initStatus) {
            this.tableData = [];
          }
          const {Data: data} = response;
          this.tableData = this.tableData.concat(data.pageData).map((v) => {
            if (v.replacement === undefined) {
              v.replacement = '';
            }
            this.total = data.totalCount;
            return v;
          });
        }
      } catch (err) {

      } finally {
        this.userLoadMorePageChange = false;
      }
    },

    handleLoadMoreUser() {
      this.userLoadMorePageChange = true;
      this.handleSearchUser();
    },

    selectChange(scope) {
      // if (scope) {
      //   if (scope.row.ugc !== '{REPLACE}' && scope.row.username !== '{REPLACE}') {
      //     this.tableData[scope.$index].replacement = '';
      //   }
      // }
    },

    async loginStatus() {  //批量提交接口

      let result = this.tableData.filter((v) => {
        return v.addInputFlag;
      })

      result = result.concat(this.multipleSelection);

      try {
        if (this.tableData.length === 0) {
          return;
        }

        let words = [];

        for (let i = 0, len = this.tableData.length; i < len; i++) {
          const _data = this.tableData[i];
          const { ugc, username, signature, dialog, find, replacement, nickname} = _data;
          // if (replacement === '' && ugc === '{REPLACE}') {
          //   continue;
          // }
          let item = '';
          const ugcData = ugc ? ugc : '{IGNORE}';
          const usernameData = username ? username : '{IGNORE}';
          const signatureData = signature ? signature : '{IGNORE}';
          const dialogData = dialog ? dialog : '{IGNORE}';
          const nicknameData = nickname ? nickname : '{IGNORE}';
          const replacementData = replacement ? replacement : '**';
          if (ugcData !== '{REPLACE}') {
            item = `${find}=${ugcData}|${usernameData}|${signatureData}|${dialogData}|${nicknameData}`
          } else {
            item = `${find}=${replacementData}|${ugcData}|${usernameData}|${signatureData}|${dialogData}|${nicknameData}`
          }
          words.push(item);
        }

        if (words.length === 0) {
          return;
        }

        await this.appFetch({
          url: 'stopwords_batch_v3',
          method: 'post',
          standard: false,
          data: {
            "words": words,
            "overwrite": true
          }
        })
        this.handleSearchUser(true);
        this.$message({ message: '提交成功', type: 'success' });
      } catch (err) {
        console.error(err)
      }

    },
    tableContAdd() {
      this.tableData.push({
        find: "",
        username: "",
        ugc: "",
        replacement: "",
        addInputFlag: true,
      })
      this.tableAdd = true
    },
    increaseIpAdd() {
      this.optionsIpData.push({
        domainName: '',
        domainMask: '',
        domainId: this.optionsIpData.length,
      });
    },
    async ipDataLoginStatus() {
      let ipDataArr = [];
      this.optionsIpData.forEach((item, index) => {
        ipDataArr.push(`${item.domainName}/${item.domainMask}`)
      })
      await this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
          "data":[
            {
              "key":'inner_net_ip',
              "value": ipDataArr,
              "tag": "default"
            },
          ]
        }
      }).then(res=>{
        if(res.errors){
          throw new Error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.$message({ message: '提交成功', type: 'success' });
        }
      })
    },
    deleteWords() {
      this.deleteList = []
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.deleteList.push(this.multipleSelection[i].id)
      }
      this.appFetch({
        url: 'stopwords_delete_v3',
        method: 'post',
        data: {
          'ids': this.deleteList.join(",")
        }
      }).then(res => {
        if (res.errors) {
          this.$message.error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.handleSearchUser(true);
        }
      })

    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.handleSearchUser(true)
    }

  },
  components: {
    Card,
    CardRow,
    TableContAdd,
    Page
  }
}
