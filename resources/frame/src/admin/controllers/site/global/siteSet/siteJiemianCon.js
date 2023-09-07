import Card from "../../../../view/site/common/card/card";
import CardRow from "../../../../view/site/common/card/cardRow";

export default {
  data(){
    return {
      fabu: '',
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
            // 发布

            //this.siterewards = forumData.setSite.siteRewards;
            this.fabu = forumData.setSite.siteFabu;

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
      this.appFetch({
        url:'settings_post_v3',
        method:'post',
        data:{
          data:[
            {
              "key":"site_fabu",
              "value": this.fabu,
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
