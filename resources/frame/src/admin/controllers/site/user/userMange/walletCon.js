/*
* 钱包
* */

import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';

export default {
  data:function () {
    return {
      options: [
        {
          value: 1,
          label: '增加余额'
        }, 
        {
          value: 2,
          label: '减少余额'
        }
      ],
      walletInfo: {
        user:{
          _data:{}
        },
        _data: {}
      },
      operateType: '',
      operateAmount: '',
      value: '',
      textarea:'',
      query: {}
    }
  },

  created(){
    this.query = this.$route.query;
    this.getWalletDet();
  },

  methods:{
    async getWalletDet(){
      try{
        if(this.query.id === undefined){
          throw new Error('not found user id');
        }
        const response = await this.appFetch({
          method: 'get',
          url: 'user_wallet_post_v3',
          // splice: `${this.query.id ? this.query.id : ''}`
          data: {
            uid: Number(this.query.id)
          }
        })
        this.walletInfo = response.Data;
      }catch(err){
      }
    },

    operaAmountInput(val){
      this.operateAmount = val.replace(/[^0-9^\.]/g,'');
    },

    async handleSubmit(){
      try{
        if(this.query.id === undefined){
          return;
        }
        if(this.operateType){
          var datas = {
            userId: Number(this.query.id),
            operateType: this.operateType,
            operateAmount: parseFloat(this.operateAmount),
            operateReason: this.textarea,
            walletStatus: this.walletInfo.walletStatus
          }
        }else{
          var datas = {
            userId: Number(this.query.id),
            walletStatus: this.walletInfo.walletStatus
          }
        }
        await this.appFetch({
          url: 'update_wallet_post_v3',
          method: 'post',
          data: datas
        }).then(data=>{
          if (data.errors){
            this.$message.error(data.errors[0].code);
          }else {
            if (data.Code !== 0) {
              this.$message.error(data.Message);
              return
            }
            this.$message({ message: '提交成功', type: 'success' });
            this.getWalletDet();
          }
        })

      } catch(err){
      }
    },
    
  },

  components:{
    Card,
    CardRow
  }
}
