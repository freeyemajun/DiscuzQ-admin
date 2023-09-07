import Card from "../../../../view/site/common/card/card";
import CardRow from "../../../../view/site/common/card/cardRow";

export default {
  components:{
    Card,
    CardRow
  },
  data(){
    return {
      activeIndex: '3',
    }
  },
  created(){
    // this.tencentCloudList();
  },
  methods:{
    handleSelect(e) {
      if (e === '1') {
        this.$router.push({ path: '/admin/site-seo-set'});
      } else if (e === '2') {
        this.$router.push({ path: '/admin/site-ssr-set'});
      }
    },
  },
}