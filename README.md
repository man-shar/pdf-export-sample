# pdfmake sample

To build fonts for vfs (run all commands from project root):

1. Remove ds store from `public/fonts`: `find ./public/fonts -name .DS_Store -delete`
2. Run: `node build-vfs.js ./public/fonts/ ./src/vfs_fonts.js`
