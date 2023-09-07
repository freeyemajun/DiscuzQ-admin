/*
*  订单记录
* */

import Card from '../../../view/site/common/card/card';
import Page from '../../../view/site/common/page/page';
import webDb from 'webDbHelper';


export default {
  data:function () {
    return {
      tableData: [],          //订单记录列表数据
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
      },                      //搜索-订单时间

      orderNumber:'',         //搜索-订单号
      operationUser:'',       //搜索-发起方
      commodity:'',           //搜索-商品
      orderTime:['',''],      //搜索-订单时间范围
      incomeSide: '',         //搜索-收入方

      pageCount:0,            //总页数
      currentPaga:1,          //第几页
      total:0,                //总数

      options: [
        {
          value: '0',
          label: '待付款'
        },
        {
          value: '1',
          label: '已付款'
        },
        {
          value: '2',
          label: '取消订单'
        },
        {
          value: '3',
          label: '支付失败'
        },
        {
          value: '4',
          label: '订单过期'
        },
        {
          value: '5',
          label: '部分退款'
        },
        {
          value: '10',
          label: '全额退款'
        },
        {
          value: '11',
          label: '在异常订单处理中不进行处理的订单'
        },
      ],                     //搜索-订单状态选项
      orderType: [
        {
          value: '1',
          label: '注册'
        },
        {
          value: '2',
          label: '打赏'
        },
        {
          value: '3',
          label: '付费主题'
        },
        {
          value: '4',
          label: '付费用户组'
        },
        {
          value: '5',
          label: '问答提问'
        },
        {
          value: '6',
          label: '问答围观'
        },
        {
          value: '7',
          label: '付费附件'
        },
        {
          value: '8',
          label: '站点续费'
        },
        {
          value: '9',
          label: '红包'
        },
        {
          value: '10',
          label: '悬赏'
        },
        {
          value: '11',
          label: '合并支付'
        },
        {
          value: '20',
          label: '文字贴红包'
        },
        {
          value: '21',
          label: '长文贴红包'
        },
      ],                     //搜索-订单状态选项
      value: '',             //搜索-订单状态值
      orderValue: '',
    }
  },
  methods:{
    handleTimeChange () {
      if (this.orderTime != null){
        this.orderTime[0] = this.orderTime[0] + '-00-00-00';
        this.orderTime[1] = this.orderTime[1] + '-24-00-00';
      }
    },
    /*
    * 跳转到话题详情
    * */
    viewClick(id){
      if (id){
        let routeData = this.$router.resolve({
          path: "/thread/" + id,
        });
        window.open(routeData.href, '_blank');
      }
    },
    /*
    * 订单状态转换
    * */
    cashStatus(status){
      switch (status){
        case 0:
          return "待付款";
        case 1:
          return "已付款";
        case 2:
          return "取消订单";
        case 3:
          return "支付失败";
        case 4:
          return "订单过期";
        case 5:
          return "部分退款";
        case 10:
          return "全额退款";
        case 11:
          return "在异常订单处理中不进行处理的订单";
        default:
          return "未知状态";
      }
    },
    /*
    * 搜索
    * */
    searchClick() {
      this.orderTime = this.orderTime == null ? ['',''] : this.orderTime;
      this.currentPaga = 1;
      this.getOrderList();
    },
     /*
    * 切换页码
    * */
    handleCurrentChange(val){
      this.currentPaga = val;
      this.getOrderList();
    },

    /*
    * 格式化日期
    * */
    formatDate(data){
      return this.$dayjs(data).format('YYYY-MM-DD HH:mm')
    },

    /*
    * 请求接口 - 获取订单记录
    * */
    getOrderList(){
      this.appFetch({
        url:'orderLogs_get_v3',
        method:'get',
        data:{
          'page':this.currentPaga,
          'perPage':10,
          'filter[orderSn]':this.orderNumber,
          'filter[product]':this.commodity,
          'filter[nickname]':this.operationUser,
          'filter[startTime]':this.orderTime[0],
          'filter[endTime]':this.orderTime[1],
          'filter[status]':this.value,
          'filter[type]':this.orderValue,
          'filter[payeeNickname]':this.incomeSide
        }
      }).then(res=>{
        if (res.errors){
          this.$message.error(res.errors[0].code);
        }else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          const { Data: data } = res;
          this.tableData = [];
          this.tableData = data.pageData || [];
          this.pageCount = data.totalPage;
          this.total = data.totalCount;
        }
      }).catch(err=>{
      })
    },

    getCreated(state){
      if(state){
        this.currentPaga = 1;
      } else {
        this.currentPaga = Number(webDb.getLItem('currentPag'))||1;
      };
      this.getOrderList();
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
