const 锁: unique symbol = Symbol()

export type 锁 = {
  [锁]: boolean
}

export function 创建锁(初始值: boolean): 锁 {
  return {
    [锁]: 初始值,
  }
}
export function 设置锁(a: 锁, 新值: boolean): 锁 {
  return {
    [锁]: 新值,
  }
}
export function 查询锁(a: 锁): boolean {
  return a[锁]
}
