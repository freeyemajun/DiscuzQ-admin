/**
 * 首页控制器
 */
import Card from '../../../view/site/common/card/card';
import axios from 'axios'

export default {
  data:function () {
    return {
      userlist:[
        '八桂',
        '凌。',
        'Clementine',
        '矢車菊',
        '扫花轩主',
        '玖',
        '红城纪',
        '中华重剑余骁烨',
        '褚瑞峰rmgs.com.cn',
        '东都狼',
        'V5',
        't',
        '黄群友JIQ.cc',
        '星也',
        '群友默默支持。暂时不使用',
        '望山 窥荷',
        '莓泥不行ʸᵃ',
        '11111111111111111111111111111111',
        '阿江',
        'A 支持',
        '雄.com',
        'A马新亚',
        '严嵩',
        '云深',
        '启璇云网络',
        '春宇',
        '志哥',
        '陈同学',
      ],
    }
  },

  created(){

  },
  methods: {
    open() {
      this.$alert('<img src="/static-admin/images/20230314172706.png" style="width: 400px;"/>', '扫码捐助', {
        dangerouslyUseHTMLString: true
      });
    }
  },
  components:{
    Card
  }
}
