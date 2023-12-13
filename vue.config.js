const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    productionSourceMap: false,
    publicPath: './',
    devServer: {
        allowedHosts: [
            'zjfhome.320.io', // 允许访问的域名地址，即花生壳内网穿透的地址
        ],
    },
    css: {
        loaderOptions: {
            scss: {
                sassOptions: {
                    outputStyle: 'expanded'
                },
                // @/ 是 src/ 的别名
                // 因此这里假设你有 `src/variables.sass` 这个文件
                // 注意：在 sass-loader v7 中，这个选项名是 "data"
                prependData: `@import "~@/assets/scss/global.scss";`
            },
            postcss: {
                postcssOptions: {
                    plugins: [
                        require('postcss-pxtorem')({
                            rootValue: 16, //换算基数，
                            unitPrecision: 3, //允许REM单位增长到的十进制数字,小数点后保留的位数。
                            propList: ['*'],
                            exclude: false,  //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
                            // selectorBlackList: ['.van'], //要忽略并保留为px的选择器，本项目我是用的vant ui框架，所以忽略他
                            mediaQuery: false,  //（布尔值）允许在媒体查询中转换px。
                            minPixelValue: 1 //设置要替换的最小像素值
                        }),
                    ]
                },
            }
        },
    },
})
