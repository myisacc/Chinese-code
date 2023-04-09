import { HTTP请求 } from './http'

async function 百度联想(字符串: string, 数量: number, 代理地址: string | null): Promise<string[]> {
  if (!字符串.trim()) return []
  var url = `https://www.baidu.com/sugrec?prod=pc&from=pc_web&wd=${字符串}`
  var res = await HTTP请求('GET', encodeURI(url), 代理地址, {})
  var r = JSON.parse(res)
  if (r.g == null) return []
  r = r.g.map((a: any) => a.q).filter((a: any, i: any) => i < 数量)
  return r
}

async function 谷歌输入法(字符串: string, 数量: number, 代理地址: string | null): Promise<string[]> {
  if (字符串.indexOf('\r') != -1 || 字符串.indexOf('\n') != -1) return []
  var url = `http://inputtools.google.com/request?text=${字符串}&itc=zh-t-i0-pinyin&num=${数量}&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`
  var res = await HTTP请求('POST', encodeURI(url), 代理地址, {})
  var r = JSON.parse(res)
  return r[1][0][1]
}

export async function 获得输入法补全项(
  输入法: 'no' | 'Google Pinyin' | 'Baidu Sugrec',
  内容: string,
  代理地址: string,
) {
  var 输入法对象 = null
  var 候选词数量 = 5

  if (输入法 == 'Baidu Sugrec') 输入法对象 = 百度联想
  else if (输入法 == 'Google Pinyin') 输入法对象 = 谷歌输入法
  else return []

  var 输入法提供的词 = await 输入法对象(内容, 候选词数量, 代理地址)
  return 输入法提供的词
}
