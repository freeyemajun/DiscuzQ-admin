
import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';

export default {
  data:function () {
    return {
      topicContent: '',
      topicNum: '',
      speed: false, // 进度显示
      importing: '',
      progress: 0,
      startTiming: false,
      contentSourceId: 1,
      accuntlnroCookie: '',
      accuntlnroToken: '',
      planetCookie: '',
      planetUserAgent: '',
      totalNumber: 0,
      contentSource: [
        {
          name: '微博',
          id: 1
        },
        {
          name: '贴吧',
          id: 2
        },
        {
          name: '豆瓣',
          id: 3
        },
        {
          name: '微信公众号',
          id: 4
        },
        {
          name: '知识星球',
          id: 5
        },
      ],
      officialAccountLink: [
        {
          linkData: '',
        }
      ]
    }
  },
  methods:{
    increaseLink() {
      if (this.officialAccountLink.length < 20) {
        this.officialAccountLink.push(
          {
            linkData: '',
          }
        );
      }
    },
    deleteLink(index) {
      if (this.officialAccountLink.length > 1 ) {
        this.officialAccountLink.splice(index, 1);
      }
    },
    topicNumInput(value) {
      if (Number(value) > 1000) {
        this.$message.error('一次最多导入1000条');
        this.topicNum = '';
      }
    },
    importDataBtn() {
      let params = {};
      if (this.contentSourceId === 4) {
        let officialAccountUrlArr = [];
        this.officialAccountLink.map(item => {
          officialAccountUrlArr.push(item.linkData);
        })
        params = {
          officialAccountUrl: officialAccountUrlArr,
          platform: this.contentSourceId,
        }
      } else if (this.contentSourceId === 5) {
        params = {
          topic: this.topicContent,
          cookie: this.planetCookie,
          userAgent: this.planetUserAgent,
          number: this.topicNum,
          platform: this.contentSourceId,
        }
      } else {
        params = {
          topic: this.topicContent,
          number: this.topicNum,
          platform: this.contentSourceId,
        }
      }
      this.appFetch({
        url:'create_crawler_get',
        method:'get',
        data: params,
      }).then(res => {
        if (res.errors){
          this.$message.error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          this.speed = true;
          clearInterval(this.timer);
          this.startTiming = false;
          this.progress = 0;
          this.importing = 1;
          this.timer = setInterval(this.crawlerQuery, 2000);
          this.$message({
            message: res.Message,
            type: 'success'
          });
        }
      })
    },
    crawlerQuery() {
      this.appFetch({
        url:'check_crawler_get',
        method:'get',
      }).then( res => {
        if (res.errors){
          clearInterval(this.timer);
          this.$message.error(res.errors[0].code);
        } else {
          if (res.Code !== 0) {
            clearInterval(this.timer);
            this.$message.error(res.Message);
            return
          }
          const crawlerData = res.Data;
          if (crawlerData.startCrawlerTime !== 0) {
            this.startTiming = true;
            this.importing = crawlerData.status;
            this.progress = crawlerData.progress;
            // if (crawlerData.status === 2 && crawlerData.progress === 100) {
            //   this.progress = 100;
            //   clearInterval(this.timer);
            // }
            if (crawlerData.status !== 0 && crawlerData.status !== 1 && crawlerData.status !== 2) {
              clearInterval(this.timer);
            }
          }
          if (this.startTiming) {
            this.importing = crawlerData.status;
            this.progress = crawlerData.progress;
            if (crawlerData.status === 2 && crawlerData.progress === 100) {
              this.progress = 100;
              this.totalDataNumber = crawlerData.totalDataNumber;
              clearInterval(this.timer);
            }
            if (crawlerData.status !== 0 && crawlerData.status !== 1 && crawlerData.status !== 2) {
              clearInterval(this.timer);
            }
          }
        }
      })
    },
    determineBtn() {
      this.speed = false;
      clearInterval(this.timer);
    },
    cancelBtn() {
      history.go(0);
    },
    retryBtn() {
      this.importDataBtn();
    }
  },
  components:{
    Card,
    CardRow
  }
}