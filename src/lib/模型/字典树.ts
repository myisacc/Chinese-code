class 树节点 {
  public 当前字符: string | null
  public 是结尾字符: boolean
  public 子节点: { [key: string]: 树节点 }

  constructor(key: string | null) {
    this.当前字符 = key
    this.是结尾字符 = false
    this.子节点 = {}
  }

  枚举所有串(深度: number = 0, 当前深度 = 0): string[] {
    if (深度 != 0 && 当前深度 >= 深度) {
      return []
    }

    if (this.当前字符 == null) throw new Error('当前节点为空')

    var 子节点key = Object.keys(this.子节点)

    if (this.是结尾字符 && 子节点key.length == 0) {
      return [this.当前字符]
    }

    if (!this.是结尾字符 && 子节点key.length == 0) {
      throw new Error('非结尾字符必须有子节点')
    }

    var 后续 = 子节点key.map((a) => this.子节点[a].枚举所有串(深度, 当前深度 + 1)).flat()

    if (this.是结尾字符 && 子节点key.length != 0) {
      return [this.当前字符, ...后续.map((a) => this.当前字符 + a)]
    }

    if (!this.是结尾字符 && 子节点key.length != 0) {
      return 后续.map((a) => this.当前字符 + a)
    }

    throw new Error('意外的枚举分支')
  }
}

export class 字典树 {
  private root: 树节点

  constructor() {
    this.root = new 树节点(null)
  }

  插入(word: string): void {
    var node = this.root
    for (var i = 0; i < word.length; i++) {
      var char = word[i]
      if (!node.子节点[char]) {
        node.子节点[char] = new 树节点(char)
      }
      node = node.子节点[char]
      if (i == word.length - 1) {
        node.是结尾字符 = true
      }
    }
  }

  搜索(word: string, 深度: number = 0): string[] {
    var node = this.root
    var 累计: string[] = []
    for (var i = 0; i < word.length; i++) {
      var char = word[i]
      if (!node.子节点[char]) return []
      累计.push(char)
      node = node.子节点[char]
    }

    var 累计串 = 累计.join('')
    var 累计串减1 = 累计串.substring(0, 累计串.length - 1)
    return node.枚举所有串(深度).map((a) => 累计串减1 + a)
  }
}

export function 创建字典树() {
  return new 字典树()
}
export function 插入字典树(t: 字典树, s: string) {
  t.插入(s)
}
export function 查询字典树(t: 字典树, s: string) {
  return t.搜索(s)
}
export function 查询字典树_限制深度(t: 字典树, s: string, 深度: number) {
  return t.搜索(s, 深度)
}
