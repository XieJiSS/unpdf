@echo off
echo ����ConEmu�����У�����ʱ���ݰ汾�޸ı��ű���install.nsi��package.json
pause
cmd /c electron-packager . un_pdf_downloader --app-version="1.6.3" --ignore="(.cmd|.nsi|license.txt|log.txt|.bat|.exe|.git/)" --app-copyright="(c) Pan Ruizhe 2017-2018" --platform=win32 --arch=ia32 --out=".\out" --overwrite --icon=".\icon\icon.ico" --download.mirror="https://npm.taobao.org/mirrors/electron/" --package-manager=npm --electron-version="1.8.2"
