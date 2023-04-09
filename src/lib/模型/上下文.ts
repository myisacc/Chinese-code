import { 创建字典, 字典 } from './本地输入法'
import { 创建配置, 查询配置, 配置 } from './配置'
import { 创建锁, 锁 } from './锁'
import fs from 'fs'
import path from 'path'
import { 字典拼写转换 } from './拼写转换'

export type 上下文 = {
  配置: 配置
  递归锁: 锁
  输入法字典: 字典[]
  readonly 本地输入法字典深度: number
  readonly 本地输入法候选字数量: number
  拼写字典: 字典拼写转换[]
}

export async function 创建上下文(): Promise<上下文> {
  var 配置 = 创建配置()
  var 锁 = 创建锁(false)
  var 使用的输入法字典: 字典[] = []
  var 使用的拼写字典: 字典拼写转换[] = []

  var 输入法字典配置 = 查询配置(配置).本地输入法字典
  for (var 字典路径 of 输入法字典配置) {
    if (!fs.existsSync(字典路径)) {
      字典路径 = path.resolve(__dirname, '../字典/', 字典路径)
    }
    var c = await 创建字典(字典路径)
    使用的输入法字典.push(c)
  }

  var 拼写字典配置 = 查询配置(配置).拼写字典
  for (var 字典路径 of 拼写字典配置) {
    if (!fs.existsSync(字典路径)) {
      字典路径 = path.resolve(__dirname, '../字典/', 字典路径)
    }
    var c2 = await 字典拼写转换(字典路径)
    使用的拼写字典.push(c2)
  }

  return {
    配置: 配置,
    递归锁: 锁,
    输入法字典: 使用的输入法字典,
    本地输入法字典深度: 5,
    本地输入法候选字数量: 5,
    拼写字典: 使用的拼写字典,
  }
}
