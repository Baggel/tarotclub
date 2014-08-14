/*=============================================================================
 * TarotClub - TcpServer.h
 *=============================================================================
 * TCP socket wrapper class, server side
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

#ifndef TCP_SERVER_H
#define TCP_SERVER_H

#include <thread>
#include <vector>
#include "TcpSocket.h"
#include "Observer.h"

/*****************************************************************************/
/**
 * @brief The TcpServer class
 *
 * General purpose Tcp Server thread.
 * Events on the server socket are throwed through the IEvent interface that
 * must be implemented in the user side of this class. The event handler is
 * required in the constructor.
 */
class TcpServer : public TcpSocket
{
public:
    class IEvent
    {
    public:
        enum CloseType
        {
            WAIT_SOCK_FAILED,
            TIMEOUT
        };

        /**
         * @brief NewConnection
         * Called when a new TCP/IP connection has been created
         * @param socket
         */
        virtual void NewConnection(int socket) = 0;

        /**
         * @brief ReadData
         * Called when new data have been sent by the peer to the server
         * @param socket
         * @param data
         */
        virtual void ReadData(int socket, const std::string &data) = 0;

        /**
         * @brief ClientClosed
         * Called when a client has closed its connection
         * @param socket
         */
        virtual void ClientClosed(int socket) = 0;

        /**
         * @brief ServerTerminated
         * Called when the server is about to shutdown (mainly because of an internal problem)
         */
        virtual void ServerTerminated(CloseType type) = 0;
    };

    TcpServer(IEvent &handler);

    virtual ~TcpServer(void) { }

    bool Start(std::uint16_t port, std::int32_t maxConnections);
    void Stop();
    void Join();

private:
    std::thread mThread;
    int  mMaxSd;
    fd_set mMasterSet;
    std::vector<int> mClients;
    bool mInitialized;
    IEvent     &mEventHandler;

    static void EntryPoint(void *pthis);
    void Run();
    void IncommingConnection();
    bool IncommingData(int in_sock);
    void UpdateMaxSocket();
};


#endif // TCP_SERVER_H

//=============================================================================
// End of file TcpServer.h
//=============================================================================
