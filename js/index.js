//一堆数组
var pm2 = [];
var pm10 = [];
var so2 = [];
var no2 = [];
var co = [];
var o3 = [];
var u = [];
var v = [];
var temps = [];
var rh = [];
var psfs = [];
var provice = [];
var loncation = [];
var op1 = [];

var category1 = [];
var reg = /.+?(?=(省|市|自治区|自治州|县|区|维吾尔|回族|壮族|元朗|大埔))/g;
var top5Pm2 = [];
var op2 = [];
var top5provice = [];
var proviceset = [];
var datax = [];
var selected = "山东";
var loc = [];
var averPm = [];
var res = [];
$(function() {
	$.getJSON(
		'./json/20130126.json',
		init)
})

function init(data) {

	//console.log(temps);
	getData(data, selected);
	leftUp();
	rightUp(data);
	leftDown(data);
	rightDown();
	mainMap(data);

}

function getData(data, selected) {

	pm2.splice(0, pm2.length);
	pm10.splice(0, pm10.length);
	so2.splice(0, so2.length);
	no2.splice(0, no2.length);
	o3.splice(0, o3.length);
	u.splice(0, u.length);
	v.splice(0, v.length);
	temps.splice(rh.length);
	psfs.splice(0, psfs.length);
	provice.splice(0, provice.length);
	loncation.splice(0, loncation.length);
	for (var key in data) {
		//console.log(key);     //获取key值
		//获取对应的value值

		//指定省份
		//var loc = "山东"
		// console.log(typeof(selected) );
		var s = data[key].name.match(reg)[0];
		if (s == selected) {
			// console.log(typeof(data[key].name.match(reg)[0]));
			pm2.push(data[key].PM2);
			pm10.push(data[key].PM10);
			so2.push(data[key].SO2);
			no2.push(data[key].NO2);
			co.push(data[key].CO);
			o3.push(data[key].O3);
			u.push(data[key].U);
			v.push(data[key].V);
			temps.push(changeTemp(data[key].TEMP));
			rh.push(data[key].RH);
			psfs.push(data[key].PSFS);

			provice.push(data[key].name.match(reg)[0]);
			// console.log(data[key].value[1]);
			// loncation.splice(key,1);
			loncation.push(key, data[key].value);

		}
		// console.log(psfs);
	}

}

//js计算数组中元素出现的次数，并实现去重
function getCount(arr, rank, ranktype) {
	var obj = {},
		k, arr1 = [];
	for (var i = 0, len = arr.length; i < len; i++) {
		k = arr[i];
		if (obj[k])
			obj[k]++;
		else
			obj[k] = 1;
	}
	//保存结果{el-'元素'，count-出现次数}
	for (var o in obj) {
		arr1.push({
			el: o,
			count: obj[o]
		});
	}
	//排序（降序）
	arr1.sort(function(n1, n2) {
		return n2.count - n1.count
	});
	//如果ranktype为1，则为升序，反转数组
	if (ranktype === 1) {
		arr1 = arr1.reverse();
	}
	var rank1 = rank || arr1.length;
	return arr1.slice(0, rank1);
}

//数组取随机个数据
//取出随机数  arr为数组，maxNum为取出随机数的个数
function RandomNumBoth(arr, maxNum) {
	var numArr = [];
	var arrLength = arr.length;
	for (var i = 0; i < arrLength; i++) {
		var Rand = arr.length;
		//取出随机数 
		var number = Math.floor(Math.random() * arr.length); //生成随机数num
		numArr.push(arr[number]); //往新建的数组里面传入数值
		arr.splice(number, 1); //传入一个删除一个，避免重复
		if (arr.length <= arrLength - maxNum) {
			return numArr;
		}
	}
}

function changeTemp(item) {
	return (item - 273.15).toFixed(2);
}
//数组求和
function sum(arr) {
	return eval(arr.join("+"));
};

