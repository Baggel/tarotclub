/*=============================================================================
 * TarotClub - MainWindow.h
 *=============================================================================
 * Main window of the game. Contains all the widgets.
 *=============================================================================
 * TarotClub ( http://www.tarotclub.fr ) - This file is part of TarotClub
 * Copyright (C) 2003-2999 - Anthony Rabine
 * anthony@tarotclub.fr
 *
 * TarotClub is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * TarotClub is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with TarotClub.  If not, see <http://www.gnu.org/licenses/>.
 *
 *=============================================================================
 */

#include "MainWindow.h"
#include <QStatusBar>
#include <QMenuBar>
#include <QDateTime>
#include <QDir>
#include "../Tools.h"

/*****************************************************************************/
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
{
    SetupDialogs();
    SetupMenus();
    SetupDocks();

    setWindowTitle(QString(TAROT_TITRE) + " " + QString(TAROT_VERSION));
    tapis = new Tapis(this);
    setCentralWidget(tapis);
    tapis->show();
}
/*****************************************************************************/
void MainWindow::SetupDialogs()
{
    // About Window
    about = new AboutWindow(this);
    about->hide();

    // Help Window
    helpWindow = new HelpWindow(this);
    helpWindow->hide();

    // Scores
    resultWindow = new ResultWindow(this);
    resultWindow->setAttribute(Qt::WA_ShowModal, true);
    resultWindow->hide();

    // Options
    optionsWindow = new OptionsWindow(this);
    optionsWindow->setAttribute(Qt::WA_ShowModal, true);
    optionsWindow->hide();

    // Join a new network game wizard
    joinWizard = new JoinWizard(this);
    joinWizard->hide();

    // Deal editor
    editorWindow = new EditorWindow(this);
    editorWindow->setAttribute(Qt::WA_ShowModal, true);
    editorWindow->hide();
}
/*****************************************************************************/
/**
 * @brief MainWindow::SetupDocks
 */
void MainWindow::SetupDocks()
{
    // ----------  Bottom Docks ------------------------

    // Chat
    chatDock = new ChatDock(this);
    addDockWidget(Qt::BottomDockWidgetArea, chatDock);
    connect(chatDock, SIGNAL(sgnlClose()), this, SLOT(slotCloseChat()));

    // Server
    serverDock = new QDockWidget(this);
    serverUI.setupUi(serverDock);
    addDockWidget(Qt::BottomDockWidgetArea, serverDock);

    // Debug, for scripts and Qt error redirection
    debugDock = new DebugDock(this);
    addDockWidget(Qt::BottomDockWidgetArea, debugDock);

    tabifyDockWidget(chatDock, serverDock);
    tabifyDockWidget(serverDock, debugDock);

#ifndef QT_NO_DEBUG
    // Debug
    debugDock->show();
    serverDock->show();
    chatDock->show();
#else
    // Release
    debugDock->hide();
    serverDock->hide();
    chatDock->hide();
#endif

    // ----------  Right Docks ------------------------

    // Scores
    scoresDock = new ScoresDock(this);
    addDockWidget(Qt::RightDockWidgetArea, scoresDock);
    scoresDock->show();
    connect(scoresDock, SIGNAL(sgnlClose()), this, SLOT(slotCloseScores()));

    // Information
    infosDock = new InfosDock(this);
    addDockWidget(Qt::RightDockWidgetArea, infosDock);
    infosDock->show();

    // Deal
    roundDock = new RoundDock(this);
    addDockWidget(Qt::RightDockWidgetArea, roundDock);
    roundDock->show();

    // Right area belongs to right docks
    QMainWindow::setCorner(Qt::TopRightCorner, Qt::RightDockWidgetArea);
    QMainWindow::setCorner(Qt::BottomRightCorner, Qt::RightDockWidgetArea);

}
/*****************************************************************************/
/**
 * @brief MainWindow::SetupMenus
 */
