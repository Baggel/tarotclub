/*=============================================================================
 * TarotClub - Lobby.cpp
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

#include "Lobby.h"
#include "Log.h"
#include <sstream>
#include "JsonReader.h"
#include "JsonWriter.h"

Lobby::Lobby()
    : mInitialized(false)
    , mTableIds(Protocol::TABLES_UID, Protocol::TABLES_UID + Protocol::MAXIMUM_TABLES)
{

}
/*****************************************************************************/
Lobby::~Lobby()
{
    // Kill tables
    for (std::vector<PlayingTable *>::iterator iter = mTables.begin(); iter != mTables.end(); ++iter)
    {
        delete (*iter);
    }
}
/*****************************************************************************/
void Lobby::Initialize(const std::string &name, const std::vector<std::string> &tables)
{
    mName = name;
    for (std::uint32_t i = 0U; i < tables.size(); i++)
    {
        CreateTable(tables[i]);
    }
}
/*****************************************************************************/
void Lobby::Register(Lobby::IPacketNotifier *notifier)
{
    mNotifiers.push_back(notifier);
}
/*****************************************************************************/
std::uint32_t Lobby::GetNumberOfPlayers()
{
    return mUsers.GetLobbyUsers().size();
}
/*****************************************************************************/
uint32_t Lobby::AddUser(const std::string &ip)
{
    std::uint32_t uuid = mUsers.AddUser();
    std::stringstream ss;
    ss << "New connection: " << ", IP=" << ip << ", UUID=" << uuid;
    TLogNetwork(ss.str());

    JsonObject json;
    json.AddValue("cmd", "RequestLogin");
    json.AddValue("uuid", uuid);

    SendData(json, Protocol::LOBBY_UID, uuid);

    return uuid;
}
/*****************************************************************************/
void Lobby::RemoveUser(uint32_t uuid)
{
    std::uint32_t tableId = mUsers.GetPlayerTable(uuid);
    if (tableId != 0U)
    {
        // First, remove the player from the table
        RemovePlayerFromTable(uuid, tableId);
    }
    // Remove the player from the server
    mUsers.RemoveUser(uuid);
}
/*****************************************************************************/
void Lobby::RemoveAllUsers()
{
    mUsers.Clear();
}
/*****************************************************************************/
std::uint32_t Lobby::CreateTable(const std::string &tableName, bool adminMode, const Tarot::Game &game)
{
    std::uint32_t id = mTableIds.TakeId();

    if (id > 0U)
    {
        std::cout << "Creating table \"" << tableName << "\": id=" << id << std::endl;
        PlayingTable *table = new PlayingTable();
        table->SetId(id);
        table->SetName(tableName);
        table->SetAdminMode(adminMode);
        table->SetupGame(game);
        table->Initialize();
        table->CreateTable(4U);
        mTables.push_back(table);
    }
    else
    {
        TLogError("Cannot create table: maximum number of tables reached.");
    }
    return id;
}
/*****************************************************************************/
bool Lobby::DestroyTable(std::uint32_t id)
{
    bool ret = false;
    for (std::vector<PlayingTable *>::iterator it = mTables.begin(); it != mTables.end(); ++it)
    {
        if ((*it)->GetId() == id)
        {
            delete *it; // Delete the PlayingTable object in heap
            mTables.erase(it);
            ret = true;
            break;
        }
    }
    mTableIds.ReleaseId(id);
    return ret;
}
/*****************************************************************************/
bool Lobby::Decode(uint32_t src_uuid, uint32_t dest_uuid, std::string &arg)
{
    bool ret = true;
    JsonReader reader;
    JsonValue json;
    std::vector<PlayingTable::Reply> replies;

    if (!reader.ParseString(json, arg))
    {
        TLogNetwork("Not a JSON data");
        return false;
    }

    std::string cmd = json.FindValue("cmd").GetString();

    // Filter using the destination uuid (table or lobby?)
    if (mTableIds.IsTaken(dest_uuid))
    {
        // gets the table of the sender
        std::uint32_t tableId = mUsers.GetPlayerTable(src_uuid);
        if (tableId == dest_uuid)
        {
            // forward it to the suitable table PlayingTable
            for (std::vector<PlayingTable *>::iterator iter = mTables.begin(); iter != mTables.end(); ++iter)
            {
                if ((*iter)->GetId() == tableId)
                {
                    (*iter)->ExecuteRequest(cmd, src_uuid, dest_uuid, json, replies);
                }
            }
        }
        else
        {
            TLogNetwork("Packet received for an invalid table, or player is not connected to the table");
        }
    }
    else if (dest_uuid == Protocol::LOBBY_UID)
    {
        if (cmd == "ChatMessage")
        {
            std::uint32_t target = json.FindValue("target").GetInteger();
            SendData(json, Protocol::LOBBY_UID, target); // Forward the message
        }
        else if (cmd == "ReplyLogin")
        {
            Identity ident;

            ident.nickname = json.FindValue("nickname").GetString();
            ident.username = json.FindValue("username").GetString();

            if (mUsers.AccessGranted(src_uuid, ident))
            {
                // Create a list of tables available on the server
                JsonObject reply;
                JsonArray tables;

                for (std::vector<PlayingTable *>::iterator iter = mTables.begin(); iter != mTables.end(); ++iter)
                {
                    JsonObject table;
                    table.AddValue("name", (*iter)->GetName());
                    table.AddValue("uuid", (*iter)->GetId());
                    tables.AddValue(table);
                }

                reply.AddValue("cmd", "AccessGranted");
                reply.AddValue("tables", tables);

                // Send to the player the final step of the login process
                SendData(reply, Protocol::LOBBY_UID, src_uuid);

                std::vector<std::uint32_t> peers;
                peers.push_back(src_uuid);

                // Send to all the list of players and the event
                SendPlayerList(peers, "JoinPlayer");
            }
        }
        else if (cmd == "JoinTable")
        {
            std::uint32_t tableId = json.FindValue("table_id").GetInteger();

            // A user can join a table if he is _NOT_ already around a table
            if (mUsers.GetPlayerTable(src_uuid) == Protocol::NO_TABLE)
            {
                Place assignedPlace;
                std::uint8_t nbPlayers;

                // Forward it to the table PlayingTable
                for (std::vector<PlayingTable *>::iterator iter = mTables.begin(); iter != mTables.end(); ++iter)
                {
                    if ((*iter)->GetId() == tableId)
                    {
                        assignedPlace = (*iter)->AddPlayer(src_uuid, nbPlayers);
                        break;
                    }
                }

                if (assignedPlace.IsValid())
                {
                    mUsers.SetPlayingTable(src_uuid, tableId, assignedPlace);

                    JsonObject reply;

                    reply.AddValue("cmd", "ReplyJoinTable");
                    reply.AddValue("table_id", tableId);
                    reply.AddValue("size", nbPlayers);

                    JsonArray array;

                    std::vector<std::uint32_t> players = mUsers.GetTablePlayers(tableId);

                    for (std::uint32_t i = 0U; i < players.size(); i++)
                    {
                        Users::Entry entry;
                        if (mUsers.GetEntry(players[i], entry))
                        {
                            JsonObject obj;
                            obj.AddValue("uuid", entry.uuid);
                            obj.AddValue("place", entry.place.ToString());
                            obj.AddValue("avatar", entry.identity.avatar);
                            obj.AddValue("gender", entry.identity.GenderToString());
                            array.AddValue(obj);
                        }
                    }

                    reply.AddValue("players", array);
                    SendData(reply, Protocol::LOBBY_UID, Protocol::LOBBY_UID);
                }
                else
                {
                    JsonObject reply;

                    reply.AddValue("cmd", "Error");
                    reply.AddValue("code", 7);
                    reply.AddValue("reason", "Server is full");

                    SendData(reply, Protocol::LOBBY_UID, src_uuid);
                }
            }
        }

        /*

        case Protocol::CLIENT_QUIT_TABLE:
        {
            std::uint32_t tableId;
            in >> tableId;
            if (mUsers.GetPlayerTable(src_uuid) == tableId)
            {
                RemovePlayerFromTable(src_uuid, tableId);
            }
            break;
        }

        case Protocol::CLIENT_CHANGE_IDENTITY:
        {
            Identity newIdent;
            in >> newIdent;

            mUsers.AccessGranted(src_uuid, newIdent);

            if (mUsers.IsHere(src_uuid))
            {
                // Update player list
                std::uint32_t tableId = mUsers.GetPlayerTable(src_uuid);
                if (tableId != 0U)
                {
                    SendData(Protocol::TablePlayersList(mUsers.GetTablePlayers(tableId), tableId));
                }
                SendData(Protocol::LobbyPlayersList(mUsers.GetLobbyUsersIdentity()));
            }
            break;
        }

        default:
            TLogNetwork("Lobby received a bad packet");
            break;
        }
        */
    }
    else
    {
        std::stringstream ss;
        ss << "Packet destination must be the table or the lobby, nothing else; received UID: " << dest_uuid;
        TLogNetwork(ss.str());
    }

    return ret;
}
/*****************************************************************************/
void Lobby::RemovePlayerFromTable(std::uint32_t uuid, std::uint32_t tableId)
{
    bool removeAllPlayers = false;

    // Forward it to the table PlayingTable
    for (std::vector<PlayingTable *>::iterator iter = mTables.begin(); iter != mTables.end(); ++iter)
    {
        if ((*iter)->GetId() == tableId)
        {
            // Remove the player from the table, if we are in game, then all are removed
            removeAllPlayers = (*iter)->RemovePlayer(uuid);
        }
    }

    // Warn one or more player that they are kicked from the table
    std::vector<std::uint32_t> peers;
    if (removeAllPlayers)
    {
        peers = mUsers.GetTablePlayers(tableId);
    }
    else
    {
        // Remove only one player
        peers.push_back(uuid);
    }

    for (std::uint32_t i = 0U; i < peers.size(); i++)
    {
        if (mUsers.IsHere(peers[i]))
        {
            mUsers.SetPlayingTable(peers[i], 0U, Place::NOWHERE); // refresh lobby state
        }
    }

    SendPlayerList(peers, "QuitTable");
}
/*****************************************************************************/
void Lobby::SendPlayerList(const std::vector<std::uint32_t> &players, const std::string &event)
{
    std::vector<Users::Entry> users = mUsers.GetLobbyUsers();

    JsonObject obj;
    JsonArray array;

    for (uint32_t i = 0U; i < users.size(); i++)
    {
        JsonObject player;
        player.AddValue("uuid", users[i].uuid);
        player.AddValue("nickname", users[i].identity.nickname);
        player.AddValue("table", users[i].tableId);

        std::string ev = "none";

        // search for specific event for that list of players
        for (std::uint32_t i = 0U; i < players.size(); i++)
        {
            if (players[i] == users[i].uuid)
            {
                ev = event;
            }
        }
        player.AddValue("event", ev);
        array.AddValue(player);
    }

    obj.AddValue("cmd", "PlayerList");
    obj.AddValue("players", array);

    SendData(obj, Protocol::LOBBY_UID, Protocol::LOBBY_UID);
}

