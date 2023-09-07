/*
* 通知设置配置控制器
* */

import Card from '../../../../view/site/common/card/card';
import CardRow from '../../../../view/site/common/card/cardRow';
import TableContAdd from '../../../../view/site/common/table/tableContAdd';

export default {
    data: function () {
      return {
        query: '',            //获取当前用户的ID
        typeName: '',         //获取当前typename
        showSystem: false,    //系统显示
        showWx: false,        //微信显示
        showMini: false,      //小程序显示
        showSms: false,       //短信显示
        noticeList: [],       //通知方式
        wxDes: '',            //微信描述
        systemDes:'',         //系统通知描述
        smsDes: '',           //短信描述
        miniDes: '',          //小程序描述
        systemList: '',       //系统通知数据
        wxList: '',           //微信通知数据
        delayTime: '',        //自定义时间
        miniProgramList: '',  //小程序通知数据
        smsList: '',          //短信通知数据
        appletsList: [],      //keyword数组
        pushTypeList: [],
        customTypeList: '',
        smsKeyWord: [],       //短信keyword数组
        miniKeyWord: [],      //小程序keyword数组
        showClick: true,      //微信通知keyword超过五个不显示增加
        keyList: [],
        miniTips:'',
        miniTips:'',
        intervalTime: '',
        text: '选择自定义推送时间后，可在配置项后边新增{X条}，则会展示一段时间内统计的消息数量 \n 示例：\n keyword1：你收到了点赞{X条}\n则推送消息为：keyword1：你收到了点赞X条',
        delayTimeOptions: [
          {
            label: '秒',
            value: 1
          },
          {
            label: '分',
            value: 2
          },
          {
            label: '时',
            value: 3
          },
          {
            label: '天',
            value: 4
          },
          {
            label: '月',
            value: 5
          }
        ],
        delayTimeValue: 1,
      }
    },
    components: {
      Card,
      CardRow,
      TableContAdd
    },
    created() {
      this.query = this.$route.query;
      this.typeStatus = this.$route.query.typeStatus;
      this.typeName = this.$route.query.typeName;
      this.noticeConfigure();
    },
    methods: {
      // 点击添加关键字
      tableContAdd(type, index) {
        if (type === 'appletsList' && this.appletsList.length <= 4) {
          this.appletsList.push('');
        } else if (type === 'appletsList' && this.appletsList.length > 4) {
          this.showClick = false;
        } else if (type === 'smsKeyWord') {
          this.smsKeyWord.push('');
        } else if (type === 'miniKeyWord') {
          this.miniKeyWord.push('')
        }
      },
      // 点击删除图标
      delectClick(index, type) {
        if (type === 'appletsList') {
          this.showClick = true;
          this.appletsList.splice(index, 1);
        } else if (type === 'smsKeyWord') {
          this.smsKeyWord.splice(index, 1);
        } else if (type === 'miniKeyWord') {
          this.miniKeyWord.splice(index, 1);
        }
      },
      // 通知方式切换
      noticeListChange(data) {
        this.showSystem = data.includes("0");
        this.showWx = data.includes("1");
        this.showMini = data.includes("4");
        this.showSms = data.includes("2");
      },
      // 初始化配置列表信息
      noticeConfigure() {
        this.appFetch({
          url: 'notices_detail_get_v3',
          method: 'get',
          splice: `?typeName=${this.typeName}`,
          data: {}
        }).then(res => {
          if (res.Code !== 0) {
            this.$message.error(res.Message);
            return
          }
          // 系统通知数据
          if (res.Data[0]) {
            this.systemList = res.Data[0];
            let vars = this.systemList.templateVariables;
            if (vars) {
              this.systemDes = '请输入模板消息详细内容对应的变量。关键字个数需与已添加的模板一致。\n\n可以使用如下变量：\n';
              for (let key in vars) {
                this.systemDes += `${key} ${vars[key]}\n`;
              }
            }
            if (this.systemList.status === 1) {
              !this.noticeList.includes("0") && this.noticeList.push("0")
              this.showSystem = true
            } else {
              this.showSystem = false
            }
          }
          // 微信模板通知
          if (res.Data[1]) {
            this.wxList = res.Data[1];
            let timeDelay = res.Data[1].delayTime;
            if (timeDelay / 60 < 1) {
              this.delayTime = timeDelay;
              this.delayTimeValue = 1;
            } else if (timeDelay / 60 / 60 < 1){
              this.delayTime = timeDelay / 60;
              this.delayTimeValue = 2;
            } else if (timeDelay / 60 / 60 / 24 < 1) {
              this.delayTime = timeDelay / 60 / 60;
              this.delayTimeValue = 3;
            } else if (timeDelay / 60 / 60 / 24 / 30 < 1) {
              this.delayTime = timeDelay / 60 / 60 / 24;
              this.delayTimeValue = 4
            }else if (timeDelay / 60 / 60 / 24 / 30 / 12 < 1) {
              this.delayTime = timeDelay / 60 / 60 / 24 / 30;
              this.delayTimeValue = 5
            }
            let vars = this.wxList.templateVariables;
            if (vars) {
              this.wxDes = '请输入模板消息详细内容对应的变量。关键字个数需与已添加的模板一致。\n\n可以使用如下变量：\n';
              for (let key in vars) {
                this.wxDes += `${key} ${vars[key]}\n`;
              }
            }
            this.customTypeList = this.wxList.pushType;
            if (this.wxList.pushType === 0) {
              this.pushTypeList= this.wxList.keywordsData.length > 0
                ? this.wxList.keywordsData
                : ['', ''];
            } else {
              this.pushTypeList= this.wxList.keywordsData.length > 0
              ? this.wxList.keywordsData
              : [];
            }
            if (this.wxList.status === 1) {
              !this.noticeList.includes("1") && this.noticeList.push("1")
              this.showWx = true;
            } else {
              this.showWx = false;
            }
            this.appletsList = this.pushTypeList;
            // this.customTypeList = this.pushTypeList;
          }

          // 短信通知
          if (res.Data[2]) {
            this.smsList = res.Data[2];
            this.smsKeyWord = this.smsList.keywordsData.length > 0
              ? this.smsList.keywordsData
              : [''];
              let vars = this.smsList.templateVariables;
              if (vars) {
                this.smsDes = '请输入模板消息详细内容对应的变量。关键字个数需与已添加的模板一致。\n\n可以使用如下变量：\n';
                for (let key in vars) {
                  this.smsDes += `${key} ${vars[key]}\n`;
                }
              }
              if (this.smsList.status === 1) {
                !this.noticeList.includes("2") && this.noticeList.push("2")
                this.showSms = true;
              }else {
                this.showSms = false;
              }
          }

          // 小程序通知
          if (res.Data[3]) {
            this.miniProgramList = res.Data[3];
            this.keyList = this.miniProgramList.keys;
            this.miniKeyWord = this.miniProgramList.keywordsData.length > 0
              ? this.miniProgramList.keywordsData
              : ['', ''];
              let vars = this.miniProgramList.templateVariables;
              this.miniTips = '\n<a href="https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.send.html" target="_blank">订阅消息参数值内容限制说明</a>填写错误将导致用户无法接收到消息通知'
              if (vars) {
                this.miniDes = '请输入模板消息详细内容对应的变量。关键字个数需与已添加的模板一致。\n\n可以使用如下变量：\n';
                for (let key in vars) {
                  this.miniDes += `${key} ${vars[key]}\n`;
                }
              }
              if (this.miniProgramList.status === 1) {
                !this.noticeList.includes("4") && this.noticeList.push("4")
                this.showMini = true;
              }else {
                this.showMini = false
              }
          }
        })
      },
      async getNoticesDetail (type, typeName) {
        try {
          const response = await this.appFetch({
            url: 'notices_detail_get_v3',
            method: 'get',
            data: {
              typeName,
              type,
            }
          });
          return response;
        } catch (err) {
  
        }
      },
      // 提交按钮
      pushTypeCange(value) {
        if (value === 1) {
          if (value !== this.customTypeList) {
            this.appletsList = [];
          } else {
            this.appletsList = this.pushTypeList;
          }
        }
        if (value === 0) {
          if (this.pushTypeList.length < 1 || value !== this.customTypeList) {
            this.appletsList = ['', ''];
          } else {
            this.appletsList = this.pushTypeList;
          }
        }
      },
      Submission() {
        let data = [];
        // 系统通知提交数据
        if (this.showSystem === true){
          // if (this.systemList.content === '') {
          //   this.$message.error('请填写通知内容');
          //   return;
          // }
          data.push({
            "id": this.systemList.tplId,
            "status": 1,
            "templateId": this.systemList.templateId,
            "title": this.systemList.title,
            "content": this.systemList.content
          });
        } else {
          data.push({
            "id": this.systemList.tplId,
            "status": 0,
          });
        }
        // 微信通知提交数据
        if (this.showWx === true){
          if (this.wxList.firstData === '' && this.wxList.pushType === 0) {
            this.$message.error('请填写first');
            return;
          }
          for (let key in this.appletsList) {
            if (key >= 2) {
              break;
            }
            if (!this.appletsList[key]) {
            this.$message.error('请填写keywords');
            return;
            }
          }
          if (this.wxList.remarkData === '') {
            this.$message.error('请填写remark');
            return;
          }
          let firstData = '';
          if (this.wxList.pushType === 0) {
            firstData = this.wxList.firstData;
          }
          let delayTimeValue = '';
          switch (this.delayTimeValue) {
            case 1: delayTimeValue = this.delayTime;
              break;
            case 2: delayTimeValue = this.delayTime * 60;
              break;
            case 3: delayTimeValue = this.delayTime * 60 * 60;
              break;
            case 4: delayTimeValue = this.delayTime * 60 * 60 * 24;
              break;
            case 5: delayTimeValue = this.delayTime * 60 * 60 * 24 * 30;
              break;
            default:
              break;
          }
          data.push({
            "id": this.wxList.tplId,
            "status": 1,
            "templateId": this.wxList.templateId,
            "firstData": firstData,
            "keywordsData": this.appletsList,
            "remarkData": this.wxList.remarkData,
            "redirectType": this.wxList.redirectType,
            "redirectUrl": this.wxList.redirectUrl,
            "pagePath":this.wxList.pagePath,
            "pushType": this.wxList.pushType,
            "delayTime": delayTimeValue,
          });
        } else {
          data.push({
            "id": this.wxList.tplId,
            "status": 0,
          });
        }

        // 短信通知提交数据
        if (this.showSms === true) {
          if (this.smsList.templateId === '') {
            this.$message.error('请填写短信模版ID');
            return;
          }
          for (let key in this.smsKeyWord) {
            if (key >= 2) {
              break;
            }
            if (!this.smsKeyWord[key]) {
            this.$message.error('请填写keywords');
            return;
            }
          }
          data.push({
            "id": this.smsList.tplId,
            "status": 1,
            "title": this.smsList.title,
            "templateId": this.smsList.templateId,
            "keywordsData": this.smsKeyWord,
          });
        } else {
          data.push({
            "id": this.smsList.tplId,
            "status": 0,
          });
        }

      // 小程序订阅提交数据
      if (this.showMini === true) {
        if (this.miniProgramList.templateId === '') {
          this.$message.error('请填写小程序模版ID');
          return;
        }
        if (this.keyList.length > 0) {
          for (let i = 0, len = this.miniKeyWord.length; i < len; i++) {
            if (this.miniKeyWord[i] === "") {
              this.$message.error("请填写keywords");
              return;
            }
          }
        }
         if (this.miniProgramList.pagePath === '') {
          this.$message.error('请填写小程序路径');
          return;
        }
        data.push({
          "id": this.miniProgramList.tplId,
          "status": 1,
          "templateId": this.miniProgramList.templateId,
          "title": this.miniProgramList.title,
          "keywordsData": this.miniKeyWord,
          "pagePath": this.miniProgramList.pagePath
        });
      } else {
        data.push({
          "id": this.miniProgramList.tplId,
          "status": 0,
        });
      }

        this.appFetch({
          url: 'notices_update_post_v3',
          method: 'post',
          data: {
            data,
          }
      }).then(res=>{
        if (res.errors) {
          if (res.errors[0].detail) {
            this.$message.error(
              res.errors[0].code + "\n" + res.errors[0].detail[0]
            );
          } else {
            this.$message.error(res.errors[0].code);
          }
          }else {
            if (res.Code !== 0) {
              this.$message.error(res.Message);
              return
            }
            this.$message({
              message: '提交成功',
              type: 'success'
          });
          this.noticeConfigure();
        }
      })
      }
    }
}
