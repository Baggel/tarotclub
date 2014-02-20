# Test plan project file
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

# ------------------------------------------------------------------------------
# The search path to find supplied files
# ------------------------------------------------------------------------------
VPATH += $$BASE_DIR/src
VPATH += $$BASE_DIR/src/library
VPATH += $$BASE_DIR/src/desktop
VPATH += $$BASE_DIR/src/server
VPATH += $$BASE_DIR/src/jsengine
VPATH += $$BASE_DIR/src/json
VPATH += $$BASE_DIR/lib
VPATH += $$BASE_DIR/ai
VPATH += $$BASE_DIR/ai/tarotlib
VPATH += $$BASE_DIR/prj/testu

# ------------------------------------------------------------------------------
# Where to find header files
# ------------------------------------------------------------------------------
INCLUDEPATH += $$BASE_DIR/src
INCLUDEPATH += $$BASE_DIR/src/library
INCLUDEPATH += $$BASE_DIR/src/desktop
INCLUDEPATH += $$BASE_DIR/src/server
INCLUDEPATH += $$BASE_DIR/src/jsengine
INCLUDEPATH += $$BASE_DIR/src/json
INCLUDEPATH += $$BASE_DIR/prj/testu

QT       += testlib
QT       -= gui

TARGET = tst_utilities
CONFIG   += console
CONFIG   -= app_bundle

TEMPLATE = app

QMAKE_CXXFLAGS += -std=c++11

QMAKE_CFLAGS_DEBUG +=  -O0  -ggdb -pedantic -std=c99 -fstrict-aliasing
DEFINES += DUK_OPT_SELF_TESTS

# Specific OS stuff
win32 {
    LIBS +=  libws2_32
    DEFINES += USE_WINDOWS_OS
}
unix {
    DEFINES += USE_UNIX_OS
}

debug {
    DEFINES += TAROT_DEBUG
    DEFINES += DUK_OPT_DEBUG
}


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
    Common.h

SOURCES += Log.cpp \
    Util.cpp \
    ByteArray.cpp \
    ByteStreamReader.cpp \
    ByteStreamWriter.cpp \
    TcpSocket.cpp \
    TcpServer.cpp \
    TcpClient.cpp \
    UniqueId.cpp \
    Common.cpp

# ------------------------------------------------------------------------------
# JSEngine and JSON files
# ------------------------------------------------------------------------------

HEADERS += duktape.h \
    JsonWriter.h \
    JsonReader.h \
    JSEngine.h \
    IScriptEngine.h \
    JSValue.h \
    JsonValue.h

SOURCES += duktape.c \
    JsonWriter.cpp \
    JsonReader.cpp \
    JSEngine.cpp \
    JSValue.cpp \
    JsonValue.cpp

# ------------------------------------------------------------------------------
# TarotClub core files
# ------------------------------------------------------------------------------
HEADERS += TarotDeck.h \
    Deck.h \
    Card.h \
    Player.h \
    defines.h \
    ServerConfig.h

SOURCES += TarotDeck.cpp \
    Deck.cpp \
    Card.cpp \
    Player.cpp \
    ServerConfig.cpp

# ------------------------------------------------------------------------------
# Unit test files
# ------------------------------------------------------------------------------

HEADERS +=  tst_tarot_base.h \
            tst_utilities.h \
            tst_jsengine.h

SOURCES +=  tst_utilities.cpp \
            tst_tarot_base.cpp \
            tst_main.cpp \
            tst_jsengine.cpp

# End of project file
