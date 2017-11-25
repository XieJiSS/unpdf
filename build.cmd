@echo off
echo 请在ConEmu中运行，并及时根据版本修改install.nsi
pause
cmd /c electron-packager . un_pdf_downloader --app-version="1.3.2" --ignore="(build.cmd|pack.cmd|clean.cmd|install.nsi|license.txt|make.bat)" --app-copyright="(c) JieJiSS 2017" --platform=win32 --arch=ia32 --out=".\out" --overwrite --icon=".\icon.ico" --download.mirror="https://npm.taobao.org/mirrors/electron/" --package-manager=npm --electron-version="1.7.9"