void MainWindow::SetupMenus()
{
    //----------
    // Menu Jeu
    //----------
    //----- Local
    newQuickGameAct = new QAction(tr("&New quick game"), this);
    newQuickGameAct->setShortcut(tr("Ctrl+N"));
    newQuickGameAct->setStatusTip(tr("Start a one player game against computer"));

    newTournamentAct = new QAction(tr("New &tournament"), this);
    newTournamentAct->setShortcut(tr("Ctrl+T"));
    newTournamentAct->setStatusTip(tr("Play five deals against the computer"));

    newNumberedDealAct = new QAction(tr("New nu&mbered deal"), this);
    newNumberedDealAct->setShortcut(tr("Ctrl+M"));
    newNumberedDealAct->setStatusTip(tr("Deal cards with a predefined deal number"));

    newCustomDealAct = new QAction(tr("New manua&l deal"), this);
    newCustomDealAct->setShortcut(tr("Ctrl+L"));
    newCustomDealAct->setStatusTip(tr("Deal cards with a deal created with the editor"));

    //----- Network
    netGameServerAct = new QAction(tr("Create a new network game (serve&r)"), this);
    netGameServerAct->setShortcut(tr("Ctrl+R"));
    netGameServerAct->setStatusTip(tr("Crate a network game and invite friends to join the game"));
    netGameServerAct->setEnabled(false);

    netGameClientAct = new QAction(tr("&Join a network game"), this);
    netGameClientAct->setShortcut(tr("Ctrl+J"));
    netGameClientAct->setStatusTip(tr("Join a game server over Internet or over a local area network"));

    //----- Misc
    pliPrecAct = new QAction(tr("&Previous trick"), this);
    pliPrecAct->setShortcut(tr("Ctrl+P"));
    pliPrecAct->setStatusTip(tr("Show the previous trick played"));
    pliPrecAct->setEnabled(false);

    QAction *exitAct = new QAction(tr("&Quit"), this);
    exitAct->setShortcut(tr("Ctrl+Q"));
    exitAct->setStatusTip(tr("Quit the game"));
    connect(exitAct, SIGNAL(triggered()), qApp, SLOT(quit()));

    // Add action to the main menu
    gameMenu = menuBar()->addMenu(tr("Game"));
    gameMenu->addAction(newQuickGameAct);
    gameMenu->addAction(newTournamentAct);
    gameMenu->addAction(newNumberedDealAct);
    gameMenu->addAction(newCustomDealAct);
    gameMenu->addSeparator();
    gameMenu->addAction(netGameServerAct);
    gameMenu->addAction(netGameClientAct);
    gameMenu->addSeparator();
    gameMenu->addAction(pliPrecAct);
    gameMenu->addSeparator();
    gameMenu->addAction(exitAct);

    //---------------
    // Parameter menu
    //---------------
    optionsAct = new QAction(tr("&Options"), this);
    optionsAct->setShortcut(tr("Ctrl+O"));
    optionsAct->setStatusTip(tr("Game options"));

    dealEditorAct = new QAction(tr("Deal e&ditor"), this);
    dealEditorAct->setShortcut(tr("Ctrl+D"));
    dealEditorAct->setStatusTip(tr("Create a pre-defined deal by choosing the cards of each player"));
    connect(dealEditorAct, SIGNAL(triggered()), this, SLOT(slotDealEditor()));

    scoresAct = new QAction(tr("Score"), this);
    scoresAct->setCheckable(true);
    scoresAct->setStatusTip(tr("Show/hide the score window"));
    connect(scoresAct, SIGNAL(triggered()), this, SLOT(slotScoresDock()));
    scoresAct->setChecked(true);

    infosAct = new QAction(tr("Information"), this);
    infosAct->setCheckable(true);
    infosAct->setStatusTip(tr("Show/hide the information window"));
    connect(infosAct, SIGNAL(triggered()), this, SLOT(slotInfosDock()));
    infosAct->setChecked(true);

    chatAct = new QAction(tr("Chat"), this);
    chatAct->setCheckable(true);
    chatAct->setStatusTip(tr("Show/hide the chat window"));
    connect(chatAct, SIGNAL(triggered()), this, SLOT(slotChatDock()));
    chatAct->setChecked(false);

    serverAct = new QAction(tr("Server"), this);
    serverAct->setCheckable(true);
    serverAct->setStatusTip(tr("Show/hide the server window"));
    connect(serverAct, SIGNAL(triggered()), this, SLOT(slotServerDock()));
    serverAct->setChecked(false);

    debugAct = new QAction(tr("Debug"), this);
    debugAct->setCheckable(true);
    debugAct->setStatusTip(tr("Show/hide the debug window"));
    connect(debugAct, SIGNAL(triggered()), this, SLOT(slotDebugDock()));
    debugAct->setChecked(false);

    paramsMenu = menuBar()->addMenu(tr("Parameters"));
    paramsMenu->addAction(optionsAct);
    paramsMenu->addAction(dealEditorAct);
    paramsMenu->addSeparator();
    paramsMenu->addAction(scoresAct);
    paramsMenu->addAction(infosAct);
    paramsMenu->addAction(chatAct);
    paramsMenu->addAction(serverAct);
    paramsMenu->addAction(debugAct);

    //-----------
    // Menu Help
    //-----------
    QAction *aboutAct = new QAction(tr("&About..."), this);
    aboutAct->setShortcut(tr("Ctrl+A"));
    aboutAct->setStatusTip(tr("About TarotClub"));
    connect(aboutAct, SIGNAL(triggered()), about, SLOT(show()));

    QAction *helpAct = new QAction(tr("&Help and manual"), this);
    helpAct->setShortcut(tr("Ctrl+H"));
    helpAct->setStatusTip(tr("Show game help and Tarot rules"));
    connect(helpAct, SIGNAL(triggered()), helpWindow, SLOT(show()));

    // Add actions to the Help menu
    helpMenu = menuBar()->addMenu(tr("Help"));
    helpMenu->addAction(aboutAct);
    helpMenu->addAction(helpAct);

}

