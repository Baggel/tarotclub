
#include <QtCore>
#include <QtTest>
#include <cstdint>
#include <iostream>

#include "tst_tarot_base.h"
#include "tst_utilities.h"
#include "tst_jsengine.h"
#include "tst_hash.h"

int main(int argc, char *argv[])
{
    std::uint32_t testSuccesses = 0;
    std::uint32_t testFailures = 0;

    QCoreApplication app(argc, argv);
    app.setAttribute(Qt::AA_Use96Dpi, true);
    Utilities tst_utils;
    if (QTest::qExec(&tst_utils, argc, argv) == 0)
    {
        testSuccesses++;
    }
    else
    {
        testFailures++;
    }

    TarotBase tst_base;
    if (QTest::qExec(&tst_base, argc, argv) == 0)
    {
        testSuccesses++;
    }
    else
    {
        testFailures++;
    }

    JsonTest tst_json;
    if (QTest::qExec(&tst_json, argc, argv) == 0)
    {
        testSuccesses++;
    }
    else
    {
        testFailures++;
    }

    LibraryHash tst_hash;
    if (QTest::qExec(&tst_hash, argc, argv) == 0)
    {
        testSuccesses++;
    }
    else
    {
        testFailures++;
    }

    std::cout << std::endl << "=============================================" << std::endl;
    std::cout << std::endl << "Success : " << testSuccesses << std::endl;
    std::cout << std::endl << "Failures: " << testFailures << std::endl;
    std::cout << std::endl << "=============================================" << std::endl;


    return 0;
}
