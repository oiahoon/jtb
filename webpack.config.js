module.exports = {
    context: __dirname + '/app/scripts.babel/',
    entry: {
        background: './background.js', // remove unused
        chromereload: './chromereload.js',
        contentscript: './contentscript.js',
        common: './common.js',
        popup: './popup.js',
        options: './options.js',
    },
    output: { filename: '[name].js' },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader'
        }, {
            test: /\.vue$/,
            loader: 'vue-loader'
        }]
    }
}