; 该脚本使用 HM VNISEdit 脚本编辑器向导产生

; 安装程序初始定义常量
!define PRODUCT_NAME "UN PDF Downloader"
!define PRODUCT_VERSION "1.3.2"
!define PRODUCT_PUBLISHER "JieJiSS"
!define PRODUCT_WEB_SITE "http://jiejiss.xyz/unpdf"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\un_pdf_downloader.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"
!define PRODUCT_STARTMENU_REGVAL "NSIS:StartMenuDir"

SetCompressor /SOLID lzma
SetCompressorDictSize 32

; ------ MUI 现代界面定义 (1.67 版本以上兼容) ------
!include "MUI.nsh"

; MUI 预定义常量
!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

; 语言选择窗口常量设置
!define MUI_LANGDLL_REGISTRY_ROOT "${PRODUCT_UNINST_ROOT_KEY}"
!define MUI_LANGDLL_REGISTRY_KEY "${PRODUCT_UNINST_KEY}"
!define MUI_LANGDLL_REGISTRY_VALUENAME "NSIS:Language"

; 欢迎页面
!insertmacro MUI_PAGE_WELCOME
; 许可协议页面
!define MUI_LICENSEPAGE_CHECKBOX
!insertmacro MUI_PAGE_LICENSE "license.txt"
; 安装目录选择页面
!insertmacro MUI_PAGE_DIRECTORY
; 开始菜单设置页面
var ICONS_GROUP
!define MUI_STARTMENUPAGE_NODISABLE
!define MUI_STARTMENUPAGE_DEFAULTFOLDER "UN PDF Downloader"
!define MUI_STARTMENUPAGE_REGISTRY_ROOT "${PRODUCT_UNINST_ROOT_KEY}"
!define MUI_STARTMENUPAGE_REGISTRY_KEY "${PRODUCT_UNINST_KEY}"
!define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "${PRODUCT_STARTMENU_REGVAL}"
!insertmacro MUI_PAGE_STARTMENU Application $ICONS_GROUP
; 安装过程页面
!insertmacro MUI_PAGE_INSTFILES
; 安装完成页面
!define MUI_FINISHPAGE_RUN "$INSTDIR\un_pdf_downloader.exe"
!insertmacro MUI_PAGE_FINISH

; 安装卸载过程页面
!insertmacro MUI_UNPAGE_INSTFILES

; 安装界面包含的语言设置
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "SimpChinese"

; 安装预释放文件
!insertmacro MUI_RESERVEFILE_LANGDLL
!insertmacro MUI_RESERVEFILE_INSTALLOPTIONS
; ------ MUI 现代界面定义结束 ------

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "unpdf_ver_setup.exe"
InstallDir "$PROGRAMFILES\UN PDF Downloader"
InstallDirRegKey HKLM "${PRODUCT_UNINST_KEY}" "UninstallString"
ShowInstDetails show
ShowUnInstDetails show
BrandingText "UN PDF Downloader"

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  SetOverwrite on
  File "out\un_pdf_downloader-win32-ia32\un_pdf_downloader.exe"

; 创建开始菜单快捷方式
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
  CreateDirectory "$SMPROGRAMS\$ICONS_GROUP"
  CreateShortCut "$SMPROGRAMS\$ICONS_GROUP\UN PDF Downloader.lnk" "$INSTDIR\un_pdf_downloader.exe"
  CreateShortCut "$DESKTOP\UN PDF Downloader.lnk" "$INSTDIR\un_pdf_downloader.exe"
  !insertmacro MUI_STARTMENU_WRITE_END
SectionEnd

Section "Resources" SEC02
  SetOutPath "$INSTDIR\resources"
  SetOverwrite on
  File "out\un_pdf_downloader-win32-ia32\resources\electron.asar"
  File "out\un_pdf_downloader-win32-ia32\resources\app.asar"

; 创建开始菜单快捷方式
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
  !insertmacro MUI_STARTMENU_WRITE_END
SectionEnd

