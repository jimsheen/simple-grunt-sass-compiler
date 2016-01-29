// get the module name from the directory name


module.exports = {
    // old dev 
    dev: {
        options: {
            // cssmin will minify later
            style: 'expanded'
        },
        files: {
            '../newCss/css/main.css': '../newCss/sass/main.scss',
        }
    }
}
