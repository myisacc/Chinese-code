import fs from 'fs'
import { 创建字典树, 字典树, 插入字典树, 查询字典树, 查询字典树_限制深度 } from './字典树'

const 字典树符号: unique symbol = Symbol()
const 字典: unique symbol = Symbol()
export type 字典 = {
  [字典树符号]: 字典树
  [字典]: Record<string, string[]>
}

export async function 创建字典(路径: string): Promise<字典> {
  var 字典文本 = ''
  if (路径 != '') 字典文本 = (await fs.promises.readFile(路径)).toString()

  var 字典树对象 = 创建字典树()
  var 字典对象: Record<string, string[]> = {}
  字典文本
    .split('\n')
    .map((a) => a.trim())
    .forEach((v) => {
      if (!/.+\t.+/.test(v)) return
      let [中文, 拼音] = v.split('\t')
      let 处理后拼音 = 拼音.split(' ').join('')
      插入字典树(字典树对象, 处理后拼音)
      if (字典对象[处理后拼音] == null) {
        字典对象[处理后拼音] = [中文]
      } else {
        字典对象[处理后拼音].push(中文)
      }
    })

  return {
    [字典树符号]: 字典树对象,
    [字典]: 字典对象,
  }
}

export function 查询字典(a: 字典, 拼写: string): string[] {
  var c = 查询字典树(a[字典树符号], 拼写)
  if (c.length == 0) return []
  return c.map((x) => a[字典][x]).flat()
}
export function 查询字典_限制层数(a: 字典, 拼写: string, 最大层数: number): string[] {
  var c = 查询字典树_限制深度(a[字典树符号], 拼写, 最大层数)
  if (c.length == 0) return []
  return c.map((x) => a[字典][x]).flat()
}
export function 查询字典组_限制层数(a: 字典[], 拼写: string, 最大层数: number): string[] {
  var r: string[] = []
  for (var x of a) {
    var c = 查询字典_限制层数(x, 拼写, 最大层数)
    r = [...r, ...c]
  }
  return r
}