//左上角图
function leftUp() {
	//console.log(provice[0])
	var average = [];
	//存放主要污染物的平均值
	average.splice(0, 1, ((sum(pm2) / pm2.length).toFixed(2)));
	average.splice(1, 2, ((sum(pm10) / pm10.length).toFixed(2)));
	average.splice(2, 3, ((sum(so2) / so2.length).toFixed(2)));
	average.splice(3, 4, ((sum(no2) / no2.length).toFixed(2)));
	average.splice(4, 5, ((sum(co) / co.length).toFixed(2)));
	average.splice(6, 7, ((sum(o3) / o3.length).toFixed(2)));
	//console.log(average);
	//拷贝数组一份为了下标对应temp[]
	var temp = []
	for (let i = 0; i < average.length; i++) {
		temp[i] = average[i];
	}
	//从大到小排序
	op1 = average.sort(function(a, b) {
		return b - a;
	});

	//console.log(temp);

	var name = [];
	name[0] = "PM2.5";
	name[1] = "PM10";
	name[2] = "SO2";
	name[3] = "NO2";
	name[4] = "CO";
	name[5] = "O3";

	for (var i = 0; i < average.length; i++) {
		for (var j = 0; j < temp.length; j++) {
			if (average[i] == temp[j]) {
				category1.splice(i, i + 1, name[j]);
			}
		}
	}
	//console.log(op1); 
	//console.log(category1);

	// 实例化对象
	var myChart = echarts.init(document.querySelector(".bar .chart"));
	// 指定配置和数据
	var option1 = {
		title: {
			text: selected,
			//subtext: '纯属虚构',
			left: 'center',
			textStyle: { //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
				fontFamily: 'Arial, Verdana, sans...',
				fontSize: 16,
				color: "#ffffff",
				fontStyle: 'normal',
				fontWeight: 'normal',
			},

		},
		color: ["#2f89cf"],
		tooltip: {
			trigger: "axis",
			axisPointer: {
				// 坐标轴指示器，坐标轴触发有效
				type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			left: "0%",
			top: "10px",
			right: "0%",
			bottom: "4%",
			containLabel: true
		},
		xAxis: [{
			type: "category",
			data: [],
			axisTick: {
				alignWithLabel: true
			},
			axisLabel: {
				textStyle: {
					color: "rgba(255,255,255,.6)",
					fontSize: "12",
					color: '#ffffff'
				}
			},
			axisLine: {
				show: false
			}
		}],
		yAxis: [{
			type: "value",
			axisLabel: {
				textStyle: {
					color: "rgba(255,255,255,.6)",
					fontSize: "16",
					color: '#ffffff'

				}
			},
			axisLine: {
				lineStyle: {
					color: "rgba(255,255,255,.1)"
					// width: 1,
					// type: "solid"
				}
			},
			splitLine: {
				lineStyle: {
					color: "rgba(255,255,255,.1)"
				}
			}
		}],
		series: [{
			//name: "直接访问",
			type: "bar",
			barWidth: "35%",
			data: [],
			itemStyle: {
				barBorderRadius: 5
			}
		}]
	};


	// 把配置给实例对象
	myChart.setOption(option1);

	setInterval(function() {

		//刷新数据
		myChart.setOption({
			xAxis: {
				data: category1
			},
			series: [{
				data: op1
			}]
		});
	}, 500);

	// myChart.setOption(option1.series[0].data = op1);
	window.addEventListener("resize", function() {
		myChart.resize();
	});
}

//右上角图
function rightUp(data) {
	for (var key in data) {
		top5Pm2.push(data[key].PM2);
		top5provice.push(data[key].name.match(reg)[0]);
		//console.log(top5Pm2.length);
	}
	proviceset = getCount(top5provice);
	var provices = getCount(top5provice);
	//console.log(provices[0].el);

	function getAvr(name) {
		var countpm10 = 0;
		var countpm2 = 0;
		var flag = 0;
		for (var key in data) {
			//指定省份

			if (data[key].name.match(reg)[0] == name) {

				countpm2 += parseFloat(data[key].PM2);

				countpm10 += parseFloat(data[key].PM10);
				flag++;
			}
		}
		return (countpm2 + countpm10) / (parseFloat(flag));
	}
	//console.log(getAvr("海南省"));
	var op2temp = [];
	var temp = [];
	for (var key in provices) {
		op2temp.push(getAvr(provices[key].el).toFixed(2));
		temp.push(getAvr(provices[key].el).toFixed(2));
	}
	//console.log(temp)
	op2 = op2temp.sort(function(a, b) {
		return b - a;
	}).splice(0, 5);
	//console.log(op2);	
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < temp.length; j++) {
			if (op2[i] == temp[j]) {
				datax.splice(i, i + 1, provices[j].el);
			}
		}
	}
	//console.log(provices);
	//console.log(datax)
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.querySelector(".bar1 .chart"));

	option = {
		xAxis: {
			max: 'dataMax',
			axisLabel: {
				show: true,
				textStyle: {
					fontSize: 16,
					color: '#ffffff'
				}
			}
		},
		yAxis: {
			type: 'category',
			data: [],
			inverse: true,
			animationDuration: 300,
			animationDurationUpdate: 300,
			max: 5 // only the largest 3 bars will be displayed
		},
		series: [{
			realtimeSort: true,
			name: '行政区',
			type: 'bar',
			boundaryGap: "50%",
			data: [],
			label: {
				show: true,
				position: 'right',
				valueAnimation: true
			}
		}],
		legend: {
			show: false

		},
		grid: {
			left: '8%',
			right: '0',
			bottom: '1%',
			containLabel: true
		}
	};


	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
	setInterval(function() {

		//刷新数据
		myChart.setOption({

			yAxis: [{
				data: [{
					value: datax[0],
					textStyle: {
						color: '#dd6b66',
						fontSize: "12"
					}
				}, {
					value: datax[1],
					textStyle: {
						color: '#759aa0',
						fontSize: "12"
					}
				}, {
					value: datax[2],
					textStyle: {
						color: '#e69d87',
						fontSize: "12"
					}
				}, {
					value: datax[3],
					textStyle: {
						color: '#8dc1a9',
						fontSize: "12"
					}
				}, {
					value: datax[4],
					textStyle: {
						color: '#ea7e53',
						fontSize: "12"
					}
				}]
			}],
			series: [{

				data: [{
					value: op2[0],
					itemStyle: {
						color: '#dd6b66',
						fontSize: "16"
					}
				}, {
					value: op2[1],
					itemStyle: {
						color: '#759aa0',
						fontSize: "16"
					}
				}, {
					value: op2[2],
					itemStyle: {
						color: '#e69d87',
						fontSize: "16"
					}
				}, {
					value: op2[3],
					itemStyle: {
						color: '#8dc1a9',
						fontSize: "16"
					}
				}, {
					value: op2[4],
					itemStyle: {
						color: '#ea7e53',
						fontSize: "16"
					}
				}]
			}]
		});
	}, 500);
	window.addEventListener("resize", function() {
		myChart.resize();
	});
}

