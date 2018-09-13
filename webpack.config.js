const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //提取css

module.exports = env => {

    if(!env) env = {};

    let isProcution = env.production;
    let plugins = [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Demo',
            template: './src/views/index.html'
        })
        
    ]
    if (isProcution) {
        plugins.push(
            new  webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: 'production'
                }
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash:8].css'
            })
        );
    }
    return {
        mode: 'none',
        entry: [
            './src/js/viewport.js',
            './src/js/main.js',
        ],
        optimization: { // 提取commonjs
            splitChunks: {
                cacheGroups: {
                    commons: {
                        name: 'commons',
                        chunks: 'initial',
                        minChunks: 2
                    }
                }
            }
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            // clientLogLevel: 'none', //是否输出日志
            open:true,
            // hot: true,
            // profile: true, // 是否捕获构建性信息
            port: 9001
        },
        devtool: isProcution ? 'source-map': '', //方便调试
        module: {
            rules: [{
                test: /\.html$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: ['html-loader']
            },{
                test: /\.vue$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: [
                    'vue-loader'
                ]
            },{
                enforce: 'pre',
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }, {
                test: /\.scss$/,
                oneOf: [{
                    resourceQuery: /module/,
                    use: [
                        'vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[local]_[hash:base64:5]'
                            }
                        }, {
                            loader: 'px2rem-loader',
                            options: {
                                remUnit: 40,
                                remPrecision: 8
                            }
                        },
                        'sass-loader'
                    ]
                }, {
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'px2rem-loader',
                            options: {
                                remUnit: 40,
                                remPrecision: 8
                            }
                        },
                        'sass-loader'
                    ]
                }],
            }, {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                         // 自定义生成的类名
                            localIdentName: '[local]_[hash:base64:8]'
                        }
                    }
                ],
                exclude: path.resolve(__dirname,'node_modules')
            }, {
                test: /\.styl(us)?$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: [
                    env.production ? MiniCssExtractPlugin.loader :'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            // 自定义生成的类名
                            localIdentName: '[local]_[hash:base64:8]'
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 40,
                            remPrecision: 8
                        }
                    },
                    'stylus-loader'
                ]
            },
                {
                    test: /\.(png|jpg|gif|jpe?g|eot|woff|ttf|svg|pdf)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192
                            }
                        }
                    ]
                }
            ]
        },
        plugins,
        resolve: {
            extensions: [
                '.js', '.vue', '.json'
            ], // 省去后缀
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@':'/src'
            } //使用完整版vue
        },
        output: {
            filename: '[name].[hash:8].js',
            path: path.resolve(__dirname, 'dist')
        }

    }
}