Section "Files" SEC03
  SetOutPath "$INSTDIR"
  SetOverwrite on
  File "out\un_pdf_downloader-win32-ia32\views_resources_200_percent.pak"
  File "out\un_pdf_downloader-win32-ia32\version"
  File "out\un_pdf_downloader-win32-ia32\vcruntime140.dll"
  File "out\un_pdf_downloader-win32-ia32\ui_resources_200_percent.pak"
  File "out\un_pdf_downloader-win32-ia32\ucrtbase.dll"
  File "out\un_pdf_downloader-win32-ia32\snapshot_blob.bin"
  File "out\un_pdf_downloader-win32-ia32\pdf_viewer_resources.pak"
  File "out\un_pdf_downloader-win32-ia32\node.dll"
  File "out\un_pdf_downloader-win32-ia32\natives_blob.bin"
  File "out\un_pdf_downloader-win32-ia32\msvcp140.dll"
  File "out\un_pdf_downloader-win32-ia32\LICENSES.chromium.html"
  File "out\un_pdf_downloader-win32-ia32\LICENSE"
  File "out\un_pdf_downloader-win32-ia32\libGLESv2.dll"
  File "out\un_pdf_downloader-win32-ia32\libEGL.dll"
  File "out\un_pdf_downloader-win32-ia32\icudtl.dat"
  File "out\un_pdf_downloader-win32-ia32\ffmpeg.dll"
  File "out\un_pdf_downloader-win32-ia32\d3dcompiler_47.dll"
  File "out\un_pdf_downloader-win32-ia32\content_shell.pak"
  File "out\un_pdf_downloader-win32-ia32\content_resources_200_percent.pak"
  File "out\un_pdf_downloader-win32-ia32\blink_image_resources_200_percent.pak"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-utility-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-time-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-string-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-stdio-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-runtime-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-process-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-private-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-multibyte-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-math-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-locale-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-heap-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-filesystem-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-environment-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-convert-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-crt-conio-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-util-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-timezone-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-sysinfo-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-synch-l1-2-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-synch-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-string-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-rtlsupport-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-profile-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-processthreads-l1-1-1.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-processthreads-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-processenvironment-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-namedpipe-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-memory-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-localization-l1-2-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-libraryloader-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-interlocked-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-heap-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-handle-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-file-l2-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-file-l1-2-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-file-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-errorhandling-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-debug-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-datetime-l1-1-0.dll"
  File "out\un_pdf_downloader-win32-ia32\api-ms-win-core-console-l1-1-0.dll"

; 创建开始菜单快捷方式
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
  !insertmacro MUI_STARTMENU_WRITE_END
SectionEnd

Section "i18n" SEC04
  SetOutPath "$INSTDIR\locales"
  SetOverwrite on
  File "out\un_pdf_downloader-win32-ia32\locales\zh-TW.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\zh-CN.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\vi.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\uk.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\tr.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\th.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\te.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\ta.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\sw.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\sv.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\sr.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\sl.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\sk.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\ru.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\ro.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\pt-PT.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\pt-BR.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\pl.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\nl.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\nb.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\ms.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\mr.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\ml.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\lv.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\lt.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\ko.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\kn.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\ja.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\it.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\id.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\hu.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\hr.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\hi.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\he.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\gu.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\fr.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\fil.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\fi.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\fake-bidi.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\fa.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\et.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\es-419.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\es.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\en-US.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\en-GB.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\el.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\de.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\da.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\cs.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\ca.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\bn.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\bg.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\ar.pak"
  File "out\un_pdf_downloader-win32-ia32\locales\am.pak"

; 创建开始菜单快捷方式
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
  !insertmacro MUI_STARTMENU_WRITE_END
SectionEnd

Section -AdditionalIcons
  SetOutPath $INSTDIR
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
  CreateShortCut "$SMPROGRAMS\$ICONS_GROUP\Uninstall.lnk" "$INSTDIR\uninst.exe"
  !insertmacro MUI_STARTMENU_WRITE_END
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\un_pdf_downloader.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\un_pdf_downloader.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
SectionEnd

#-- 根据 NSIS 脚本编辑规则，所有 Function 区段必须放置在 Section 区段之后编写，以避免安装程序出现未可预知的问题。--#

Function .onInit
  !insertmacro MUI_LANGDLL_DISPLAY
FunctionEnd

/******************************
 *  以下是安装程序的卸载部分  *
 ******************************/

