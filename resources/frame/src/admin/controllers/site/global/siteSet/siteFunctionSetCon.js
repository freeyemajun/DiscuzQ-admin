import Card from "../../../../view/site/common/card/card";
import CardRow from "../../../../view/site/common/card/cardRow";

export default {
  data(){
    return {
      // purchase:false, // 购买权限
      reward: false, // 数据过滤开关
      closeListreward: [], //打赏开关
      closeSelectListreward: [],//打赏开关
      closeListareward: [], //悬赏开关
      closeSelectListareward: [],//悬赏开关
      closeListredpacket: [], //红包开关
      closeSelectListredpacket: [],//红包开关
      closeListanonymous: [], //匿名开关
      closeSelectListanonymous: [],//匿名开关
      closeListpersonalletter: [], //私信开关
      closeSelectListpersonalletter: [],//私信开关
      closeListshop: [], //商品开关
      closeSelectListshop: [],//商品开关
      closeListpay: [], //帖子付费开关
      closeSelectListpay: [],//帖子付费开关
      closeListusergroup: [], //用户组付费开关
      closeSelectListusergroup: [],//用户组付费开关
      closeListrecharge: [], //充值开关
      closeSelectListrecharge: [],//充值开关
      closeListwithdrawal: [], //提现开关
      closeSelectListwithdrawal: [],//提现开关
      closeListcomment: [], //评论开关
      closeSelectListcomment: [],//评论开关
      //sitereward: [], // 打赏
      titles: false, // 标题过滤开关
      recharge: false,
    }
  },
  methods:{
    // 加载功能权限
    loadFunctionStatus() {
      this.appFetch({
        url: 'forum_get_v3',
        method: "get",
        data: {}
      })
        .then(data => {
          if (data.errors) {
            this.$message.error(data.errors[0].code);
          } else {
            if (data.Code !== 0) {
              this.$message.error(data.Message);
              return
            }
            const {Data: forumData} = data;
            // 购买权限
            // this.purchase = forumData.setSite.sitePayGroupClose === '1';
            // 打赏权限
            this.reward = forumData.other.threadOptimize;
            //this.siterewards = forumData.setSite.siteRewards;
            this.recharge = forumData.setSite.siteCharge === 1 ? true : false;
            this.titles = forumData.setSite.siteTitles === 1 ? true : false;
            // 打赏开启
            this.closeListreward = forumData.setSite.siteRewards || [];
            this.closeSelectListreward = this.closeListreward.reduce((result, item) => {
              if (item.value) {
                result.push(item.key);
                }
                return result;
              }, []);
            // 悬赏开启
            this.closeListareward = forumData.setSite.siteAreward || [];
            this.closeSelectListareward = this.closeListareward.reduce((result, item) => {
              if (item.value) {
                result.push(item.key);
                }
                return result;
              }, []);
            // 红包开启
            this.closeListredpacket = forumData.setSite.siteRedpacket || [];
            this.closeSelectListredpacket = this.closeListredpacket.reduce((result, item) => {
              if (item.value) {
                result.push(item.key);
                }
                return result;
              }, []);
            // 匿名开启
            this.closeListanonymous = forumData.setSite.siteAnonymous || [];
            this.closeSelectListanonymous = this.closeListanonymous.reduce((result, item) => {
              if (item.value) {
                result.push(item.key);
                }
                return result;
              }, []);
            // 私信开启
            this.closeListpersonalletter = forumData.setSite.sitePersonalletter || [];
            this.closeSelectListpersonalletter = this.closeListpersonalletter.reduce((result, item) => {
              if (item.value) {
                result.push(item.key);
                }
                return result;
              }, []);
            // 商品开启
            this.closeListshop = forumData.setSite.siteShop || [];
            this.closeSelectListshop = this.closeListshop.reduce((result, item) => {
              if (item.value) {
                result.push(item.key);
                }
                return result;
              }, []);
            // 帖子付费开启
            this.closeListpay = forumData.setSite.sitePay || [];
            this.closeSelectListpay = this.closeListpay.reduce((result, item) => {
              if (item.value) {
                result.push(item.key);
                }
                return result;
              }, []);
            // 用户组付费开启
            this.closeListusergroup = forumData.setSite.siteUsergroup || [];
            this.closeSelectListusergroup = this.closeListusergroup.reduce((result, item) => {
              if (item.value) {
                result.push(item.key);
                }
                return result;
              }, []);
            // 充值开启
            this.closeListrecharge = forumData.setSite.siteRecharges || [];
            this.closeSelectListrecharge = this.closeListrecharge.reduce((result, item) => {
              if (item.value) {
                result.push(item.key);
                }
                return result;
              }, []);
            // 提现开启
            this.closeListwithdrawal = forumData.setSite.siteWithdrawal || [];
            this.closeSelectListwithdrawal = this.closeListwithdrawal.reduce((result, item) => {
              if (item.value) {
                result.push(item.key);
                }
                return result;
              }, []);
            // 评论开启
            this.closeListcomment = forumData.setSite.siteComment || [];
            this.closeSelectListcomment = this.closeListcomment.reduce((result, item) => {
              if (item.value) {
                result.push(item.key);
                }
                return result;
              }, []);
          }
        })
        .catch(error => {});
    },
    // 提交功能状态更改
    handlePublishingSubmit(){
      this.appFetch({
        url: "thread_optimize_post",
        method: "post",
        data: {
          isDisplay: this.reward ? 1 : 0
        }
      })
        .then(data => {
          if (data.errors) {
            if (data.errors[0].detail) {
              this.$message.error(
                data.errors[0].code + "\n" + data.errors[0].detail[0]
              );
            } else {
              this.$message.error(data.errors[0].code);
            }
          } else {
            if (data.Code !== 0) {
              this.$message.error(data.Message);
              return
            }
            this.rechargePost();
          }
        })
        .catch(error => {});
    },
    rechargePost() {
      // 打赏开启
      const closeData = this.closeListreward.map((item) => {
        item.value = this.closeSelectListreward.indexOf(item.key) != - 1;
        return item;
      })
      // 悬赏开启
      const closeDataareward = this.closeListareward.map((item) => {
        item.value = this.closeSelectListareward.indexOf(item.key) != - 1;
        return item;
      })
      // 红包开启
      const closeDataredpacket = this.closeListredpacket.map((item) => {
        item.value = this.closeSelectListredpacket.indexOf(item.key) != - 1;
        return item;
      })
      // 匿名开启
      const closeDataanonymous = this.closeListanonymous.map((item) => {
        item.value = this.closeSelectListanonymous.indexOf(item.key) != - 1;
        return item;
      })
      // 私信开启
      const closeDatapersonalletter = this.closeListpersonalletter.map((item) => {
        item.value = this.closeSelectListpersonalletter.indexOf(item.key) != - 1;
        return item;
      })
      // 商品开启
      const closeDatashop = this.closeListshop.map((item) => {
        item.value = this.closeSelectListshop.indexOf(item.key) != - 1;
        return item;
      })
      // 帖子付费开启
      const closeDatapay = this.closeListpay.map((item) => {
        item.value = this.closeSelectListpay.indexOf(item.key) != - 1;
        return item;
      })
      // 用户组付费开启
      const closeDatausergroup = this.closeListusergroup.map((item) => {
        item.value = this.closeSelectListusergroup.indexOf(item.key) != - 1;
        return item;
      })
      // 充值开启
      const closeDatarecharge = this.closeListrecharge.map((item) => {
        item.value = this.closeSelectListrecharge.indexOf(item.key) != - 1;
        return item;
      })
      // 提现开启
      const closeDatawithdrawal = this.closeListwithdrawal.map((item) => {
        item.value = this.closeSelectListwithdrawal.indexOf(item.key) != - 1;
        return item;
      })
      // 评论开启
      const closeDatacomment = this.closeListcomment.map((item) => {
        item.value = this.closeSelectListcomment.indexOf(item.key) != - 1;
        return item;
      })
      this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
          data:[
            {
              "key":"site_charge",
              "value": this.recharge ? 1 : 0,
              "tag": "default"
            },
            {
              "key":"site_rewards",
              "value": closeData,
              "tag": "default"
            },
            {
              "key":"site_areward",
              "value": closeDataareward,
              "tag": "default"
            },
            {
              "key":"site_redpacket",
              "value": closeDataredpacket,
              "tag": "default"
            },
            {
              "key":"site_anonymous",
              "value": closeDataanonymous,
              "tag": "default"
            },
            {
              "key":"site_personalletter",
              "value": closeDatapersonalletter,
              "tag": "default"
            },
            {
              "key":"site_shop",
              "value": closeDatashop,
              "tag": "default"
            },
            {
              "key":"site_pay",
              "value": closeDatapay,
              "tag": "default"
            },
            {
              "key":"site_usergroup",
              "value": closeDatausergroup,
              "tag": "default"
            },
            {
              "key":"site_recharges",
              "value": closeDatarecharge,
              "tag": "default"
            },
            {
              "key":"site_withdrawal",
              "value": closeDatawithdrawal,
              "tag": "default"
            },
            {
              "key":"site_comment",
              "value": closeDatacomment,
              "tag": "default"
            },

            {
              "key":"site_titles",
              "value": this.titles ? 1 : 0,
              "tag": "default"
            },
          ]
        }
      }).then(res=>{
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
          this.loadFunctionStatus();
        }

      }).catch(err=>{
        this.$message.error('操作失败！');
      })
    }
  },
  created(){
    this.loadFunctionStatus()
  },
  components:{
    Card,
    CardRow
  }
}
