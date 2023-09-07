/*
 * 系统通知管理器
 * */

import Card from "../../../../view/site/common/card/card";
import CardRow from "../../../../view/site/common/card/cardRow";
import Page from "../../../../view/site/common/page/page";

export default {
  data: function() {
    return {
      tableData: [],
      pageNum: 1,
      pageLimit: 20,
      total: 0,
      type: [],
      // pageCount: 0
    };
  },
  created() {
    this.getNoticeList();
  },
  methods: {
    getNoticeList() {
      //初始化通知设置列表
      this.appFetch({
        url: "notices_get_v3",
        method: "get",
        data: {
          "page": this.pageNum,
          "perPage": this.pageLimit
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
            const {Data: data} = res;
            this.tableData = data.pageData || [];
            this.total = data.totalCount;
          }
        })
        .catch(err => {});
    },
    //获取表格序号
    getIndex($index) {
      //表格序号
      return (this.pageNum - 1) * this.pageLimit + $index + 1;
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getNoticeList();
    },
    configClick(typeStatus, typeName) {
      //点击配置跳到对应的配置页面
      this.$router.push({
        path: "/admin/notice-configure",
        query: { typeStatus: typeStatus, typeName: typeName }
      });
    },
    // 通知类型的点击事件
    handleError(item) {
      if (item.isError === 1) {
        let json = item.errorMsg;

        this.$alert(`
          <div class="notice_error_info">
            <div class="notice_error_title">Code</div>
            <div class="notice_error_message">${json.errCode}</div>
          </div>
          <div class="notice_error_info">
            <div class="notice_error_title">Message</div>
            <div class="notice_error_message">${json.errMsg}</div>
          </div>`,
          `${json.typeName}（${item.type}）`, {
          dangerouslyUseHTMLString: true,
        }).catch(() => {
          console.log('点击了关闭')
        })
      }
    }
  },

  components: {
    Card,
    CardRow,
    Page
  }
};
