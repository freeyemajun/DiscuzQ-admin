/*
*  提现设置
* */

import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';

export default {
  data:function () {
    return {
      withdrawalInterval:'',   //提现间隔时间
      withdrawalFee:'',        //提现手续费率
      minAmount:'',            //最小金额
      maxAmount:'',            //最大金额
      amountCap:'',            //金额上限
      subLoading:false,        //提现按钮状态
    }
  },
  methods:{
    /*
    * 提交提现设置
    * */
    submitClick(){
      if (this.minAmount < 1) {
        this.$message.error("提现最小金额不能少于1元");
        return;
      }
      this.subLoading = true;
      this.postWithdrawalSettings();
    },

    onblurFun() {
      if (this.minAmount < 1) {
        this.$message("提现最小金额不能少于1元");
        this.minAmount = '1';
      }
    },

    /*
    * 提交请求
    * */
    postWithdrawalSettings(){
      this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
          data:[
            {
              "key":"cash_interval_time",
              "value":this.withdrawalInterval,
              "tag": "cash"
            },
            {
              "key":"cash_rate",
              "value":this.withdrawalFee,
              "tag": "cash"
            },
            {
              "key":"cash_min_sum",
              "value":this.minAmount,
              "tag": "cash"
            },
            {
              "key":"cash_max_sum",
              "value":this.maxAmount,
              "tag": "cash"
            },
            {
              "key":"cash_sum_limit",
              "value":this.amountCap,
              "tag": "cash"
            }
          ]
        }
      }).then(res=>{
        this.subLoading = false;
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
          this.getForum();
        }

      }).catch(err=>{
        this.$message.error('操作失败！');
      })
    },
    /*
    * 获取提现设置数据
    * */
    getForum(){
      this.appFetch({
        url:'forum_get_v3',
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
          let formData = res.Data.setCash;
          this.withdrawalInterval = formData.cashIntervalTime;
          this.withdrawalFee = formData.cashRate;
          this.minAmount = formData.cashMinSum;
          this.maxAmount = formData.cashMaxSum;
          this.amountCap = formData.cashSumLimit;
        }
      }).catch(err=>{
        this.$message.error('初始化失败！请重新刷新页面（F5）');
      })
    }

  },
  created(){
    this.getForum();
  },
  components:{
    Card,
    CardRow
  }
}
