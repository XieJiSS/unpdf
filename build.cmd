@echo off
echo 请在ConEmu中运行，并及时根据版本修改本脚本、install.nsi和package.json
pause
cmd /c electron-packager . un_pdf_downloader --app-version="1.6.1" --ignore="(.cmd|.nsi|license.txt|log.txt|.bat|.exe)" --app-copyright="(c) JieJiSS 2017-2018" --platform=win32 --arch=ia32 --out=".\out" --overwrite --icon=".\icon.ico" --download.mirror="https://npm.taobao.org/mirrors/electron/" --package-manager=npm --electron-version="1.7.9"