Section Uninstall
  !insertmacro MUI_STARTMENU_GETFOLDER "Application" $ICONS_GROUP
  Delete "$INSTDIR\uninst.exe"
  Delete "$INSTDIR\locales\am.pak"
  Delete "$INSTDIR\locales\ar.pak"
  Delete "$INSTDIR\locales\bg.pak"
  Delete "$INSTDIR\locales\bn.pak"
  Delete "$INSTDIR\locales\ca.pak"
  Delete "$INSTDIR\locales\cs.pak"
  Delete "$INSTDIR\locales\da.pak"
  Delete "$INSTDIR\locales\de.pak"
  Delete "$INSTDIR\locales\el.pak"
  Delete "$INSTDIR\locales\en-GB.pak"
  Delete "$INSTDIR\locales\en-US.pak"
  Delete "$INSTDIR\locales\es.pak"
  Delete "$INSTDIR\locales\es-419.pak"
  Delete "$INSTDIR\locales\et.pak"
  Delete "$INSTDIR\locales\fa.pak"
  Delete "$INSTDIR\locales\fake-bidi.pak"
  Delete "$INSTDIR\locales\fi.pak"
  Delete "$INSTDIR\locales\fil.pak"
  Delete "$INSTDIR\locales\fr.pak"
  Delete "$INSTDIR\locales\gu.pak"
  Delete "$INSTDIR\locales\he.pak"
  Delete "$INSTDIR\locales\hi.pak"
  Delete "$INSTDIR\locales\hr.pak"
  Delete "$INSTDIR\locales\hu.pak"
  Delete "$INSTDIR\locales\id.pak"
  Delete "$INSTDIR\locales\it.pak"
  Delete "$INSTDIR\locales\ja.pak"
  Delete "$INSTDIR\locales\kn.pak"
  Delete "$INSTDIR\locales\ko.pak"
  Delete "$INSTDIR\locales\lt.pak"
  Delete "$INSTDIR\locales\lv.pak"
  Delete "$INSTDIR\locales\ml.pak"
  Delete "$INSTDIR\locales\mr.pak"
  Delete "$INSTDIR\locales\ms.pak"
  Delete "$INSTDIR\locales\nb.pak"
  Delete "$INSTDIR\locales\nl.pak"
  Delete "$INSTDIR\locales\pl.pak"
  Delete "$INSTDIR\locales\pt-BR.pak"
  Delete "$INSTDIR\locales\pt-PT.pak"
  Delete "$INSTDIR\locales\ro.pak"
  Delete "$INSTDIR\locales\ru.pak"
  Delete "$INSTDIR\locales\sk.pak"
  Delete "$INSTDIR\locales\sl.pak"
  Delete "$INSTDIR\locales\sr.pak"
  Delete "$INSTDIR\locales\sv.pak"
  Delete "$INSTDIR\locales\sw.pak"
  Delete "$INSTDIR\locales\ta.pak"
  Delete "$INSTDIR\locales\te.pak"
  Delete "$INSTDIR\locales\th.pak"
  Delete "$INSTDIR\locales\tr.pak"
  Delete "$INSTDIR\locales\uk.pak"
  Delete "$INSTDIR\locales\vi.pak"
  Delete "$INSTDIR\locales\zh-CN.pak"
  Delete "$INSTDIR\locales\zh-TW.pak"
  Delete "$INSTDIR\api-ms-win-core-console-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-datetime-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-debug-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-errorhandling-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-file-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-file-l1-2-0.dll"
  Delete "$INSTDIR\api-ms-win-core-file-l2-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-handle-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-heap-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-interlocked-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-libraryloader-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-localization-l1-2-0.dll"
  Delete "$INSTDIR\api-ms-win-core-memory-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-namedpipe-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-processenvironment-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-processthreads-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-processthreads-l1-1-1.dll"
  Delete "$INSTDIR\api-ms-win-core-profile-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-rtlsupport-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-string-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-synch-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-synch-l1-2-0.dll"
  Delete "$INSTDIR\api-ms-win-core-sysinfo-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-timezone-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-core-util-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-conio-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-convert-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-environment-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-filesystem-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-heap-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-locale-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-math-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-multibyte-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-private-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-process-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-runtime-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-stdio-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-string-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-time-l1-1-0.dll"
  Delete "$INSTDIR\api-ms-win-crt-utility-l1-1-0.dll"
  Delete "$INSTDIR\blink_image_resources_200_percent.pak"
  Delete "$INSTDIR\content_resources_200_percent.pak"
  Delete "$INSTDIR\content_shell.pak"
  Delete "$INSTDIR\d3dcompiler_47.dll"
  Delete "$INSTDIR\ffmpeg.dll"
  Delete "$INSTDIR\icudtl.dat"
  Delete "$INSTDIR\libEGL.dll"
  Delete "$INSTDIR\libGLESv2.dll"
  Delete "$INSTDIR\LICENSE"
  Delete "$INSTDIR\LICENSES.chromium.html"
  Delete "$INSTDIR\msvcp140.dll"
  Delete "$INSTDIR\natives_blob.bin"
  Delete "$INSTDIR\node.dll"
  Delete "$INSTDIR\pdf_viewer_resources.pak"
  Delete "$INSTDIR\snapshot_blob.bin"
  Delete "$INSTDIR\ucrtbase.dll"
  Delete "$INSTDIR\ui_resources_200_percent.pak"
  Delete "$INSTDIR\vcruntime140.dll"
  Delete "$INSTDIR\version"
  Delete "$INSTDIR\views_resources_200_percent.pak"
  Delete "$INSTDIR\resources\app.asar"
  Delete "$INSTDIR\resources\electron.asar"
  Delete "$INSTDIR\un_pdf_downloader.exe"

  Delete "$SMPROGRAMS\$ICONS_GROUP\Uninstall.lnk"
  Delete "$DESKTOP\UN PDF Downloader.lnk"
  Delete "$SMPROGRAMS\$ICONS_GROUP\UN PDF Downloader.lnk"

  RMDir "$SMPROGRAMS\$ICONS_GROUP"
  RMDir "$INSTDIR\resources"
  RMDir "$INSTDIR\locales"

  RMDir "$INSTDIR"

  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  SetAutoClose true
SectionEnd

#-- 根据 NSIS 脚本编辑规则，所有 Function 区段必须放置在 Section 区段之后编写，以避免安装程序出现未可预知的问题。--#

Function un.onInit
!insertmacro MUI_UNGETLANGUAGE
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "您确实要完全移除 $(^Name) ，及其所有的组件？" IDYES +2
  Abort
FunctionEnd

Function un.onUninstSuccess
  HideWindow
  MessageBox MB_ICONINFORMATION|MB_OK "$(^Name) 已成功地从您的计算机移除。"
FunctionEnd
