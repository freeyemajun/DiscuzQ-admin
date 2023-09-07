/*
*  资金明细
* */

import Card from '../../../view/site/common/card/card';
import Page from '../../../view/site/common/page/page';
import webDb from 'webDbHelper';

export default {
  data:function () {
    return {
      tableData: [],             //列表数据
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
      },                         //搜索-变动时间
      userName:'',               //搜索-用户名
      changeTime:['',''],        //搜索-变动时间范围
      changeDescription:'',      //搜索-变动描述

      total:0,                    //总数
      pageCount:0,                //总页数
      currentPaga:1,               //第几页
      amountType: '', // 金额类型
      options: [
        {
          value: 8,
          label: '问答冻结'
        },
        {
          value: 9,
          label: '问答返还解冻'
        },
        {
          value: 10,
          label: '提现冻结'
        },
        {
          value: 11,
          label: '提现成功'
        },
        {
          value: 12,
          label: '提现解冻'
        },
        {
          value: 30,
          label: '注册收入'
        },
        {
          value: 31,
          label: '打赏收入'
        },
        {
          value: 32,
          label: '人工收入'
        },
        {
          value: 33,
          label: '分成打赏收入'
        },
        {
          value: 34,
          label: '注册分成收入'
        },
        {
          value: 35,
          label: '问答答题收入'
        },
        {
          value: 36,
          label: '问答围观收入'
        },
        {
          value: 41,
          label: '打赏支出'
        },
        {
          value: 50,
          label: '人工支出'
        },
        {
          value: 51,
          label: '加入用户组支出'
        },
        {
          value: 52,
          label: '付费附件支出'
        },
        {
          value: 60,
          label: '付费主题收入'
        },
        {
          value: 61,
          label: '付费主题支出'
        },
        {
          value: 62,
          label: '分成付费主题收入'
        },
        {
          value: 63,
          label: '付费附件收入'
        },
        {
          value: 64,
          label: '付费附件分成收入'
        },
        {
          value: 71,
          label: '站点续费支出'
        },
        {
          value: 81,
          label: '问答提问支出'
        },
        {
          value: 82,
          label: '问答围观支出'
        },
        {
          value: 100,
          label: '文字帖红包支出'
        },
        {
          value: 101,
          label: '文字帖红包冻结'
        },
        {
          value: 102,
          label: '文字帖红包收入'
        },
        {
          value: 103,
          label: '文字帖冻结返还'
        },
        {
          value: 104,
          label: '文字帖订单异常返现'
        },
        {
          value: 110,
          label: '长文帖红包支出'
        },
        {
          value: 111,
          label: '长文帖红包冻结'
        },
        {
          value: 112,
          label: '长文帖红包收入'
        },
        {
          value: 113,
          label: '长文帖冻结返还'
        },
        {
          value: 114,
          label: '长文帖订单异常返现'
        },
        {
          value: 120,
          label: '悬赏问答收入'
        },
        {
          value: 121,
          label: '悬赏帖过期-悬赏帖剩余悬赏金额返回'
        },
        {
          value: 124,
          label: '问答帖订单异常返现'
        },
        {
          value: 150,
          label: '红包冻结'
        },
        {
          value: 151,
          label: '红包收入'
        },
        {
          value: 152,
          label: '红包退款'
        },
        {
          value: 153,
          label: '红包支出'
        },
        {
          value: 154,
          label: '红包订单异常退款'
        },
        {
          value: 160,
          label: '赏问答冻结'
        },
        {
          value: 161,
          label: '悬赏问答收入'
        },
        {
          value: 162,
          label: '悬赏问答退款'
        },
        {
          value: 163,
          label: '悬赏订单异常退款'
        },
        {
          value: 170,
          label: '合并订单冻结'
        },
        {
          value: 171,
          label: '合并订单退款'
        },
        {
          value: 172,
          label: '合并订单异常退款'
        }
      ],  // 类型数组
      usableTotalAmount: 0, // 可用金额统计
      frozenTotalAmount: 0, // 冻结金额统计
    }
  },
  methods:{
    handleTimeChange () {
      if (this.changeTime != null) {
        this.changeTime[0] = this.changeTime[0] + '-00-00-00';
        this.changeTime[1] = this.changeTime[1] + '-24-00-00';
      }
    },
    /*
    * 搜索
    * */
    searchClick() {
      this.changeTime = this.changeTime == null ? ['',''] : this.changeTime;
      this.currentPaga = 1;
      this.getFundingDetailsList();
    },
    /*
    * 切换分页
    * */
    handleCurrentChange(val){
      this.currentPaga = val;
      this.getFundingDetailsList();
    },

    /*
    * 格式化日期
    * */
    formatDate(data){
      return this.$dayjs(data).format('YYYY-MM-DD HH:mm')
    },


    /*
    * 接口请求 -- 获取资金明细数据
    * */
    getFundingDetailsList(){
      this.appFetch({
        url:'walletLogs_get_v3',
        method:'get',
        data:{
          'page':this.currentPaga,
          'perPage':10,
          'filter[nickname]' : this.userName,
          'filter[changeType]': this.amountType.toString(),
          'filter[changeDesc]' : this.changeDescription,
          'filter[startTime]' : this.changeTime[0],
          'filter[endTime]' : this.changeTime[1]
        }
      }).then(res=>{
        if (res.errors){
          this.$message.error(res.errors[0].code);
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.tableData = [];
          const { Data: data } = res;
          this.tableData = data.pageData || [];
          this.total = data.totalCount;
          this.pageCount = data.totalPage;
          if(data.pageData.length > 0){
            let availableAmount = [];
            let freezeAmount = [];
            for (let i in data.pageData) {
              availableAmount.push(data.pageData[i].changeAvailableAmount);
              freezeAmount.push(data.pageData[i].changeFreezeAmount)
            };
            this.usableTotalAmount = eval(availableAmount.join('+')).toFixed(2);
            this.frozenTotalAmount = eval(freezeAmount.join('+')).toFixed(2);
          }
        }
      }).catch(err=>{
      })
    },
    
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1 || index === 4) {
          sums[index] = '';
          return;
        }
        if (index === 2) {
          sums[index] = this.usableTotalAmount;
          return;
        }
        if (index === 3) {
          sums[index] = this.frozenTotalAmount;
          return;
        }
      });
      return sums;
    },
    getCreated(state){
      if(state){
        this.currentPaga = 1;
      } else {
        this.currentPaga = Number(webDb.getLItem('currentPag'))||1;
      }
      this.getFundingDetailsList();
    }
  },
  beforeRouteEnter (to,from,next){
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
    Page
  }
}
