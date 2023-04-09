import fs from 'fs'
import open from 'open'
import path from 'path'
import * as R from 'ramda'
import * as vscode from 'vscode'
import { CompletionItem, Position, TextDocument } from 'vscode'
import { 获得当前输入字段, 获得文档补全项, 获得系统补全项 } from './lib/扩展/vsc扩展'
import { 包含中文, 计算字符串模式和分组 } from './lib/扩展/字符串扩展'
import { 获得输入法补全项 } from './lib/扩展/网络输入法'
import { 上下文, 创建上下文 } from './lib/模型/上下文'
import { 字典组拼写转换 } from './lib/模型/拼写转换'
import { 查询字典组_限制层数 } from './lib/模型/本地输入法'
import { 查询配置 } from './lib/模型/配置'
import { 查询锁, 设置锁 } from './lib/模型/锁'

// 程序运行中的上下文.
var 上下文: 上下文
var 配置: ReturnType<typeof 查询配置>

async function 完成项提供者(document: TextDocument, position: Position) {
  // 必要变量
  var 补全项: CompletionItem[] = []
  var 输入字段 = await 获得当前输入字段()
  var { 模式, 分组 } = 计算字符串模式和分组(输入字段)

  // 这里获得的`输入字段`是当前这个词, 而不是输入的那个字符.
  // 例如, 在已有的字母`n`后面输入`i`, `输入字段`会是`ni`而不是`i`.
  // 如果输入是中文, 例如, 光标放到字符`n`后面, 然后在输入法中输入`nihao`的时候并不会触发补全, 当按空格把`你好`打上来的时候才会触发补全, 此时`输入字段`是`n你好`.
  // 如果在一个词中间或前面输入, 例如光标在`nihao`的`i`和`h`中间, 或在`n`前面, 此时无论输入中文还是字符, 都不会触发补全.
  // 这个插件的工作原理是:
  // - 通过`输入字段`获得一系列中文, 具体的方法在后面讨论.
  // - 将这些中文封装为补全项, 并设置几个重要的属性:
  //   - filterText: 用来判断这个补全项是否会出现在提示框中, 如果此属性的开头和当前正在输入的词一致, 则此补全项会出现在提示框中.
  //     - 这里的`正在输入的词`的计算方式和`输入字段`的计算方法一致.
  //   - sortText: 若此补全项出现在提示框中, 此属性决定排序, 此属性和输入字段可以完全无关.
  //   - label: 若此补全项出现在提示框中, 此属性是显示在提示框中的具体内容.
  //   - insertText: 若选择此补全项, 此属性决定实际插入的内容.
  // - 返回结果
  // ===============
  // 上文中说的`通过输入字段获得中文`的方法有以下几种:
  // - vsc提供的api
  // - 当前文件分词
  // - 本地字典输入法
  // - 网络输入法
  // - ...以后可能会有更多
  // ===============
  // 需要考虑不同的`输入字段`在这几种情况中的行为:
  // - `输入字段`是纯字母的情况:
  //   - vsc提供的api: 原样获得
  //   - 当前文件分词: 简单的获得当前所有分词, 不参考`输入字段`
  //   - 本地字典输入法: 直接使用字母计算结果
  //   - 网络输入法: 直接使用字母计算结果
  //   - filterText: 将汉字按`拼写字典`转换为拼写
  //   - sortText: todo: 没想好
  //   - label: 汉字
  //   - insertText: 汉字
  // - `输入字段`是纯中文的情况:
  //   - vsc提供的api: 原样获得
  //   - 当前文件分词: 简单的获得当前所有分词, 不参考`输入字段`
  //   - 本地字典输入法: 跳过 todo: 应该参考本地输入法词典的, 因为里面有一些词组, 可以做到联想的效果, 但下阶段再实现吧, 也可以作为一个单独的过程实现
  //   - 网络输入法: 跳过
  //   - filterText: 将汉字按`拼写字典`转换为拼写
  //   - sortText: todo: 没想好
  //   - label: 汉字
  //   - insertText: 汉字
  // - `输入字段`是中文+字母的情况:
  //   - vsc提供的api: 原样获得, 但将开头为`输入字段`中文部分的词的这部分删掉, 因为中文部分会在最后补上
  //   - 当前文件分词: 简单的获得当前所有分词, 不参考`输入字段`, 但将开头为`输入字段`中文部分的词的这部分删掉, 因为中文部分会在最后补上
  //   - 本地字典输入法, 以下部分加起来:
  //     - 将中文部分按`拼写字典`转换为拼写, 然后加上字母部分, 调用`输入法字典`, 然后选择开头和中文部分一样的项, 并把这些项开头的中文部分删掉, 因为中文部分会在最后补上
  //     - 删去中文部分, 直接以字母部分调用`输入法字典`
  //   - 网络输入法:
  //     - 删去中文部分, 直接以字母部分调用`输入法字典`
  //     - 不像本地输入法一样反推中文是因为调用量会很大, 对网络请求来说会很卡
  //   - filterText: 中文部分 + 将汉字按`拼写字典`转换为拼写
  //   - sortText: todo: 没想好
  //   - label: 汉字
  //   - insertText: 中文部分 + 汉字
  // - `输入字段`是字母+中文的情况:
  //   - vsc提供的api: 原样获得
  //   - 当前文件分词: 简单的获得当前所有分词, 不参考`输入字段`
  //   - 本地字典输入法: 跳过 todo: 应该将字母部分删去, 然后调用本地输入法词典的, 因为里面有一些词组, 可以做到联想的效果, 但下阶段再实现吧, 也可以作为一个单独的过程实现
  //   - 网络输入法: 跳过
  //   - filterText: 将汉字按`拼写字典`转换为拼写
  //   - sortText: todo: 没想好
  //   - label: 汉字
  //   - insertText: 汉字
  // - `输入字段`是中英文混合的情况
  //   - vsc提供的api: 原样获得
  //   - 当前文件分词: 简单的获得当前所有分词, 不参考`输入字段`
  //   - 本地字典输入法: todo: 暂时跳过, 比较复杂
  //   - 网络输入法: todo: 暂时跳过, 比较复杂
  //   - filterText: 将汉字按`拼写字典`转换为拼写
  //   - sortText: todo: 没想好
  //   - label: 汉字
  //   - insertText: 汉字

  // 如果是不需要补全的语言, 则直接跳过
  if (配置.禁用补全的语言.includes('.' + document.languageId)) return []

  // 调用'获得系统补全项'时会调用'完成项提供者'函数, 这会导致无限循环.
  // 这里判断, 如果是无限循环的场景, 就直接返回空数组.
  if (查询锁(上下文.递归锁) == true) return []

  // 使用vsc补全项
  // 命令`executeCompletionItemProvider`的结果在各语言中不同:
  // - 对于js, ts等语言, `executeCompletionItemProvider`会返回所有关键词, 不管这个词是否和输入有关.
  // - 对于c, c++, python等语言, 取决于插件实现, 通常`executeCompletionItemProvider`不会返回所有关键词, 只会返回和输入相关的关键词.
  if (配置.使用vsc补全项 == 'yes') {
    上下文.递归锁 = 设置锁(上下文.递归锁, true)
    var 补全项提供器 = await 获得系统补全项(document.uri, position)
    上下文.递归锁 = 设置锁(上下文.递归锁, false)
    if (模式.length == 2 && 模式[0] == '中文' && 模式[1] == '非中文') {
      补全项提供器.items.forEach((a) => {
        if (typeof a.label == 'string') {
          a.label = a.label.replace(new RegExp('^' + 分组[0]), '')
        } else {
          a.label.label = a.label.label.replace(new RegExp('^' + 分组[0]), '')
        }
      })
    }
    补全项 = 补全项.concat(补全项提供器.items)
  }

  // 当前文件分词
  if (配置.使用当前文件分词 == 'yes') {
    var 文档字段补全项 = 获得文档补全项(document)
    if (模式.length == 2 && 模式[0] == '中文' && 模式[1] == '非中文') {
      文档字段补全项 = 文档字段补全项.map((a) => a.replace(new RegExp('^' + 分组[0]), ''))
    }
    补全项 = 补全项.concat(文档字段补全项.map((a) => new vscode.CompletionItem(a, vscode.CompletionItemKind.Text)))
  }

  // 本地输入法
  if (配置.使用本地输入法 == 'yes') {
    if (模式.length == 1 && 模式[0] == '非中文') {
      var 本地输入法结果 = 查询字典组_限制层数(上下文.输入法字典, 输入字段, 上下文.本地输入法字典深度)
      补全项 = 补全项.concat(
        本地输入法结果
          .slice(0, 上下文.本地输入法候选字数量)
          .map((a) => new vscode.CompletionItem(a, vscode.CompletionItemKind.Text)),
      )
    } else if (模式.length == 2 && 模式[0] == '中文' && 模式[1] == '非中文') {
      var 结果1: string[] = []
      var 组合 = 字典组拼写转换(上下文.拼写字典, 分组[0]).map((a) => a + 分组[1])
      for (var x of 组合) {
        var c = 查询字典组_限制层数(上下文.输入法字典, x, 上下文.本地输入法字典深度)
        结果1 = [...结果1, ...c]
      }
      结果1 = 结果1.filter((a) => a.indexOf(分组[0]) == 0).map((a) => a.replace(new RegExp('^' + 分组[0]), ''))

      var 结果2 = 查询字典组_限制层数(上下文.输入法字典, 分组[1], 上下文.本地输入法字典深度)

      var 本地输入法结果 = [...结果1, ...结果2].slice(0, 上下文.本地输入法候选字数量)
      补全项 = 补全项.concat(本地输入法结果.map((a) => new vscode.CompletionItem(a, vscode.CompletionItemKind.Text)))
    }
  }

  // 网络输入法
  if (配置.网络输入法 == 'Baidu Sugrec' || 配置.网络输入法 == 'Google Pinyin') {
    var 输入法补全项: string[] = []

    try {
      if (模式.length == 1 && 模式[0] == '非中文') {
        输入法补全项 = await 获得输入法补全项(配置.网络输入法, 输入字段, 配置.网络输入法代理)
      } else if (模式.length == 2 && 模式[0] == '中文' && 模式[1] == '非中文') {
        输入法补全项 = await 获得输入法补全项(配置.网络输入法, 分组[1], 配置.网络输入法代理)
      }
    } catch (e) {
      console.error(e)
      vscode.window.showInformationMessage(`调用 ${配置.网络输入法} 输入法接口出错：` + e)
      输入法补全项 = []
    }

    补全项 = 补全项.concat(输入法补全项.map((a) => new vscode.CompletionItem(a, vscode.CompletionItemKind.Text)))
  }

  // 做以下处理:
  // - 去重.
  // - 过滤不包含中文的补全项.
  // - 过滤现在正在输入的字段.
  // - 过滤自定义的片段(Snippet), 因为无论这个函数是否返回结果, vsc总会带上它们.
  补全项 = R.uniqWith((a, b) => a.label == b.label, 补全项)
    .filter((a) => 包含中文(a.label.toString()))
    .filter((a) => a.label != 输入字段)
    .filter((a) => a.kind != vscode.CompletionItemKind.Snippet)

  // 设置最终结果
  for (var a of 补全项) {
    var 所有拼写 = 字典组拼写转换(上下文.拼写字典, a.label.toString())

    // `所有拼写`里包括多音字, 比如对"多重"而言, 会返回['duochong', 'duozhong'].
    // 如果分别把两个结果都包装成补全项, 就会出现重复的结果.
    // 如果将其包装成一个结果, 使用'duochong,duozhong'作为提示词, 当用户输入'duo'的时候没问题, 用户输入'duoz'的时候, 因为vscode的机制,结果也能出来.

    a.filterText = 所有拼写.join(',') + a.label
    a.insertText = a.label.toString()
    if (模式.length == 2 && 模式[0] == '中文' && 模式[1] == '非中文') {
      a.filterText = 分组[0] + a.filterText
      a.insertText = 分组[0] + a.insertText
    }

    // todo: 排序要怎么排还没想好
  }

  return new vscode.CompletionList(补全项, true)
}

