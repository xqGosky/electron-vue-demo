import Vue from 'vue'
var reqwest = require('reqwest')
var SUCCESS_CODE = 100
const vueItem = new Vue()

common = {
  ajax,
  loading,
  postcall,
  getQueryString,
  getReqId,
  sum
}

/**
 * 网络请求
 * param* url {string}
 * param* params {object}
 * param* success {func}
 * param error {func}
 * param method {string}
 * param contentType {string}
 */
function ajax (option) {
  var temp = {
    req_id: getReqId('req'),
    device: 'casher',
    timestamp: getReqId(),
    v: 'v1.0',
    sign: 'test'
  }
  var url = option.url
  var params = JSON.stringify({...option.params, ...temp}) || {}
  var success = option.success
  var error = option.error || null
  var method = option.method || 'post'
  var noloading = option.noloading || false
  var contentType = option.contentType || 'application/json'
  if (!noloading) {
    vueItem.commonLoading = vueItem.$loading({
      lock: true,
      text: '努力加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.5)'
    })
  }
  reqwest({
    url: url,
    method: method,
    data: params,
    contentType: contentType,
    type: 'json',
    success: function (data) {
      vueItem.commonLoading.close()
      success(data)
    },
    error: function (err) {
      if (err.status == 504) {
        vueItem.$alert('服务器状态异常,请联系技术人员', '提示', {
          confirmButtonText: '确定'
        })
      }
      console.log(err)
      vueItem.commonLoading.close()
      if (error) {
        error(err)
      } else {
        console.log('错误')
        // console.log(err.response);
        // var errres = err.response;
        // alert(JSON.parse(errres).detail || JSON.parse(errres).results.message || '未知错误');
        // if (errres.code == '30001') {
        //     common.notify('请登录')
        // } else {
        //     common.notify(errres.detail)
        // }
      }
    }
  })
}

/*
* 扫码枪
* */

window.onload = function (e) {
  document.onkeydown = (e) => {
    let nextCode, nextTime = ''
    let lastTime = this.lastTime
    let code = this.code
    if (window.event) { // IE
      nextCode = e.keyCode
    } else if (e.which) { // Netscape/Firefox/Opera
      nextCode = e.which
    }
    nextTime = new Date().getTime()
    // 字母上方 数字键0-9 对应键码值 48-57; 数字键盘 数字键0-9 对应键码值 96-105
    if ((nextCode >= 48 && nextCode <= 57) || (nextCode >= 96 && nextCode <= 105)) {
      let codes = {
        '48': 48,
        '49': 49,
        '50': 50,
        '51': 51,
        '52': 52,
        '53': 53,
        '54': 54,
        '55': 55,
        '56': 56,
        '57': 57,
        '96': 48,
        '97': 49,
        '98': 50,
        '99': 51,
        '100': 52,
        '101': 53,
        '102': 54,
        '103': 55,
        '104': 56,
        '105': 57
      }
      nextCode = codes[nextCode]
      nextTime = new Date().getTime()
    }
    // 第二次输入延迟两秒，删除之前的数据重新计算
    if (nextTime && lastTime && nextTime - lastTime > 2000) {
      code = String.fromCharCode(nextCode)
    } else {
      code += String.fromCharCode(nextCode)
    }
    // 保存数据
    this.nextCode = nextCode
    this.lastTime = nextTime
    this.code = code
    // 键入Enter
    if (e.which == 13) {
      // 判断 code 长度（这里就获取到条码值了，以下业务自由发挥）
      code = $.trim(code)
      if (code.length == 13) {
        console.log('A类条码:' + code)
      } else if (code.length == 23) {
        console.log('B类条码:' + code)
      } else if (code.length == 0) {
        console.log('请输入条码')
      } else {
        console.log('条码不合法：' + code)
      }
      // 键入回车务必清空code值6935136600777

      this.code = ''
      return false
    }
  }
}

/**
 *
 *
 *计算商品总价
 * @param arr 每个商品单价 * 数量的价格数组
 * @returns {number}
 */
function sum (arr) {
  var s = 0
  for (var i = arr.length - 1; i >= 0; i--) {
    s += arr[i]
  }
  return s
}

/**
 *
 * 每次请求获取req_id  时间戳
 * @returns {string}
 */

function getReqId (type) {
  if (type == 'req') {
    return (
      (new Date()).getTime().toFixed(0)
    )
  } else {
    return (
      parseInt((new Date()).getTime() / 1000).toFixed(0)
    )
  }
}

/**
 * purpose：common.loading(type)为界面添加遮罩层，Loading动画
 * notice:  type只有"addLoading"和"removeLoading"可选 依赖loaders.css
 * @params：type  String  Required "addLoading" 添加Loading动画
 * @params：type  String  Required "removeLoading" 移除Loading动画
 */
function loading (type) {
  var temp =
    '<main id="loading">' +
    '<div class="loading">' +
    '<div class="loader-inner ball-spin-fade-loader">' +
    '<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>' +
    '</div>' +
    '</div>' +
    '</main>'
  if (type == 'addLoading') {
    $(document.body).prepend(temp)
    $(document.body).css({
      'overflow': 'hidden'
    })
  }
  if (type == 'removeLoading') {
    if ($('#loading')) {
      $(document.body).removeAttr('style')
      $(document.body).find('#loading').remove()
      $(document.body).removeClass('overflow')
    }
  }
}

// 表单模拟post提交
function postcall (url, params, target) {
  var tempform = document.createElement('form')
  tempform.action = url
  tempform.method = 'post'
  tempform.style.display = 'none'
  if (target) {
    tempform.target = target
  }

  for (var x in params) {
    var opt = document.createElement('input')
    opt.name = x
    opt.value = params[x]
    tempform.appendChild(opt)
  }

  var opt = document.createElement('input')
  opt.type = 'submit'
  tempform.appendChild(opt)
  document.body.appendChild(tempform)
  tempform.submit()
  document.body.removeChild(tempform)
}

/**
 * 获取url参数
 */
function getQueryString (link) {
  var obj = {}
  // console.log(link.substr(link.indexOf("?")));
  var url = link.substr(link.indexOf('?'))
  // console.log(url);
  if (url.indexOf('?') != -1) {
    var str = url.substr(1)
    var strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      obj[strs[i].split('=')[0]] = (strs[i].split('=')[1])
    }
    return obj
  }
};
