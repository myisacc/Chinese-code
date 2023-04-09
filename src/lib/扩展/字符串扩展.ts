export var 转换为大写 = (字符串: string) => 字符串.toLocaleUpperCase()
export var 包含中文 = function 包含中文(str: string) {
  return /[\u4e00-\u9fa5\u3007]/.test(str)
}
export var 是纯字母 = function 是纯字母(str: string) {
  return /[A-Za-z]/.test(str)
}
export var 标识符模式 =
  /(-?\d*\.\d\w*)|([^\`\~\!\@\^\&\*\(\)\-\#\?\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s？。，、；：？…—·ˉˇ¨“”～〃｜《》〔〕（），]+)/g
export var 查找字段 = function 查找字段(s: string) {
  var wordPattern = 标识符模式
  return Array.from(new Set(s.match(wordPattern)))
}
export function 首字母大写(拼音: string): string {
  if (拼音.length > 0) {
    var first = 拼音[0].toUpperCase()
    var spare = 拼音.substring(1, 拼音.length + 1)
    return first + spare
  } else {
    return 拼音
  }
}

export type 模式项 = '中文' | '非中文'
export function 计算字符串模式和分组(s: string): { 模式: 模式项[]; 分组: string[] } {
  var arr = s.split('')
  var 当前模式: '中文' | '非中文' | null = null

  var 模式: 模式项[] = []
  var 分组: string[] = []

  for (var i = 0; i < arr.length; i++) {
    var v = arr[i]
    if (包含中文(v)) {
      if (当前模式 != '中文') {
        模式.push('中文')
        分组.push('')
      }
      当前模式 = '中文'
    } else {
      if (当前模式 != '非中文') {
        模式.push('非中文')
        分组.push('')
      }
      当前模式 = '非中文'
    }
    分组[分组.length - 1] += v
  }

  return { 模式, 分组 }
}
