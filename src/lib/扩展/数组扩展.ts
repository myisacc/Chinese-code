export var 多重笛卡尔积 = <T>(arr: T[][]) =>
  arr.reduce((as, bs) => as.map((a) => bs.map((b) => [...a, b])).flat(), [[] as T[]])
