@echo off
echo 修改版本时请同时修改install.nsi和package.json
pause
cd ..
cmd /c electron-packager . un_pdf_downloader --app-version="1.6.3" --ignore="(.cmd|.nsi|license.txt|log.txt|.bat|.exe|.git/|build/)" --app-copyright="(c) Pan Ruizhe 2017-2019" --platform=win32 --arch=ia32 --out=".\out" --overwrite --icon=".\build\icon\icon.ico" --download.mirror="https://npm.taobao.org/mirrors/electron/" --package-manager=npm --electron-version="1.8.2"