export async function activate(context: vscode.ExtensionContext) {
  var packageObj = JSON.parse((await fs.promises.readFile(path.resolve(__dirname, '../package.json'))).toString())
  var 插件版本 = packageObj.version
  console.log('中文代码快速补全: 插件已启动, 版本: %s', 插件版本)

  // 读取之前的版本, 弹出升级提示
  var 显示提示 = false
  var 之前的版本: string | undefined = context.globalState.get('ChineseInputAssistant_versions')
  if (之前的版本 == undefined) {
    显示提示 = true
  } else {
    var [一级, 二级, 三级] = 之前的版本.split('.').map((a) => parseInt(a))
    if (一级 < 1 && 二级 < 5) {
      显示提示 = true
    }
  }
  if (显示提示) {
    vscode.window
      .showInformationMessage(
        '本插件进行了一次大更新, 使用方法与之前有很大不同, 请阅读文档了解如何使用.',
        '立即查看',
        '不再显示',
      )
      .then((a) => {
        if (a == '立即查看') {
          open(
            'https://gitee.com/Program-in-Chinese/vscode_Chinese_Input_Assistant/blob/master/%E6%96%87%E6%A1%A3/1.4%E5%88%B01.5%E7%89%88%E6%9C%AC%E8%BF%81%E7%A7%BB%E8%AF%B4%E6%98%8E.md',
          )
        }
        context.globalState.update('ChineseInputAssistant_versions', 插件版本)
      })
  }

  // 初始化配置
  上下文 = await 创建上下文()
  配置 = 查询配置(上下文.配置)

  // 当配置修改时刷新配置
  vscode.workspace.onDidChangeConfiguration(async () => {
    上下文 = await 创建上下文()
    配置 = 查询配置(上下文.配置)
    console.log('中文代码快速补全: 配置已刷新')
  })

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { scheme: 'file', language: '*' },
      { provideCompletionItems: 完成项提供者, resolveCompletionItem: () => null },
      ...配置.触发补全的字符,
    ),
  )
}

export function deactivate() {}