//左下角图
function leftDown(data) {
	var temp1 = [];
	var rh1 = [];
	var tempset = [];
	var rhset = [];

	// proviceset.el所有省份
	for (var key in data) {
		tempset.push(changeTemp(data[key].TEMP));
		rhset.push(data[key].RH);
	}

	function getAvr(name, param) {
		var count = 0;
		// var countpm2 = 0;
		var flag = 0;
		for (var key in data) {
			//指定省份
			if (data[key].name.match(reg)[0] == name) {

				count += parseFloat(param[flag]);

				// countpm10 += parseFloat(data[key].PM10);
				flag++;
			}
		}
		return (count / (parseFloat(flag))).toFixed(2);
	}
	var tempdemo = [];
	var rhdemo = [];
	var tempdemo1 = [];
	var rhdemo1 = [];
	var tempprovice = [];
	var rhprovice = [];

	for (var key in proviceset) {
		tempdemo.push(getAvr(proviceset[key].el, tempset));
		rhdemo.push(getAvr(proviceset[key].el, rhset));
		tempdemo1.push(getAvr(proviceset[key].el, tempset));
		rhdemo1.push(getAvr(proviceset[key].el, rhset));
	}
	console.log(tempdemo);
	console.log(rhdemo);
	temp1 = tempdemo.sort(function(a, b) {
		return b - a;
	}).splice(0, 5);

	rh1 = rhdemo.sort(function(a, b) {
		return b - a;
	}).splice(0, 5);
	console.log(proviceset[0].el);
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < tempdemo1.length; j++) {
			// console.log(tempdemo1[j]);
			if (temp1[i] == tempdemo1[j]) {
				tempprovice.push(proviceset[j].el);

			}
		}
	}
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < rhdemo1.length; j++) {
			if (rh1[i] == rhdemo1[j]) {
				rhprovice.push(proviceset[j].el);
			}
		}
	}
	console.log(temp1);
	console.log(tempprovice);
	console.log(rh1);
	console.log(rhprovice);
	var res1 = [];
	var res2 = [];
	var array = {};
	for (var key in temp1) {
		array['value'] = temp1[key];
		array['name'] = tempprovice[key];
		res1.push(array);
		array = {};
	}
	for (var key in rh1) {
		array['value'] = rh1[key];
		array['name'] = rhprovice[key];
		res2.push(array);
		array = {};
	}


	var fromat = '{b}:{c}℃';
	var data = res1;
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.querySelector(".line .chart"));

	option = {
		legend: {
			top: 'bottom'
		},
		toolbox: {
			show: true,
			// feature: {
			//     mark: {show: true},
			//     dataView: {show: true, readOnly: false},
			//     restore: {show: true},
			//     saveAsImage: {show: true}
			// }
		},
		label: {
			show: true, //饼图上的数据是否展示true展示false不展示
			position: 'inner', //饼图上的数据展示位置inner是展示在内部
			formatter: '{b}:{c}℃' //饼图上展示的数据格式
		},
		series: [{
			//name: '面积模式',
			type: 'pie',
			radius: [0, 90],
			center: ['50%', '42%'],
			roseType: 'area',
			itemStyle: {
				borderRadius: 8
			},
			data: data
		}]
	};
	var flag = false;
	// 重新把配置好的新数据给实例对象
	myChart.setOption(option);

	$('#dp').on('click', function() {
		// var the = $(this)

		// console.log(document.getElementById('dq'));
		if (flag) {
			console.log(flag);
			myChart.setOption({
				label: {
					formatter: '{b}:({c}%)'
				},
				series: [{
					data: res2
				}]
			});
		} else {
			myChart.setOption({
				label: {
					formatter: '{b}:{c}℃'
				},
				series: [{
					data: res1
				}],
			});

		}
		flag = !flag;

	})

	window.addEventListener("resize", function() {
		myChart.resize();
	});
}

