#include <stdio.h>
#include <emscripten.h> // note we added the emscripten header
#include <emscripten/bind.h>
#include <emscripten/val.h>

// ICL
#include "JsonReader.h"

// TarotClub
#include "Protocol.h"
#include "BasicClient.h"
#include "Common.h"
#include "Engine.h"

static BasicClient mClient;
static Protocol mProto;
static Context  mCtx;
static Points mPoints;

/*
bool Deliver(uint32_t src_uuid, uint32_t dest_uuid, const std::string &arg, std::vector<Reply> &out)
{
    bool ret = true;

    if (mClient.mMyself.uuid != Protocol::INVALID_UID)
    {
        if (dest_uuid != mClient.mMyself.uuid)
        {
            ret = false;
        }
    }

    if (ret)
    {
        // Generic client decoder, fill the context and the client structure
        BasicClient::Event event = mClient.Decode(src_uuid, dest_uuid, arg, mCtx, out);

        switch (event)
        {
        case BasicClient::ACCESS_GRANTED:
        {
            // As soon as we have entered into the lobby, join the assigned table
            mClient.BuildJoinTable(Protocol::TABLES_UID, out);
          //  AppendToLog(L"Connected to Lobby");
            break;
        }
        case BasicClient::JOIN_TABLE:
        {
            std::wstringstream ss;
            ss << L"Entered table in position: " << Util::ToWString(mClient.mMyself.place.ToString());
          //  AppendToLog(ss.str());

            mClient.Sync(Engine::WAIT_FOR_PLAYERS, out);
            break;
        }
        case BasicClient::NEW_DEAL:
        {
            TLogInfo("Received cards: " + mClient.mDeck.ToString());
          //  DisplayDeck();

            mClient.Sync(Engine::WAIT_FOR_CARDS, out);
            break;
        }
        case BasicClient::REQ_BID:
        {
            // Only reply a bid if it is our place to anwser
            if (mClient.mBid.taker == mClient.mMyself.place)
            {
                mClient.BuildBid(Contract("Pass"), false, out);
            }
            break;
        }
        case BasicClient::SHOW_BID:
        {
//            DisplayText(Util::ToWString(mClient.mBid.contract.ToString()), mClient.mBid.taker);
            mClient.Sync(Engine::WAIT_FOR_SHOW_BID, out);
            break;
        }

        case BasicClient::SHOW_DOG:
        {
            mClient.Sync(Engine::WAIT_FOR_SHOW_DOG, out);
            break;
        }
        case BasicClient::START_DEAL:
        {
            // std::wstringstream ss;
            // ss << L"Start deal, taker is: " << Util::ToWString(mClient.mBid.taker.ToString());
            // AppendToLog(ss.str());
            mClient.Sync(Engine::WAIT_FOR_START_DEAL, out);
            break;
        }
        case BasicClient::SHOW_HANDLE:
        {
            mClient.Sync(Engine::WAIT_FOR_SHOW_HANDLE, out);
            break;
        }
        case BasicClient::BUILD_DISCARD:
        {
            // FIXME: to be implemented
            break;
        }
        case BasicClient::NEW_GAME:
        {
            mClient.Sync(Engine::WAIT_FOR_READY, out);
            break;
        }
        case BasicClient::SHOW_CARD:
        {
            // DisplayCard(mClient.mCurrentTrick.Last(), mClient.mCurrentPlayer);
            mClient.Sync(Engine::WAIT_FOR_SHOW_CARD, out);
            break;
        }
        case BasicClient::PLAY_CARD:
        {
            if (mClient.IsMyTurn())
            {
             
            }
            break;
        }
        case BasicClient::ASK_FOR_HANDLE:
        {
            mClient.BuildHandle(Deck(), out);
            break;
        }
        case BasicClient::END_OF_TRICK:
        {
            mClient.Sync(Engine::WAIT_FOR_END_OF_TRICK, out);
            break;
        }
        case BasicClient::END_OF_GAME:
        {
            // std::wstringstream ss;
            // ss << L"End of game, winner is: " << Util::ToWString(mClient.mCurrentPlayer.ToString());
            // AppendToLog(ss.str());

            // ClearBoard();
            mClient.Sync(Engine::WAIT_FOR_READY, out);
            break;
        }
        case BasicClient::ALL_PASSED:
        {
            // AppendToLog(L"All players have passed! New turn...");
            // std::this_thread::sleep_for(std::chrono::seconds(1));
            mClient.Sync(Engine::WAIT_FOR_ALL_PASSED, out);
            break;
        }
        case BasicClient::END_OF_DEAL:
        {
            mClient.Sync(Engine::WAIT_FOR_END_OF_DEAL, out);
            break;
        }
        case BasicClient::JSON_ERROR:
        case BasicClient::BAD_EVENT:
        case BasicClient::REQ_LOGIN:
        case BasicClient::MESSAGE:
        case BasicClient::PLAYER_LIST:
        case BasicClient::QUIT_TABLE:
        case BasicClient::SYNC:
        {
            // Nothing to do for that event
            break;
        }

        default:
            ret = false;
            break;
        }
    }

    return ret;
}
*/

extern "C" {

int EMSCRIPTEN_KEEPALIVE fib(int n){
    if(n == 0 || n == 1)
        return 1;
    else
        return fib(n - 1) + fib(n - 2);
}
EM_JS(void, call_js_agrs, (const char *title, int lentitle, const char *msg, int lenmsg), {
    jsMethodAgrs(UTF8ToString(title, lentitle), UTF8ToString(msg, lenmsg));
});

int jsDeliver(const char* text);

EM_JS(int, deliver, (const char *data, int len), {
  return jsDeliver(UTF8ToString(data, len));
});


int EMSCRIPTEN_KEEPALIVE runCommand(char *jsonString)
{
    printf("Command: = %s\n", jsonString);
    JsonReader reader;
    JsonValue json;
    JsonArray packets;

    if (reader.ParseString(json, jsonString))
    {
        std::string cmd = json.FindValue("cmd").GetString();
        if (cmd == "initialize")
        {
            mClient.Start();
        }
        else if (cmd == "setKey")
        {
            mProto.SetSecurty(json.FindValue("gek").GetString());
        }
        else if (cmd == "parseData")
        {
            std::string data = json.FindValue("data").GetString();

            Protocol::Header h;
            
            while (mProto.Parse(data, h))
            {
                // Decode
                BasicClient::Event event = mClient.Decode(h.src_uid, h.dst_uid, data, mCtx);

                JsonObject evObj;
                evObj.AddValue("event", static_cast<int64_t>(event));
                evObj.AddValue("data", data);
                packets.AddValue(evObj);
            }
            
            
        }
    }

    std::string p = packets.ToString();
    deliver(p.c_str(), p.size());
    return 0;
}


}

int main()
{
    std::string p = "C++ ==> Javascript";
    int ret = deliver(p.c_str(), p.size());
    printf("Returned: %d\n", ret);
    int res = fib(5);
    printf("fib(5) = %d\n", res);
    
    return 0;
}

