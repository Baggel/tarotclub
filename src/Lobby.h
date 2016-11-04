/*=============================================================================
 * TarotClub - Lobby.h
 *=============================================================================
 * Central meeting point of a server to chat and join game tables
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

#ifndef LOBBY_H
#define LOBBY_H

#include "Protocol.h"
#include "PlayingTable.h"
#include "Users.h"
#include "Observer.h"

/*****************************************************************************/
class Lobby
{

public:
    static const std::uint32_t cErrorFull           = 0U;
    static const std::uint32_t cErrorNickNameUsed   = 1U;

    Lobby(bool adminMode = false);
    ~Lobby();

    void Initialize(const std::string &name, const std::vector<std::string> &tables);
    std::string GetName() { return mName; }
    bool Decode(uint32_t src_uuid, uint32_t dest_uuid, const std::string &arg, std::vector<helper::Reply> &out);

    // Users management
    std::uint32_t GetNumberOfPlayers();
    std::uint32_t AddUser(std::vector<helper::Reply> &out);
    void RemoveUser(std::uint32_t uuid, std::vector<helper::Reply> &out);
    void RemoveAllUsers();

    // Tables management
    std::uint32_t CreateTable(const std::string &tableName, const Tarot::Game &game = Tarot::Game());
    bool DestroyTable(std::uint32_t id);

private:
    bool mInitialized;
    std::vector<PlayingTable *> mTables;
    UniqueId    mTableIds;
    Users       mUsers;
    std::string mName;
    bool mAdminMode;

    std::string GetTableName(const std::uint32_t tableId);
    void RemovePlayerFromTable(std::uint32_t uuid, std::uint32_t tableId, std::vector<helper::Reply> &out);
    void SendPlayerList(const std::vector<uint32_t> &players, const std::string &event, std::vector<helper::Reply> &out);
    void Error(std::uint32_t error, std::uint32_t dest_uuid, std::vector<helper::Reply> &out);
};

#endif // LOBBY_H