//右下角图
function rightDown() {
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.querySelector(".line1 .chart"));

	option = {
		title: {
			//text: '主要污染物占比',
			//subtext: '纯属虚构',
			left: 'center'
		},
		tooltip: {
			trigger: 'item',
			// fromatter: '{a}<br>{b}:{c}({d}%)'
		},
		label: {
			show: true, //饼图上的数据是否展示true展示false不展示
			position: 'inner', //饼图上的数据展示位置inner是展示在内部
			formatter: '{b}({d}%)' //饼图上展示的数据格式
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			textStyle: { //图例文字的样式
				color: '#fff',
				fontSize: 16
			},
		},
		series: [{
			//name: '访问来源',
			type: 'pie',
			radius: '50%',
			center: ['50%', '60%'],
			data: [],
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				},
				// normal:{ 
				//                         label:{ 
				//                             show: true, 
				//                             formatter: '{b} : {c} ({d}%)' 
				//                         }, 
				//                         labelLine :{show:true} 
				//                     } 
			}
		}]
	};
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
	setInterval(function() {

		//刷新数据
		myChart.setOption({

			series: [{
				data: [{
						value: sum(pm2).toFixed(2),
						name: 'PM2.5'
					},
					{
						value: sum(pm10).toFixed(2),
						name: 'PM10'
					},
					{
						value: sum(so2).toFixed(2),
						name: 'SO2'
					},
					{
						value: sum(no2).toFixed(2),
						name: 'NO2'
					},
					{
						value: sum(co).toFixed(2),
						name: 'CO'
					},
					{
						value: sum(u).toFixed(2),
						name: 'U'
					},
					{
						value: sum(v).toFixed(2),
						name: 'V'
					}
				]
			}]
		});
	}, 500);

	window.addEventListener("resize", function() {
		myChart.resize();
	});
}


