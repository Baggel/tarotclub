/*=============================================================================
 * TarotClub - Score.cpp
 *=============================================================================
 * Helper class that stores various scoring information
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

#include "Score.h"

/*****************************************************************************/
Team Score::Winner()
{
    if (pointsAttack >= pointsToDo)
    {
        return ATTACK;
    }
    else
    {
        return DEFENSE;
    }
}
/*****************************************************************************/
void Score::Reset()
{
    pointsAttack = 0;
    scoreAttack = 0;
    pointsToDo = 0;
    difference = 0;
    multiplier = 0;
    littleEndianPoints = 0;
    handlePoints = 0;
    slamPoints = 0;
}
/*****************************************************************************/
int Score::GetNumberOfOudlers()
{
    int oudlers;

    if (pointsToDo == 36)
    {
        oudlers = 3;
    }
    else if (pointsToDo == 41)
    {
        oudlers = 2;
    }
    else if (pointsToDo == 51)
    {
        oudlers = 1;
    }
    else
    {
        oudlers = 0;
    }

    return oudlers;
}
/*****************************************************************************/
void Score::SetPointsToDo(int oudlers)
{
    if (oudlers == 0)
    {
        pointsToDo = 56;
    }
    else if (oudlers == 1)
    {
        pointsToDo = 51;
    }
    else if (oudlers == 2)
    {
        pointsToDo = 41;
    }
    else // 3 oudlers
    {
        pointsToDo = 36;
    }
}
/*****************************************************************************/
int Score::GetAttackScore()
{
    int sign = -1;

    if (Winner() == ATTACK)
    {
        sign = 1;
    }
    return (scoreAttack * sign * 3);
}
/*****************************************************************************/
int Score::GetDefenseScore()
{
    int sign = 1;

    if (Winner() == ATTACK)
    {
        sign = -1;
    }
    return (scoreAttack * sign);
}
/*****************************************************************************/
QString Score::ToString()
{
    QString temp;

    temp = QObject::tr("Attacker points: ") + QString::number(pointsAttack);
    temp += "\n" + QObject::tr("Attacker score: ") + QString::number(scoreAttack);
    temp += "\n" + QObject::tr("Attacker objective: ") + QString::number(pointsToDo);
    temp += "\n" + QObject::tr("Difference: ") + QString::number(difference);
    temp += "\n" + QObject::tr("Multiplier: ") + QString::number(multiplier);
    temp += "\n" + QObject::tr("Little endian: ") + QString::number(littleEndianPoints);
    temp += "\n" + QObject::tr("Handle bonus: ") + QString::number(handlePoints);
    temp += "\n" + QObject::tr("Slam bonus: ") + QString::number(slamPoints);

    return temp;
}

//=============================================================================
// End of file Score.cpp
//=============================================================================
