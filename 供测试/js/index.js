// 使用 import 语法需要 `babel` 或者 `-r esm`
import lib_esm from './lib_esm'
var lib_node = require('./lib_node')
var 中文变量 = 1

function 加法() {}
function add() {}

零蛋 = 0
zero = 0

战国时代 = 1

class 小类 {}
class aClass {}

多重笛卡尔积 = 0
命中率 = 0

// 输入 lib_esm.zw
// 输入 lib_node.zw
// 输入 zw

console.log(lib_node.加法(1)(2) == lib_esm.加法(1)(2))
