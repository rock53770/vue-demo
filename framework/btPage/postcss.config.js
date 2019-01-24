module.exports={
    plugins:[
        require("autoprefixer")({browsers: ['iOS >= 8', 'Android >= 4.1']})//括号可写需要在哪个版本要自动添加前缀
    ]
}