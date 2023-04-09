import * as R from 'ramda'
import * as vscode from 'vscode'
import { CompletionItem, CompletionList, Position, TextDocument } from 'vscode'
import { 包含中文, 查找字段 } from './字符串扩展'

export async function 获得系统补全项(
  uri: vscode.Uri,
  position: Position,
): Promise<vscode.CompletionList<vscode.CompletionItem>> {
  var 补全项提供器 = await vscode.commands.executeCommand<CompletionList>(
    'vscode.executeCompletionItemProvider',
    uri,
    position,
  )
  return 补全项提供器
}
export function 获得当前输入字段(): Promise<string> {
  // 我们需要的是文本被编辑后而非编辑前的情况。
  // 为避免意外获得文本被编辑前的情况，加个定时器，确保函数在文本修改后执行。
  // 这样函数就变成了异步的，于是加了Promise。
  return new Promise((res, rej) => {
    setTimeout(() => {
      var 编辑器 = vscode.window.activeTextEditor
      if (!编辑器) return res('')

      var 光标位置 = 编辑器.selections[0].anchor
      var 文件 = 编辑器.document
      var 范围 = 文件.getWordRangeAtPosition(光标位置)

      if (范围 == null) return res('')

      var 当前输入字段 = 文件.getText(范围)
      return res(当前输入字段)
    }, 0)
  })
}
export function 获得文件后缀名(document: TextDocument): string {
  var c = R.last(document.fileName.split('.'))
  return c || ''
}
export function 获得文档内容(document: TextDocument): string {
  return document.getText()
}
export function 获得文档补全项(document: vscode.TextDocument): string[] {
  var 文档字段 = R.compose(R.filter(包含中文), 查找字段)(获得文档内容(document))
  return 文档字段
}
