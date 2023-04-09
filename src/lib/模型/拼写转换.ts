import fs from 'fs'
import { 多重笛卡尔积 } from '../扩展/数组扩展'

const 映射表: unique symbol = Symbol()
export type 字典拼写转换 = {
  [映射表]: Record<string, string[]>
}

export async function 字典拼写转换(路径: string): Promise<字典拼写转换> {
  var 字典文本 = ''
  if (路径 != '') 字典文本 = (await fs.promises.readFile(路径)).toString()

  var 字典对象: Record<string, string[]> = {}
  字典文本
    .split('\n')
    .map((a) => a.trim())
    .forEach((v) => {
      if (!/.+\t.+/.test(v)) return
      let [中文, 拼音] = v.split('\t')
      let 处理后拼音 = 拼音
        .split(' ')
        .map((v) => (v.length > 0 ? v[0].toLocaleUpperCase() + v.substring(1) : v))
        .join('')
      if (字典对象[中文] == null) {
        字典对象[中文] = [处理后拼音]
      } else {
        字典对象[中文].push(处理后拼音)
      }
    })

  return {
    [映射表]: 字典对象,
  }
}
export function 查询拼写转换(a: 字典拼写转换, 汉字: string): string[] {
  var r: string[] = []
  var arr = 汉字.split('')
  for (var x of arr) {
    if (a[映射表][x]) {
      if (r.length == 0) r = a[映射表][x]
      else r = 多重笛卡尔积([r, a[映射表][x]]).map((a) => a.join(''))
    }
  }
  return r
}
export function 字典组拼写转换(a: 字典拼写转换[], 汉字: string): string[] {
  var r: string[] = []
  for (var x of a) {
    var c = 查询拼写转换(x, 汉字)
    r = [...r, ...c]
  }
  return r
}
