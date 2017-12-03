/**
 * 自定义过滤器
 */
import Vue from 'vue'

/**
 * 制保留2位小数
 * 例如：2，会在2后面补上00.即2.00
 */
Vue.filter('toDecimal2', x => {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
});

/**
 * 获取两位小数部分
 * 例如：11.05，返回 '05'
 * 如果是整数，返回 '00'
 */
Vue.filter('getDecimalPart', x => {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s.split(".")[1];
});

/**
 * 金额格式化
 * fmtMonty(2,'.', ',')后两个可省略
 */
Vue.filter('fmtMoney', (number, decimals, dec_point, thousnds_stp) => {
  /*
   * 参数说明：
   * number：要格式化的数字
   * decimals：保留几位小数
   * dec_point：小数点符号
   * thousands_sep：千分位符号
   * */
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousnds_stp === 'undefined') ? ',' : thousnds_stp,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.ceil(n * k) / k;
    }
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);

});

/**
 * 名字，身份证，银行卡，隐藏部分数字变‘*’号
 * plusXing(前面保留位数，后面保留位数）
 */
Vue.filter('plusXing', (str, frontLen, endLen) => {
  var len = str.length - frontLen - endLen;
  var xing = '';
  for (var i = 0; i < len; i++) {
    xing += '*';
  }
  return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
});

/**
 * 银行卡号四个数字分割
 */
Vue.filter('formartCode', n => {
  var b = parseInt(n).toString();
  var len = n.length;
  if (len <= 4) {
    return n;
  } else {
    var r = len % 4;
    return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{4}/g).join(",") : b.slice(r, len).match(/\d{4}/g).join(" ");
  }
});

/**
 * 借款、还款完成过滤
 */
Vue.filter('complateState', n => {
  switch (n) {
    case 0:
      return '借款';
    case 1:
      return '还款';
    case 2:
      return '逾期记录'
  }
});

/**
 * 借款状态过滤器
 */
Vue.filter('borrowStateFilter', function (data) {
  switch (data) {
    case 'SETTING':
      return "审核中";
    case 'FAIL':
      return "放款失败";
    case 'NORM':
      return "使用中";
    case 'OVER':
      return "已逾期";
    case 'DELQ':
      return "已逾期";
    case 'OFFED':
      return "核销";
    case 'CLSDB':
      return "关闭";
    case 'SETL':
      return "已结清"
  }
});

/**
 * 还款状态过滤器
 */
Vue.filter('repaymentStateFilter', function (data) {
  switch (data) {
    case '00':
      return "还款成功";
    case '01':
      return "还款失败";
    case '02':
      return "还款中";
  }
});

/**
 * 银行小图标
 */
Vue.filter('bankLogoUrl', function (data) {
  var imgUrl = "static/img/";
  switch (data) {
    case '上海银行':
      return imgUrl + 'shbank.png';
    case '中信银行':
      return imgUrl + 'zxbank.png';
    case '中原银行':
      return imgUrl + 'zybank.jpeg';
    case '中国银行':
      return imgUrl + 'boc.png';
    case '中国建设':
      return imgUrl + 'ccb.png';
    case '交通银行':
      return imgUrl + 'jtbank.png';
    case '光大银行':
      return imgUrl + 'gdbank.png';
    case '兴业银行':
      return imgUrl + 'xybank.png';
    case '农业银行':
      return imgUrl + 'abc.png';
    case '工商银行':
      return imgUrl + 'icbc.png';
    case '平安银行':
      return imgUrl + 'pabank.png';
    case '广发银行':
      return imgUrl + 'gfbank.png';
    case '建设银行':
      return imgUrl + 'ccb.png';
    case '招商银行':
      return imgUrl + 'cmb.png';
    case '民生银行':
      return imgUrl + 'msbank.png';
    case '浦东发展':
      return imgUrl + 'pdbank.png';
    case '邮储银行':
      return imgUrl + 'ycbank.png';
    case '邮政储蓄':
      return imgUrl + 'ycbank.png';
  }
});

