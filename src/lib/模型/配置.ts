import * as vscode from 'vscode'

const 触发补全的字符: unique symbol = Symbol()
const 禁用补全的语言: unique symbol = Symbol()
const 拼写字典: unique symbol = Symbol()
const 使用本地输入法: unique symbol = Symbol()
const 本地输入法字典: unique symbol = Symbol()
const 使用vsc补全项: unique symbol = Symbol()
const 使用当前文件分词: unique symbol = Symbol()
const 网络输入法: unique symbol = Symbol()
const 网络输入法代理: unique symbol = Symbol()

export type 配置 = {
  [触发补全的字符]: string[]
  [禁用补全的语言]: string[]
  [拼写字典]: string[]
  [使用本地输入法]: string
  [本地输入法字典]: string[]
  [使用vsc补全项]: 'yes' | 'no'
  [使用当前文件分词]: 'yes' | 'no'
  [网络输入法]: 'no' | 'Google Pinyin' | 'Baidu Sugrec'
  [网络输入法代理]: string
}

export function 创建配置(): 配置 {
  var _触发补全的字符 = vscode.workspace.getConfiguration('ChineseInputAssistant').get('triggerChar')
  var _禁用补全的语言 = vscode.workspace.getConfiguration('ChineseInputAssistant').get('disabledLanguage')
  var _拼写字典 = vscode.workspace.getConfiguration('ChineseInputAssistant').get('spellDictionaries')
  var _使用本地输入法 = vscode.workspace.getConfiguration('ChineseInputAssistant').get('useLocInput')
  var _本地输入法字典 = vscode.workspace.getConfiguration('ChineseInputAssistant').get('InputDictionaries')
  var _使用vsc补全项 = vscode.workspace.getConfiguration('ChineseInputAssistant').get('useCompletionItem')
  var _使用当前文件分词 = vscode.workspace.getConfiguration('ChineseInputAssistant').get('useFileWord')
  var _网络输入法 = vscode.workspace.getConfiguration('ChineseInputAssistant').get('netInputMethod')
  var _网络输入法代理 = vscode.workspace.getConfiguration('ChineseInputAssistant').get('netInputMethodProxy')

  if (_触发补全的字符 == undefined) throw new Error('_触发补全的字符 为 undefined')
  if (_禁用补全的语言 == undefined) throw new Error('_禁用补全的语言 为 undefined')
  if (_拼写字典 == undefined) throw new Error('_拼写字典 为 undefined')
  if (_使用本地输入法 == undefined) throw new Error('_使用本地输入法 为 undefined')
  if (_本地输入法字典 == undefined) throw new Error('_本地输入法字典 为 undefined')
  if (_使用vsc补全项 == undefined) throw new Error('_使用vsc补全项 为 undefined')
  if (_使用当前文件分词 == undefined) throw new Error('_使用当前文件分词 为 undefined')
  if (_网络输入法 == undefined) throw new Error('_网络输入法 为 undefined')
  if (_网络输入法代理 == undefined) throw new Error('_网络输入法代理 为 undefined')

  if (!Array.isArray(_触发补全的字符) || (_触发补全的字符.length != 0 && typeof _触发补全的字符[0] != 'string'))
    throw new Error('_触发补全的字符 格式错误')
  if (!Array.isArray(_禁用补全的语言) || (_禁用补全的语言.length != 0 && typeof _禁用补全的语言[0] != 'string'))
    throw new Error('_禁用补全的语言 格式错误')
  if (!Array.isArray(_拼写字典) || (_拼写字典.length != 0 && typeof _拼写字典[0] != 'string'))
    throw new Error('_拼写字典 格式错误')
  if (typeof _使用本地输入法 != 'string' || (_使用本地输入法 != 'yes' && _使用本地输入法 != 'no'))
    throw new Error('_使用本地输入法 格式错误')
  if (!Array.isArray(_本地输入法字典) || (_本地输入法字典.length != 0 && typeof _本地输入法字典[0] != 'string'))
    throw new Error('_本地输入法字典 格式错误')
  if (typeof _使用vsc补全项 != 'string' || (_使用vsc补全项 != 'yes' && _使用vsc补全项 != 'no'))
    throw new Error('_使用vsc补全项 格式错误')
  if (typeof _使用当前文件分词 != 'string' || (_使用当前文件分词 != 'yes' && _使用当前文件分词 != 'no'))
    throw new Error('_使用当前文件分词 格式错误')
  if (
    typeof _网络输入法 != 'string' ||
    (_网络输入法 != 'no' && _网络输入法 != 'Google Pinyin' && _网络输入法 != 'Baidu Sugrec')
  )
    throw new Error('_网络输入法 格式错误')
  if (typeof _网络输入法代理 != 'string') throw new Error('_网络输入法代理 格式错误')

  return {
    [触发补全的字符]: _触发补全的字符,
    [禁用补全的语言]: _禁用补全的语言,
    [拼写字典]: _拼写字典,
    [使用本地输入法]: _使用本地输入法,
    [本地输入法字典]: _本地输入法字典,
    [使用vsc补全项]: _使用vsc补全项,
    [使用当前文件分词]: _使用当前文件分词,
    [网络输入法]: _网络输入法,
    [网络输入法代理]: _网络输入法代理,
  }
}

function 深克隆<A>(a: A): A {
  if (typeof a == 'string') return a
  if (typeof a == 'boolean') return a
  if (typeof a == 'bigint') return a
  if (typeof a == 'number') return a
  return JSON.parse(JSON.stringify(a))
}

export function 查询配置(配置: 配置) {
  return {
    触发补全的字符: 深克隆(配置[触发补全的字符]),
    禁用补全的语言: 深克隆(配置[禁用补全的语言]),
    拼写字典: 深克隆(配置[拼写字典]),
    使用本地输入法: 深克隆(配置[使用本地输入法]),
    本地输入法字典: 深克隆(配置[本地输入法字典]),
    使用vsc补全项: 深克隆(配置[使用vsc补全项]),
    使用当前文件分词: 深克隆(配置[使用当前文件分词]),
    网络输入法: 深克隆(配置[网络输入法]),
    网络输入法代理: 深克隆(配置[网络输入法代理]),
  }
}
