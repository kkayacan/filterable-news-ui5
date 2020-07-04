# filterable-news-ui5
OpenUI5 frontend for [filterable-news-api](https://github.com/kkayacan/filterable-news-api). Feel free to report bugs, suggest features and contribute.

A live version with Turkish news can be found at [haber.keremkayacan.com](https://haber.keremkayacan.com)

## Setup
1. [Optional] Build project with either [SAP Web IDE](https://developers.sap.com/topics/sap-webide.html) or [ui5-builder](https://github.com/SAP/ui5-builder)
2. Move all of the content inside webapp folder (or dist folder, in case built) to your document root
3. Copy model/constants.default.json to model/constants.json
4. Edit model/constants.json and enter your api url
5. [If your server supports php] To enable Open Graph meta tags, delete index.html or rename it to something else and rename dynamic-index.php to index.php
6. [For branding] Replace title tag in index.html (or index.php), image files favicon.ico, img/logo.png, img/home-precomposed.png