//地图
function mainMap(data) {
	function getAvr(name) {
		var countpm10 = 0;
		var countpm2 = 0;
		var flag = 0;
		for (var key in data) {
			//指定省份

			if (data[key].name.match(reg)[0] == name) {

				countpm2 += parseFloat(data[key].PM2);

				countpm10 += parseFloat(data[key].PM10);
				flag++;
			}
		}
		return (countpm2 + countpm10) / (parseFloat(flag));
	}
	averPmtemp = [];
	var array = {};
	for (var key in proviceset) {
		averPm.push(getAvr(proviceset[key].el).toFixed(2));
		// 	// averPmtemp.push(getAvr(provices[key].el).toFixed(2));
		// 	// res['name']=proviceset[key];
		// 	// res['value']=averPm;
		// }

		// for(var i = 0; i < averPm.length; i++){
		array['name'] = proviceset[key].el;
		array['value'] = averPm[key];
		res.push(array);
		array = {};
	}

	//console.log(res);
	// for (var key  in data ) {
	// 		//指定省份
	// 		if(data[key].name.match(reg)[0]==proviceset[key].el){	
	// 		loc.push(data[key].name.match(reg)[0]);	
	// 		averPm2.push(data[key].value);
	// 		console.log(proviceset);
	// 		  }
	// 	}
	// 1. 实例化对象
	var myChart = echarts.init(document.querySelector(".map .chart"));
	// 指定图表的配置项和数据
	var option = {
		tooltip: { // 鼠标移动上去时显示数值
			trigger: 'item',
			formatter: '{b}<br/>{c}'
		},
		visualMap: { // 用于板块上色
			min: 0, // 上色的最低值
			max: 500, // 上色的最高值
			text: ['重度', '轻微'], // 左下角图示的文字
			textStyle: {
				color: '#ffffff'
			},
			realtime: false,
			calculable: true,
			inRane: {
				color: ['#C1232B', '#FCCE10'] // 上色的颜色，由低到高渐变
			}

		},
		series: [{
			name: '可吸入颗粒物',
			type: 'map',
			map: 'china',
			label: {
				show: true
			},
			data: [],
			itemStyle: {
				normal: {
					areaColor: '#323c48',
					borderColor: '#111'
				},
				emphasis: { //鼠标移入高亮显颜色
					areaColor: '#ff3333'
				}
			}

		}]
	};
	// 3. 配置项和数据给我们的实例化对象
	myChart.setOption(option);


	myChart.on('click', function(params) {

		selected = params.data.name;
		// $.getJSON(
		// 	'http://192.168.133.11:50075/webhdfs/v1/test.json?op=OPEN&namenoderpcaddress=hadoopmaster:9000&offset=0'
		// ).done(function(data) {
		// init(data);
		// sessionStorage.removeItem("key"); 
		// sessionStorage.setItem("key","selected");
		// this.chartInstance.dispatchAction({
		//   type: 'downplay', // 取消高亮指定的数据图形
		//   seriesIndex: 0
		// });
		// this.chartInstance.dispatchAction({
		//   type: 'highlight', // 高亮指定的数据图形。通过seriesName或者seriesIndex指定系列。如果要再指定某个数据可以再指定dataIndex或者name。
		//   seriesIndex: 0,
		//   name: selected
		  
		// });
		// myChart.setOption({
		// 	series[0].itemStyle[1].areaColor='#ff3333';
		// });
		
		console.log(params.color);
		params.event.target.fill = '#ff3333';

		console.log(selected);
		getData(data, selected);
		leftUp();
		// rightUp(data);
		leftDown(data);
		rightDown();

		// leftDown();
		// location.reload([bForceGet]) ;
		// console.log(data[0]);
		// });
	});
	setInterval(function() {

		//刷新数据
		myChart.setOption({

			series: [{
				data: res
			}]
		});
	}, 500);


	// 4. 当我们浏览器缩放的时候，图表也等比例缩放
	window.addEventListener("resize", function() {
		// 让我们的图表调用 resize这个方法
		myChart.resize();
	});
}
