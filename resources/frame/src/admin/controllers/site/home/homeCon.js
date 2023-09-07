/**
 * 首页控制器
 */
import Card from '../../../view/site/common/card/card';

export default {
  data:function () {
    return {
      siteInfo:{},   //系统信息
      unapproved:{}, //待处理事项
      newVersion: false,  // 新版本是否显示
      versionNumber: '',
      oldVersion: '',
    }
  },

  created(){
    this.appFetch({
      url:"siteinfo_get_v3",
      method:"get",
      data: {}
    }).then(res => {
      if (res.errors){
        this.$message.error(res.errors[0].code);
      }else {
        if (res.Code !== 0) {
          this.$message.error(res.Message);
          return
        }
        const {siteinfo, unapproved} = res.Data;
        this.siteInfo = siteinfo;
        this.unapproved = unapproved;
        this.oldVersion = siteinfo.version;
        this.compareSize();
      }
    });
  },
  methods: {
    compareSize() {
      this.versionNumber = dzq_latest_ver();
      const versNum = this.versionNumber.replace(/[^\d]/g, '');
      const versNum2  = this.oldVersion.replace(/[^\d]/g, '');
      if(versNum > versNum2) {
        this.newVersion = true;
      } else {
        this.newVersion = false;
      }
    }
  },
  components:{
    Card
  }
}
