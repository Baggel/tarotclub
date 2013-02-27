/*=============================================================================
 * TarotClub - main.cpp
 *=============================================================================
 * Entry point of Tarot Club
 *=============================================================================
 * TarotClub ( http://www.tarotclub.fr ) - This file is part of TarotClub
 * Copyright (C) 2003-2999 - Anthony Rabine
 * anthony@tarotclub.fr
 *
 * This file must be used under the terms of the CeCILL.
 * This source file is licensed as described in the file COPYING, which
 * you should have received as part of this distribution.  The terms
 * are also available at
 * http://www.cecill.info/licences/Licence_CeCILL_V2-en.txt
 *
 *=============================================================================
 */

// Inclusions Qt
#include <QApplication>
#include <QSplashScreen>
#include <QDesktopWidget>
#include <QtGlobal>
#include <QTranslator>

// Inclusions C++
#include <iostream>

// Inclusions du jeu
#include "Game.h"

using namespace std;

/*****************************************************************************/
/**
 * Affiche sur la console les messages Qt (warnings, erreurs...)
 */
#ifndef QT_NO_DEBUG
void myMessageOutput(QtMsgType type, const char *msg)
{
    switch (type) {
        case QtDebugMsg:
            cout << "Debug: " << msg << endl;
            break;
        case QtWarningMsg:
            cout << "Warning: " << msg << endl;
            break;
        case QtCriticalMsg:
            cout << "Critical: " << msg << endl;
            break;
        case QtFatalMsg:
            cout << "Fatal: " << msg << endl;
            abort(); // deliberately core dump
    }
}
#endif
/*****************************************************************************/
/**
 * Entry point of the game
 */
int main( int argc, char** argv )
{
#ifndef QT_NO_DEBUG
   qInstallMsgHandler(myMessageOutput);
#endif

   QApplication app( argc, argv );

   QPixmap pixmap( ":/images/splash.png" );
   QSplashScreen splash(pixmap);
   splash.show();

   Game window;

   window.resize(1280, 770);
   QRect r = window.geometry();
   r.moveCenter(QApplication::desktop()->availableGeometry().center());
   window.setGeometry(r);
   window.show();

   splash.finish(&window);
   return app.exec();
}

//=============================================================================
// End of file main.cpp
//=============================================================================
