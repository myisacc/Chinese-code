-- https://github.com/program-in-chinese/overview/blob/master/示例代码/Haskell示例.hs

右折叠 :: Foldable 可折叠 => (甲 -> 乙 -> 乙) -> 乙 -> 可折叠 甲 -> 乙
右折叠 = foldr

-- | 乘法
乘 :: Num 数值 => 数值 -> 数值 -> 数值
乘 = (*)

-- | 阶乘
阶乘 :: Int -> Int
阶乘 数 = 右折叠 乘 1 [ 1 .. 数 ]

main :: IO ()
main = do
  let 输出 = print
  in 输出 $ 阶乘 5
