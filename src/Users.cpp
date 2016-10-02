/*=============================================================================
 * TarotClub - Users.cpp
 *=============================================================================
 * Management of connected users in the lobby, provide utility methods
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

#include <sstream>
#include "Users.h"
#include "Log.h"
#include "Protocol.h"
#include "TcpSocket.h"

/*****************************************************************************/
Users::Users()
    : mIdManager(Protocol::USERS_UID, Protocol::MAXIMUM_USERS)
{
}
/*****************************************************************************/
/**
 * @brief Lobby::PlayerTable
 *
 * Gets the player table id, return zero if not playing (in lobby)
 *
 * @param uuid
 * @return
 */
std::uint32_t Users::GetPlayerTable(std::uint32_t uuid)
{
   std::uint32_t tableId = Protocol::NO_TABLE;

   for (std::uint32_t i = 0; i < mUsers.size(); i++)
   {
       if (mUsers[i].uuid == uuid)
       {
            tableId = mUsers[i].tableId;
            break;
       }
   }
   return tableId;
}
/*****************************************************************************/
bool Users::GetEntry(std::uint32_t uuid, Entry &entry)
{
    bool ret = false;
    for (std::uint32_t i = 0; i < mUsers.size(); i++)
    {
        if (mUsers[i].uuid == uuid)
        {
             entry = mUsers[i];
             ret = true;
             break;
        }
    }
    return ret;
}
/*****************************************************************************/
void Users::Clear()
{
    mUsers.clear();
    mIdManager.Clear();
}
/*****************************************************************************/
void Users::SetPlayingTable(std::uint32_t uuid, std::uint32_t tableId, Place place)
{
    for (std::uint32_t i = 0; i < mUsers.size(); i++)
    {
        if (mUsers[i].uuid == uuid)
        {
             mUsers[i].tableId = tableId;
             mUsers[i].place = place;
             break;
        }
    }
}
/*****************************************************************************/
std::vector<std::uint32_t> Users::GetTablePlayers(std::uint32_t tableId)
{
    std::vector<std::uint32_t> theList;
    for (std::uint32_t i = 0; i < mUsers.size(); i++)
    {
        if ((mUsers[i].tableId == tableId) || (tableId == Protocol::LOBBY_UID))
        {
            theList.push_back(mUsers[i].uuid);
            break;
        }
    }
    return theList;
}
/*****************************************************************************/
std::vector<Users::Entry> Users::GetLobbyUsers()
{
    return mUsers;
}
/*****************************************************************************/
bool Users::IsHere(std::uint32_t uuid)
{
    bool isHere = false;
    for (std::uint32_t i = 0; i < mUsers.size(); i++)
    {
        if (mUsers[i].uuid == uuid)
        {
             isHere = true;
             break;
        }
    }
    return isHere;
}
/*****************************************************************************/
bool Users::CheckNickName(std::uint32_t uuid, const std::string &nickname)
{
    // Check if not already used
    bool already_used = false;
    for (std::uint32_t i = 0U; i < mUsers.size(); i++)
    {
        if (mUsers[i].uuid != uuid)
        {
            if (mUsers[i].nickname == nickname)
            {
                already_used = true;
                break;
            }
        }
    }

    return already_used;
}
/*****************************************************************************/
bool Users::ChangeNickName(uint32_t uuid, const std::string &nickname)
{
    bool ret = false;

    // Check if not already used before changing it
    if (!CheckNickName(uuid, nickname))
    {
        for (std::uint32_t i = 0U; i < mUsers.size(); i++)
        {
            if (mUsers[i].uuid == uuid)
            {
                 mUsers[i].nickname = nickname;
                 ret = true;
                 break;
            }
        }
    }
    return ret;
}
/*****************************************************************************/
/**
 * @brief Users::AddUser
 *
 * Add a user in the staging area while the login is processing
 *
 * @return
 */
std::uint32_t Users::AddUser()
{
    std::uint32_t uuid = mIdManager.TakeId();

    Entry entry;
    entry.tableId = Protocol::NO_TABLE;
    entry.connected = false;
    entry.uuid = uuid;
    mUsers.push_back(entry);

    return uuid;
}
/*****************************************************************************/
bool Users::AccessGranted(std::uint32_t uuid, const std::string &nickname)
{
    bool ret = false;

    if (!CheckNickName(uuid, nickname))
    {
        for (std::uint32_t i = 0U; i < mUsers.size(); i++)
        {
            if (mUsers[i].uuid == uuid)
            {
                mUsers[i].connected = true;
                mUsers[i].nickname = nickname;
                ret = true;
                break;
            }
        }
    }

    return ret;
}
/*****************************************************************************/
void Users::RemoveUser(std::uint32_t uuid)
{
    for (std::uint32_t i = 0U; i < mUsers.size(); i++)
    {
        if (mUsers[i].uuid == uuid)
        {
            mUsers.erase(mUsers.begin() + i);
            mIdManager.ReleaseId(uuid);
            break;
        }
    }
}

//=============================================================================
// End of file Users.cpp
//=============================================================================
