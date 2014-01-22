#include <QString>
#include <QtTest>
#include <QCoreApplication>
#include <cstdint>

#include "defines.h"
#include "tst_jsengine.h"
#include "Util.h"
#include "JsonReader.h"
#include "JsonWriter.h"

extern "C" void my_panic_handler(int code, const char *msg)
{
    /* Your panic handling.  Must not return. */
    volatile int i = 0;
    i++;
    while(1);
}

JsonTest::JsonTest()
{

}


void JsonTest::ParseFile()
{
    JsonReader json;

    std::string path = Util::ExecutablePath() + "/../../testu/test.json";

    json.Open(path);
    std::string value;
    // key is at the root of the document
    if (!json.GetValue("", "version", value))
    {
        QFAIL("Get value error");
    }

    std::cout << "version = " << value << std::endl;
    QCOMPARE(value, std::string("1.5"));

    value.clear();
    if (!json.GetValue("identity", "name", value))
    {
        QFAIL("Get value error");
    }

    std::cout << "identity.name = " << value << std::endl;
    QCOMPARE(value, std::string("Moi"));

    std::int32_t intvalue = 0;
    if (!json.GetValue("", "delay_before_cleaning", intvalue))
    {
        QFAIL("Get value error");
    }
    std::cout << "delay_before_cleaning = " << intvalue << std::endl;
    QCOMPARE(intvalue, 1500);
}

void JsonTest::GenerateFile()
{
    JsonWriter json;

    json.CreateValuePair("toto", "titi");
    json.CreateValuePair("tutu", "tata");
    JsonObject *obj = json.CreateObjectPair("first");
    obj->CreateValuePair("prout", 42);

    JsonObject *obj2 = obj->CreateObjectPair("second");
    obj2->CreateValuePair("prat", false);
    obj2->CreateValuePair("prut", -3400);
    obj2->CreateValuePair("prot", 807.53);

    json.SaveToFile("essai.json");
}

