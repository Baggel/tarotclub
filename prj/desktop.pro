# TarotClub project file
#
# TarotClub ( http://www.tarotclub.fr ) - This file is part of TarotClub
# Copyright (C) 2003-2999 - Anthony Rabine
# anthony@tarotclub.fr
#
# TarotClub is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# TarotClub is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with TarotClub.  If not, see <http://www.gnu.org/licenses/>.
#

# ------------------------------------------------------------------------------
# Directories for generated files and base directory
# ------------------------------------------------------------------------------
BASE_DIR = $${PWD}/..

CONFIG(debug, debug|release) {
debug:      DESTDIR = $$BASE_DIR/build-desktop/debug
}

CONFIG(release, debug|release) {
release:    DESTDIR = $$BASE_DIR/build-desktop/release
}

UI_DIR          = $$DESTDIR/ui
UI_HEADERS_DIR  = $$DESTDIR/include
UI_SOURCES_DIR  = $$DESTDIR/src
OBJECTS_DIR     = $$DESTDIR/obj
RCC_DIR         = $$DESTDIR/rcc
MOC_DIR         = $$DESTDIR/moc

# ------------------------------------------------------------------------------
# The search path to find supplied files
# ------------------------------------------------------------------------------
VPATH += $$BASE_DIR/src
VPATH += $$BASE_DIR/src/library
VPATH += $$BASE_DIR/src/desktop
VPATH += $$BASE_DIR/src/desktop/windows
VPATH += $$BASE_DIR/src/desktop/docks
VPATH += $$BASE_DIR/src/desktop/forms
VPATH += $$BASE_DIR/src/jsengine
VPATH += $$BASE_DIR/src/json
VPATH += $$BASE_DIR/src/gfxlib
VPATH += $$BASE_DIR/lib
VPATH += $$BASE_DIR/assets/ai
VPATH += $$BASE_DIR/assets/ai/tarotlib

# ------------------------------------------------------------------------------
# Where to find header files
# ------------------------------------------------------------------------------
INCLUDEPATH += $$BASE_DIR/src
INCLUDEPATH += $$BASE_DIR/src/library
INCLUDEPATH += $$BASE_DIR/src/desktop
INCLUDEPATH += $$BASE_DIR/src/desktop/windows
INCLUDEPATH += $$BASE_DIR/src/desktop/docks
INCLUDEPATH += $$BASE_DIR/src/desktop/forms
INCLUDEPATH += $$BASE_DIR/src/jsengine
INCLUDEPATH += $$BASE_DIR/src/json
INCLUDEPATH += $$BASE_DIR/src/gfxlib

# ------------------------------------------------------------------------------
# Compiler definitions
# ------------------------------------------------------------------------------
QT += svg network qml quickwidgets
RESOURCES = $$BASE_DIR/assets/desktop.qrc
CONFIG += qt warn_on
QMAKE_CXXFLAGS += -std=c++11

# Mainly for Duktape, the only source code in C
QMAKE_CFLAGS_DEBUG      += -O0 -pedantic -std=c99 -fstrict-aliasing -ggdb
QMAKE_CFLAGS_RELEASE    += -Os -pedantic -std=c99 -fstrict-aliasing -fomit-frame-pointer

# ------------------------------------------------------------------------------
# Target definitions
# ------------------------------------------------------------------------------
TARGET = TarotClub # name of the output executable

# Specific OS stuff
win32 {
    RC_FILE = desktop/icon.rc
    LIBS +=  libws2_32 -lpsapi
    DEFINES += USE_WINDOWS_OS
    # Let's make everything's static so that we don't need any DLL
    QMAKE_LFLAGS += -static-libgcc -static-libstdc++ -static -lpthread
}

unix {
    DEFINES += USE_UNIX_OS
}

CONFIG(debug, debug|release) {
    DEFINES += TAROT_DEBUG
    DEFINES += DUK_OPT_DEBUG

unix {
    QMAKE_CXXFLAGS  +=-fsanitize=address -fno-omit-frame-pointer
    QMAKE_CFLAGS    +=-fsanitize=address -fno-omit-frame-pointer
    QMAKE_LFLAGS    +=-fsanitize=address
}
# DUK_OPT_DEBUG DUK_OPT_DDDEBUG DUK_OPT_DDEBUG

}


# Duktape defines
DEFINES += DUK_OPT_NO_JX
DEFINES += DUK_OPT_NO_JC