/*****************************************************************************/
void MainWindow::slotDealEditor()
{
    editorWindow->Initialize();
    editorWindow->exec();
}
/*****************************************************************************/
void MainWindow::slotCloseChat()
{
    chatAct->setChecked(false);
}
/*****************************************************************************/
void MainWindow::slotCloseScores()
{
    scoresAct->setChecked(false);
}
/*****************************************************************************/
void MainWindow::slotScoresDock(void)
{
    if (scoresDock->isVisible() == true)
    {
        scoresAct->setChecked(false);
        scoresDock->hide();
    }
    else
    {
        scoresAct->setChecked(true);
        scoresDock->show();
    }
}
/*****************************************************************************/
void MainWindow::slotInfosDock(void)
{
    if (infosDock->isVisible() == true)
    {
        infosAct->setChecked(false);
        infosDock->hide();
    }
    else
    {
        infosAct->setChecked(true);
        infosDock->show();
    }
}
/*****************************************************************************/
void MainWindow::slotChatDock(void)
{
    if (chatDock->isVisible() == true)
    {
        chatAct->setChecked(false);
        chatDock->hide();
    }
    else
    {
        chatAct->setChecked(true);
        chatDock->show();
    }
}
/*****************************************************************************/
void MainWindow::slotServerDock(void)
{
    if (serverDock->isVisible() == true)
    {
        serverAct->setChecked(false);
        serverDock->hide();
    }
    else
    {
        serverAct->setChecked(true);
        serverDock->show();
    }
}
/*****************************************************************************/
void MainWindow::slotDebugDock(void)
{
    if (debugDock->isVisible() == true)
    {
        debugAct->setChecked(false);
        debugDock->hide();
    }
    else
    {
        debugAct->setChecked(true);
        debugDock->show();
    }
}

//=============================================================================
// End of file MainWindow.cpp
//=============================================================================