/**
 * (利息等的)费率
 */
Vue.filter('rate', function (data) {
  if (data) {
    data = data.toString();
    console.log(data);
    var intS = data.substring(0, data.indexOf('.')) + data.substring(data.indexOf('.') + 1, data.indexOf('.') + 3);
    var floatS = data.substring(data.indexOf('.') + 3, data.indexOf('.') + 7);
    while (floatS.length < 4) {
      floatS = floatS + '0';
    }
    return parseInt(intS) + '.' + floatS + '%';
  }
  return '';
});

/**
 * 时间过滤
 * fmtDate('yyyy,MM,dd')
 */
Vue.filter('fmtDate', (date, fmt) => {
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt;
  }
);

/**
 * 时间过滤
 * date:'yyyy-MM-dd'
 */
Vue.filter('fmtDateStr', (date) => {
  if(!date) return '';
  var temp = date.split(" ")[0].split("-");
  return temp.join("/");
});
Vue.filter('fmtDateStr2', (date) => {
  if(!date) return '';
  var temp = date.split(" ")[0].split("-");
  return temp[0] + "年" + temp[1] + "月" + temp[2] + "日";
});
Vue.filter('fmtTimeStr', (date) => {
  if(!date) return '';
  var temp = date.split(" ")[0].split("-");
  return temp.join("/") + " " + date.split(" ")[1];
});
Vue.filter('fmtTimeStr2', (date) => {
  if(!date) return '';
  var temp = date.split(" ")[0].split("-");
  return temp[0] + "年" + temp[1] + "月" + temp[2] + "日" + " " + date.split(" ")[1];
});

/**
 * 当前日期过滤器
 * new Date() --> ××年××月××日
 */
Vue.filter('fmtCurrentDate', (date) => {
  return date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日';
});

/**
 * 当前时间过滤器
 * new Date() --> ××:××
 */
Vue.filter('fmtCurrentTime', (date) => {
  var minutes;
  if(date.getMinutes() < 10){
    minutes = '0' + date.getMinutes();
  }else{
    minutes = date.getMinutes();
  }
  return date.getHours() + ':' + minutes;
});

/**
 * 格式化时间为年、月、日、小时、分钟、刚刚
 */
Vue.filter('fmtDate2', (time) => {
  let oldDate = new Date(time)
  let newDate = new Date()
  var dayNum = "";
  var getTime = (newDate.getTime() - oldDate.getTime())/1000;

  if(getTime < 60*5){
    dayNum = "刚刚";
  }else if(getTime >= 60*5 && getTime < 60*60){
    dayNum = parseInt(getTime / 60) + "分钟前";
  }else if(getTime >= 3600 && getTime < 3600*24){
    dayNum = parseInt(getTime / 3600) + "小时前";
  }else if(getTime >= 3600 * 24 && getTime < 3600 * 24 * 30){
    dayNum = parseInt(getTime / 3600 / 24 ) + "天前";
  }else if(getTime >= 3600 * 24 * 30 && getTime < 3600 * 24 * 30 * 12){
    dayNum = parseInt(getTime / 3600 / 24 / 30 ) + "个月前";
  }else if(time >= 3600 * 24 * 30 * 12){
    dayNum = parseInt(getTime / 3600 / 24 / 30 / 12 ) + "年前";
  }

  // 位数为1,补全0
  function addZero(val){
    if(val < 10){
      val = '0' + String(val);
    }
    return val;
  }

  let year   = oldDate.getFullYear();
  let month  = oldDate.getMonth()+1;
  let day    = oldDate.getDate();
  let hour   = oldDate.getHours();
  let minute = oldDate.getMinutes();
  let second = oldDate.getSeconds();

  month = addZero(month);
  day = addZero(day);
  hour = addZero(hour);
  minute = addZero(minute);
  second = addZero(second);

  return dayNum+" "+year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
});
