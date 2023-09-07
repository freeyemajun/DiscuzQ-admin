export default {
	data: function () {
		return {
			financialList: [
				{
					title: "用户总充值",
					num: "0",
					icon: 'iconchongzhi',
					key: 'totalIncome',
					iconShow: true,
				},
				{
					title: "用户总提现",
					num: "0",
					icon: 'icontixian',
					key: 'totalWithdrawal',
					iconShow: true,

				},
				{
					title: "用户钱包总金额",
					num: "0",
					icon: 'iconqianbaozongjine',
					key: 'totalWallet',
					iconShow: true,

				},
				{
					title: "用户订单总数",
					num: "0",
					icon: 'icondingdanzongshu',
					key: 'orderCount',
					iconShow: false,

				},
				{
					title: "平台总盈利",
					num: "0",
					icon: 'iconcaiwutongji',
					key: 'totalProfit',
					iconShow: true,

				},
				{
					title: "提现手续费收入",
					num: "0",
					icon: 'iconshouxufeishouru',
					key: 'withdrawalProfit',
					iconShow: true,

				},
				{
					title: "打赏提成收入",
					num: "0",
					icon: 'icondashangtichengshouru',
					key: 'orderRoyalty',
					iconShow: true,

				},
				{
					title: "注册加入收入",
					num: "0",
					icon: 'iconzhucejiarushouru',
					key: 'totalRegisterProfit',
					iconShow: true,

				},

			],                         //财务统计数据
			financialEcharts: null,    //盈利图标
			financiaOrderEchart: null, //订单图标
			pickerOptions: {
				shortcuts: [{
					text: '最近一周',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近一个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近三个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}]
			},                        //盈利统计时间
			financialTime: ['', ''],  //申请时间
			orderTime: ['', ''],      //申请时间
			valueMouth: ['', ''],       //盈利按月统计时间
			valueOrder: ['', ''],       //订单按月统计时间
			noData: false,            //暂无数据
			noDataOrder: false,       //订单暂无数据
			istrue: 0,
			istrueOder: 0,
			mouthTab: false,         //按月统计组件
			dayTab: true,           //按日统计
			mouthOrderTab: false,    //订单按月统计
			dayOderTab: true,        //订单按日统计
			indexOrderTab: false,    //订单切换
			indexStatistics: false,  //盈利切换
			items: [
				{ name: '按日统计', index: 1 },
				{ name: '按周统计', index: 2 },
				{ name: '按月统计', index: 3 }
			]

		}
	},
	created() {
		this.statistic();           //获取资金概况
	},
	mounted() {
		this.earningsStatistics();  //盈利统计
		this.orderStatistics();     //订单统计
	},
	methods: {
		/*
    * 盈利统计切换日期
    * */
		tab(index) {
			this.istrue = index
			if (index == 0 || index == 1) {
				this.dayTab = true;
				this.mouthTab = false;
				this.indexStatistics = false;
			}
			if (index == 2) {
				this.mouthTab = true
				this.dayTab = false;
				this.indexStatistics = true;
			}
			this.earningsStatistics();
		},
		/*
    * 订单统计切换日期
    * */
		tabOrder(index) {
			this.istrueOder = index
			if (index == 0 || index == 1) {
				this.dayOderTab = true;
				this.mouthOrderTab = false
				this.indexOrderTab = false;
			}
			if (index == 2) {
				this.mouthOrderTab = true;
				this.dayOderTab = false;
				this.indexOrderTab = true;
			}
			this.orderStatistics();
		},
		/*
    * 获取资金概况统计
    * */
		statistic() {
			this.appFetch({
				url: 'finance_get_v3',
				method: 'get',
				data: {

				}
			}).then(res => {
				if (res.Code !== 0) {
          this.$message.error(res.Message);
          return
        }
				var oArr = Object.entries(res.Data);
				for (var i = 0; i < this.financialList.length; i++) {
					for (var j = 0; j < oArr.length; j++) {
						if (this.financialList[i].key == oArr[j][0]) {
							this.financialList[i].num = oArr[j][1];
						}
					}
				}
			})
		},
		/*
    * 盈利统计日\周
    * */
		change() {
			this.earningsStatistics();
		},
		/*
    * 订单统计日\周
    * */
		changeOrder() {
			this.orderStatistics();
		},
		getDateInfo(date){
			const a = date.split(' ')[0].split('-');
			const index = date.indexOf(' ');
			const day = new Date(a[0], a[1], 0).getDate();
			const b = date.substring(0, index - 2)
			const c = date.substring(index)
			
			return b + day + c;
		},
		/*
    * 盈利统计月
    * */
		changeMouth() {
			if (this.valueMouth == null) {
				this.valueMouth = ['', '']
			} else if (this.valueMouth[0] !== '' && this.valueMouth[1] !== '') {
				this.valueMouth[0] = this.valueMouth[0] + '-00-00-00';
				this.valueMouth[1] = this.getDateInfo(this.valueMouth[1]) + '-24-00-00';
			}
			// this.currentPaga = 1;
			this.earningsStatistics();
		},
		/*
    * 订单统计月
    * */
		changeOrderMouth() {
			this.orderStatistics();
		},
		/*
    * 盈利统计数据请求传给图表
    * */
		earningsStatistics() {
			this.financialTime = this.financialTime == null ? ['',''] : this.financialTime;
			this.valueMouth = this.valueMouth == null ? ['',''] : this.valueMouth;

			var dataStatistics = {    //盈利统计按日、周统计
				'type': this.istrue + 1,
				'createdAtBegin': this.financialTime[0],
				'createdAtEnd': this.financialTime[1],
			}
			var dataStatisticsMouth = {    //盈利统计按月统计
				'type': this.istrue + 1,
				'createdAtBegin': this.valueMouth[0],
				'createdAtEnd': this.valueMouth[1],
			}
			var data;
			if (this.indexStatistics == false) {
				data = dataStatistics
			} else {
				data = dataStatisticsMouth
			}
			this.appFetch({
				url: 'financeChart_get_v3',
				method: 'get',
				data: data
			}).then(res => {
				if (res.Code !== 0) {
          this.$message.error(res.Message);
          return
        }
				if (res.Data.length === 0) {
					this.noData = true
				} else {
					this.noData = false
				}
				var date = [];
				var total_profit = [];
				var withdrawal_profit = [];
				var master_portion = [];
				var register_profit = [];
				res.Data.map(item => {
					date.push(item.date)
					total_profit.push(item.totalProfit)
					withdrawal_profit.push(item.withdrawalProfit)
					master_portion.push(item.masterPortion)
					register_profit.push(item.registerProfit)
				})
				this.earningsEcharts(date, total_profit, withdrawal_profit, master_portion, register_profit)

			})
		},
		/*
    * 订单数据请求
    * */
		orderStatistics() {
			this.orderTime = this.orderTime == null ? ['',''] : this.orderTime;
			this.valueOrder = this.valueOrder == null ? ['',''] : this.valueOrder;

			var dataDay = {
				'type': this.istrueOder + 1,
				'createdAtBegin': this.orderTime[0],
				'createdAtEnd': this.orderTime[1],
			}
			var dataMouth = {
				'type': this.istrueOder + 1,
				'createdAtBegin': this.valueOrder[0],
				'createdAtEnd': this.valueOrder[1],
			}
			var data;
			if (this.indexOrderTab == false) {
				data = dataDay
			}
			if (this.indexOrderTab == true) {
				data = dataMouth
			}
			this.appFetch({
				url: 'financeChart_get_v3',
				method: 'get',
				data: data
			}).then(res => {
				if (res.Code !== 0) {
          this.$message.error(res.Message);
          return
        }
				if (res.Data.length === 0) {
					this.noDataOrder = true
				} else {
					this.noDataOrder = false
				}
				var date = [];
				var order_count = [];
				var order_amount = [];
				res.Data.map(item => {
					date.push(item.date);
					order_count.push(item.orderCount);
					order_amount.push(item.orderAmount);

				})
				this.orderEcharts(date, order_count, order_amount)

			})

		},
		/*
    * 绘制盈利统计图表
    * */
		earningsEcharts(date, total_profit, withdrawal_profit, master_portion, register_profit) {
			//初始化Echarts实例
			if (!this.financialEcharts) {
				this.financialEcharts = this.$echarts.init(this.$refs.financialProfitEcharts)
			}
			//绘制图表
			var option = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},

				legend: {
					data: ['平台总盈利', '提现手续费收入', '打赏提成收入', '注册加入收入']
				},
				grid: {
					left: '1%',
					right: '6%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: date,
						axisLabel: {
							interval: 0,
							rotate: -40
						},
					},

				],

				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '平台总盈利', //total_profit
						type: 'line',
						stack: '总量',
						areaStyle: {},
						data: total_profit
					},
					{
						name: '提现手续费收入', //withdrawal_profit
						type: 'line',
						stack: '总量',
						areaStyle: {},
						data: withdrawal_profit
					},
					{
						name: '打赏提成收入', //master_portion
						type: 'line',
						stack: '总量',
						areaStyle: {},
						data: master_portion
					},
					{
						name: '注册加入收入', //register_profit
						type: 'line',
						stack: '总量',
						areaStyle: {},
						data: register_profit
					},
				]
			};
			this.financialEcharts.setOption(option);
		},
		/*
    * 绘制订单统计图表
    * */
		orderEcharts(date, order_count, order_amount) {
			//初始化Echarts实例
			if (!this.financiaOrderEchart) {
				this.financiaOrderEchart = this.$echarts.init(this.$refs.financialOrderEcharts)
			}
			//绘制图表
			var option = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},
				legend: {
					data: ['订单数量', '订单金额']
				},
				grid: {
					left: '1%',
					right: '6%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: date,
						axisLabel: {
							interval: 0,
							rotate: -40
						},
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '订单数量', //order_count
						type: 'line',
						stack: '总量',
						areaStyle: {},
						data: order_count
					},
					{
						name: '订单金额', //order_amount
						type: 'line',
						stack: '总量',
						areaStyle: {},
						data: order_amount
					},
				]
			};
			this.financiaOrderEchart.setOption(option);
		}
	}
}
