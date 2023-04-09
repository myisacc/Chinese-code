var fs = require('fs')
var path = require('path')
import * as R from 'ramda'

// 为了避免歧义, 长的必须放前面
function 构造映射表(a: { 全拼值: string; 双拼值: string }[]) {
  var c = [
    { 全拼值: ' ang', 双拼值: 'xh' },
    { 全拼值: ' eng', 双拼值: 'xt' },
    { 全拼值: '\tang', 双拼值: 'xh' },
    { 全拼值: '\teng', 双拼值: 'xt' },

    { 全拼值: ' ei', 双拼值: 'xw' },
    { 全拼值: ' en', 双拼值: 'xn' },
    { 全拼值: ' er', 双拼值: 'xm' },
    { 全拼值: ' ou', 双拼值: 'xs' },
    { 全拼值: ' ai', 双拼值: 'xf' },
    { 全拼值: ' an', 双拼值: 'xe' },
    { 全拼值: ' ao', 双拼值: 'xz' },
    { 全拼值: '\tei', 双拼值: 'xw' },
    { 全拼值: '\ten', 双拼值: 'xn' },
    { 全拼值: '\ter', 双拼值: 'xm' },
    { 全拼值: '\tou', 双拼值: 'xs' },
    { 全拼值: '\tai', 双拼值: 'xf' },
    { 全拼值: '\tan', 双拼值: 'xe' },
    { 全拼值: '\tao', 双拼值: 'xz' },

    { 全拼值: ' a', 双拼值: 'xp' },
    { 全拼值: ' e', 双拼值: 'xj' },
    { 全拼值: ' o', 双拼值: 'xl' },
    { 全拼值: '\ta', 双拼值: 'xp' },
    { 全拼值: '\te', 双拼值: 'xj' },
    { 全拼值: '\to', 双拼值: 'xl' },

    { 全拼值: 'iong', 双拼值: 'y' },
    { 全拼值: 'iang', 双拼值: 'x' },
    { 全拼值: 'uang', 双拼值: 'x' },

    { 全拼值: 'uan', 双拼值: 'r' },
    { 全拼值: 'eng', 双拼值: 't' },
    { 全拼值: 'ong', 双拼值: 'y' },
    { 全拼值: 'iao', 双拼值: 'q' },
    { 全拼值: 'uai', 双拼值: 'd' },
    { 全拼值: 'ian', 双拼值: 'd' },
    { 全拼值: 'ing', 双拼值: 'g' },
    { 全拼值: 'ang', 双拼值: 'h' },

    ...a,
    { 全拼值: 'sh', 双拼值: 'e' },
    { 全拼值: 'ei', 双拼值: 'w' },
    { 全拼值: 'un', 双拼值: 'w' },
    { 全拼值: 'an', 双拼值: 'e' },
    { 全拼值: 'ia', 双拼值: 'p' },
    { 全拼值: 'ou', 双拼值: 's' },
    { 全拼值: 'iu', 双拼值: 's' },
    { 全拼值: 'ai', 双拼值: 'f' },
    { 全拼值: 'ue', 双拼值: 'f' },
    { 全拼值: 'uo', 双拼值: 'l' },
    { 全拼值: 'ao', 双拼值: 'z' },
    { 全拼值: 'ie', 双拼值: 'c' },
    { 全拼值: 'ua', 双拼值: 'c' },
    { 全拼值: 'in', 双拼值: 'b' },
    { 全拼值: 'ui', 双拼值: 'b' },
    { 全拼值: 'en', 双拼值: 'n' },
    { 全拼值: 'er', 双拼值: 'm' },

    { 全拼值: 'e', 双拼值: 'j' },
    { 全拼值: 'a', 双拼值: 'p' },
    { 全拼值: 'i', 双拼值: 'k' },
    { 全拼值: 'v', 双拼值: 'l' },
    { 全拼值: 'o', 双拼值: 'l' },
    { 全拼值: 'u', 双拼值: 'm' },
  ]
  return c
}

var 映射表1 = 构造映射表([
  { 全拼值: 'zh', 双拼值: 'q' },
  { 全拼值: 'ch', 双拼值: 'w' },
])

var 映射表2 = 构造映射表([
  { 全拼值: 'zh', 双拼值: 'f' },
  { 全拼值: 'ch', 双拼值: 'j' },
])

var 源名称 = 'pinyin_simp.dict.txt'
var 目标名称 = 'xiaohe.dict.txt'

function 主过程(映射表: { 全拼值: string; 双拼值: string }[]) {
  var 源文本: string[] = fs
    .readFileSync(path.resolve(__dirname, '../../字典/', 源名称))
    .toString()
    .replace(/\r/g, '')
    .split('\n')

  type 替换指令类型 = { 开始位置: number; 长度: number; 替换为: string }
  var 替换指令们 = 源文本.map((a: string) => {
    var c: Record<string, 替换指令类型> = 映射表
      .map((b) => {
        var 位置 = 0
        var 结果: 替换指令类型[] = []
        while (1) {
          var 开始位置 = a.indexOf(b.全拼值, 位置)
          if (开始位置 == -1) return 结果

          if (b.全拼值[0] == ' ' || b.全拼值[0] == '\t') {
            结果.push({ 开始位置: 开始位置 + 1, 长度: b.全拼值.length - 1, 替换为: b.双拼值 })
          } else {
            结果.push({ 开始位置, 长度: b.全拼值.length, 替换为: b.双拼值 })
          }
          位置 = 开始位置 + 1
        }
      })
      .flat()
      .reduce((s, a) => {
        if (a == null) throw new Error('意外的空值')

        for (var n of Object.keys(s)) {
          var obj = s[n]
          if (a.开始位置 >= obj.开始位置 && a.开始位置 < obj.开始位置 + obj.长度) return s
        }

        return s[a.开始位置] ? s : { ...s, [a.开始位置]: { 开始位置: a.开始位置, 长度: a.长度, 替换为: a.替换为 } }
      }, {})
    var d = Object.values(c)
    return d
  })

  // console.log(替换指令们)

  var 替换后 = 源文本.map((a, i) => {
    var 指令 = 替换指令们[i]
    if (指令.length == 0) return a

    var 累计值 = a.split('')
    var 累计偏移 = 0
    for (var c of 指令) {
      // console.log('替换前', 累计值.join(''))
      累计值.splice(c.开始位置 - 累计偏移, c.长度, ...c.替换为.split(''))
      // console.log('替换后', 累计值.join(''))
      累计偏移 += c.长度 - c.替换为.length
    }

    return 累计值.join('')
  })

  return 替换后
}

var 结果1 = 主过程(映射表1)
var 结果2 = 主过程(映射表2)

var 最终结果 = R.uniq([...结果1, ...结果2])

fs.writeFileSync(path.resolve(__dirname, '../../字典/', 目标名称), 最终结果.join('\n'))
