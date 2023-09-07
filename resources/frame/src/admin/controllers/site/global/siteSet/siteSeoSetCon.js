import Card from "../../../../view/site/common/card/card";
import CardRow from "../../../../view/site/common/card/cardRow";
import axios from "axios";

export default {
  components:{
    Card,
    CardRow
  },
  data(){
    return {
      activeIndex: '1',
      indexesText: '',
      mapText: '',
      optionType: 'seat',
      xmlText: '',
    }
  },
  created(){
    this.xmlTextobtain();
  },
  methods:{
    xmlTextobtain () {
      axios({
        method: 'get',
        url: '/static-admin/xml/sitemap.xml'
      })
      .then(res => {
        const xml = res.data;
        this.xmlText = this.$x2js.xml2js(res.data);
        this.indexesTextHandle(this.xmlText.sitemapindex.sitemap);
      })
    },
    async indexesTextHandle(xml) {
      // let indexesArr = '';
      await xml.forEach((item, index) => {
        this.mapText += item.loc.replace('https://discuz.chat', `${window.location.protocol}//${window.location.host}`) + '\n';
      })
    },
    handleSelect(e) {
      if (e === '3') {
        this.$router.push({ path: '/admin/site-ssr-explain'});
      } else if (e === '2') {
        this.$router.push({ path: '/admin/site-ssr-set'});
      }
    },
    optionBtn() {
      let input = '';
      input = this.$refs.mapText.$refs.textarea;
      input.select();
      document.execCommand('Copy');
      this.$message({
        message: '内容已复制到剪贴板',
        type: 'success'
      });
    },
    jumpDataRules() {
      this.$router.push({ path: '/admin/site-sort-set'});
    },
  },
}