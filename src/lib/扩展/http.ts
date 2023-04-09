import request from 'request'

export function HTTP请求(
  请求类型: 'POST' | 'GET',
  地址: string,
  代理地址: string | null,
  参数: Record<string, unknown>,
): Promise<any> {
  return new Promise((pres, rej) => {
    request(
      {
        proxy: 代理地址,
        url: 地址,
        method: 请求类型,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(参数),
      },
      (err, res, body) => {
        if (err) return rej(err)
        pres(body)
      },
    )
  })
}