# ------------------------------------------------------------------------------
# JavaScript files
# ------------------------------------------------------------------------------
OTHER_FILES = beginner.js \
              system.js \
              card.js \
              util.js \
              deck.js \
              game.js \
              player.js \
              bot.js \
              unit_test.js

# ------------------------------------------------------------------------------
# Translation files
# ------------------------------------------------------------------------------
TRANSLATIONS = $$BASE_DIR/prj/desktop/tarotclub_fr.ts

# ------------------------------------------------------------------------------
# Library files
# ------------------------------------------------------------------------------
HEADERS += Log.h \
    Observer.h \
    Util.h \
    ThreadQueue.h \
    ByteStreamReader.h \
    ByteStreamWriter.h \
    ByteArray.h \
    TcpSocket.h \
    TcpServer.h \
    TcpClient.h \
    UniqueId.h \
    System.h \
    Value.h

SOURCES += Log.cpp \
    Util.cpp \
    ByteArray.cpp \
    ByteStreamReader.cpp \
    ByteStreamWriter.cpp \
    TcpSocket.cpp \
    TcpServer.cpp \
    TcpClient.cpp \
    UniqueId.cpp \
    System.cpp \
    Value.cpp

# ------------------------------------------------------------------------------
# JSEngine and JSON files
# ------------------------------------------------------------------------------

HEADERS += duktape.h \
    JsonWriter.h \
    JsonReader.h \
    JSEngine.h \
    IScriptEngine.h \
    JsonValue.h

SOURCES += duktape.c \
    JsonWriter.cpp \
    JsonReader.cpp \
    JSEngine.cpp \
    JsonValue.cpp

# ------------------------------------------------------------------------------
# TarotClub core files
# ------------------------------------------------------------------------------
HEADERS += ServerConfig.h \
    ClientConfig.h \
    DealFile.h \
    Deck.h \
    Card.h \
    Player.h \
    Client.h \
    Bot.h \
    TarotEngine.h \
    Deal.h \
    Identity.h \
    Score.h \
    Protocol.h \
    Controller.h \
    Table.h \
    Common.h \
    Defines.h

SOURCES += ServerConfig.cpp \
    ClientConfig.cpp \
    DealFile.cpp \
    Deck.cpp \
    Card.cpp \
    Player.cpp \
    Client.cpp \
    Bot.cpp \
    TarotEngine.cpp \
    Deal.cpp \
    Protocol.cpp \
    Controller.cpp \
    Table.cpp \
    Score.cpp \
    Common.cpp

# ------------------------------------------------------------------------------
# Gfx library files
# ------------------------------------------------------------------------------
HEADERS += Canvas.h \
    TextBox.h \
    GfxCard.h \
    MenuItem.h \
    TarotWidget.h \
    PlayerBox.h \
    CustomTypes.h \
    PopupItem.h \
    CheckBoxItem.h \
    ButtonItem.h \
    MessageBoxItem.h \
    IButtonEvent.h \
    ICardEvent.h \
    Translations.h \
    MiniDeck.h

SOURCES += Canvas.cpp \
    TextBox.cpp \
    TarotWidget.cpp \
    GfxCard.cpp \
    MenuItem.cpp \
    PlayerBox.cpp \
    PopupItem.cpp \
    CheckBoxItem.cpp \
    ButtonItem.cpp \
    MessageBoxItem.cpp \
    Translations.cpp \
    MiniDeck.cpp

# ------------------------------------------------------------------------------
# Desktop client files
# ------------------------------------------------------------------------------
FORMS += AboutUI.ui \
    AvatarsUI.ui \
    InfosDockUI.ui \
    OptionsUI.ui \
    NumberedDealUI.ui \
    DealEditorUI.ui \
    QuickJoin.ui \
    LobbyUI.ui

HEADERS += AboutWindow.h \
    MainWindow.h \
    OptionsWindow.h \
    EditorWindow.h \
    ScoresDock.h \
    InfosDock.h \
    ChatDock.h \
    DebugDock.h \
    LobbyWindow.h \
    DealsWindow.h

SOURCES += AboutWindow.cpp \
    MainWindow.cpp \
    OptionsWindow.cpp \
    EditorWindow.cpp \
    ScoresDock.cpp \
    InfosDock.cpp \
    ChatDock.cpp \
    DebugDock.cpp \    
    LobbyWindow.cpp \
    DealsWindow.cpp \
    main.cpp

# End of project file
