var ticking = false
var vm = {
  rows: ko.observableArray([]),
  headtransform: ko.observable('translateX(0)'),
  scrollTop: ko.observable(0),
  handleScroll: function (vm, e) {
    if (window.requestAnimationFrame) {
      if (!ticking) {
        requestAnimationFrame(realFunc);
        ticking = true;
      }
    } else {
      realFunc()
    }

  },
  isRowVisible: function (row, index) {
    debugger
    return true
  }
}
function realFunc () {
  var scrollLeft = document.getElementById('content').scrollLeft
  var scrollTop = document.getElementById('content').scrollTop
  vm.scrollTop(scrollTop)
  vm.headtransform("translateX(-" + scrollLeft + "px)")
  ticking = false
}
var rowHeight = 53
var tableHeight = 468
// 可是区域的行数
var visibleRowLength = 468/rowHeight
// 头部隐藏的行数
var hideHeadRowLength = visibleRowLength * 2
// 尾部隐藏的行数
var hideFootRowLength = visibleRowLength * 1.5

function generateData (length) {
  var result = []
  for (var i = 0; i < length; i++) {
    var random = Math.random().toFixed(3)
    var _index = i
    var data = {
      name: ko.observable('mary' + random),
      age: ko.observable(100 * random),
      sex: ko.observable(random > 0.5 ? '男' : '女'),
      cell: ko.observable("18618479283"),
      address: "北京市海淀区" + random,
      _index: _index
    }
    data._isVisible = ko.computed(function () {
      var scrollTop = vm.scrollTop()
      // 2:1:1
      // 如果index高于头部隐藏行数的高度则显示
      var flag1 = this._index > Math.round(scrollTop / rowHeight) - hideHeadRowLength
      // 如果index小于尾部隐藏行数的高度则显示
      var flag2 = this._index < Math.round(scrollTop / rowHeight) + visibleRowLength + hideFootRowLength

      if (flag1 && flag2) {
        return true
      }
      else {
        return false
      }
    }, data).extend({ deferred: true });
    result.push(data)
  }
  return result
}
ko.components.register('y-test', {
  viewModel: function (params) {
    this.label = params.label
    this.click = function () {
      console.log('click')
    }
  },
  template: "<div class='tooltip' data-bind='text:label,click:click'></div>"
})
ko.applyBindings(vm, document.getElementById('app'))
var data = generateData(10000)
vm.rows(data)