/*****************************************************************************/
std::string Lobby::GetTableName(const std::uint32_t tableId)
{
    std::string name = "error_table_not_found";

    // Forward it to the table PlayingTable
    for (std::vector<PlayingTable *>::iterator iter = mTables.begin(); iter != mTables.end(); ++iter)
    {
        if ((*iter)->GetId() == tableId)
        {
            name = (*iter)->GetName();
        }
    }

    return name;
}
/*****************************************************************************/
void Lobby::SendData(const JsonValue &data, std::uint32_t src_uuid, std::uint32_t dest_uuid)
{
    std::vector<std::uint32_t> peers; // list of users to send the data

    if (mTableIds.IsTaken(dest_uuid))
    {
        // If the player is connected to a table, send data to the table players only
        peers = mUsers.GetTablePlayers(dest_uuid);
    }
    else if (dest_uuid == Protocol::LOBBY_UID)
    {
        // Send data to all the connected users
        peers = mUsers.GetTablePlayers(Protocol::LOBBY_UID);
    }
    else if (mUsers.IsHere(dest_uuid))
    {
        // Only send the data to one connected client
        peers.push_back(dest_uuid);
    }

    for (std::uint32_t i = 0U; i < mNotifiers.size(); i++)
    {
        if (mNotifiers[i] != nullptr)
        {
            mNotifiers[i]->Send(data.ToString(0U), src_uuid, dest_uuid, peers);
        }
    }
}
