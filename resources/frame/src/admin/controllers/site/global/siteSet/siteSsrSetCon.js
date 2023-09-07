import Card from "../../../../view/site/common/card/card";
import CardRow from "../../../../view/site/common/card/cardRow";

export default {
  components:{
    Card,
    CardRow
  },
  data(){
    return {
      activeIndex: '2',
      ssrText: '',
      configPath: 'http://service-74pdgz7k-1258344699.gz.apigw.tencentcs.com'
    }
  },
  created(){
    this.tencentCloudList();
  },
  methods:{
    tencentCloudList(){
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
          const {Data: forumData} = res;
          if (forumData.qcloud.qcloudSsrAccessPath) {
            this.configPath = forumData.qcloud.qcloudSsrAccessPath;
          }
        }
      })
    },
    handleSelect(e) {
      if (e === '1') {
        this.$router.push({ path: '/admin/site-seo-set'});
      } else if (e === '3') {
        this.$router.push({ path: '/admin/site-ssr-explain'});
      }
    },
    flipClick(type) {
      switch(type) {
        case 'qcloud_close':
          this.$router.push({ path: '/admin/tencent-cloud-config/cloud'});
          break;
        case 'qcloud_server':
          this.$router.push({ path: '/admin/tencent-cloud-config/server'});
          break;
        default:
      }
    },
    optionBtn() {
      const div = document.getElementById('sharedurl');
      if (document.body.createTextRange) {
          let range = document.body.createTextRange();
          range.moveToElementText(div);
          range.select();
      } else if (window.getSelection) {
          let selection = window.getSelection();
          let range = document.createRange();
          range.selectNodeContents(div);
          selection.removeAllRanges();
          selection.addRange(range);
          /*if(selection.setBaseAndExtent){
              selection.setBaseAndExtent(text, 0, text, 1);
          }*/
      } else {
          console.warn("none");
      }
      this.$message({
        message: '内容已复制到剪贴板',
        type: 'success'
      });
      document.execCommand("Copy"); // 执行浏览器复制命令
    },
  },
}