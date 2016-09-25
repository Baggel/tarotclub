
#include <QtCore>
#include <QtTest>
#include <cstdint>
#include <iostream>

#include "tst_tarot_base.h"
#include "tst_tarot_rules.h"

int main(int argc, char *argv[])
{
    std::uint32_t testSuccesses = 0;
    std::uint32_t testFailures = 0;

    QCoreApplication app(argc, argv);
    app.setAttribute(Qt::AA_Use96Dpi, true);


    TarotBase tst_base;
    if (QTest::qExec(&tst_base, argc, argv) == 0)
    {
        testSuccesses++;
    }
    else
    {
        testFailures++;
    }

    TarotRules tst_rules;
    if (QTest::qExec(&tst_rules, argc, argv) == 0)
    {
        testSuccesses++;
    }
    else
    {
        testFailures++;
    }

    std::cout << std::endl << "=============================================";
    std::cout << std::endl << "Success : " << testSuccesses;
    std::cout << std::endl << "Failures: " << testFailures;
    std::cout << std::endl << "=============================================" << std::endl;


    return 0;
}

