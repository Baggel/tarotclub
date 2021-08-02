# How to build the game

TarotClub has multiple targets available:
- Desktop
- Command line
- Dedicated server
- Unit test project

The following process is nearly the same for all the targets.

## Getting the source code

The source code is available on the Mercurial BitBucket depot. To get the source code, execute the following command:

```shell
https://github.com/tarotclub/tarotclub
```

## How to build TarotClub under Ubuntu

The following commands will help you to install everything to build TarotClub:

```shell
apt-get install build-essential
apt-get install libglw1-mesa-dev
apt-get install libegl1-mesa-dev
apt-get install libgl1-mesa-dev
apt-get install qt5-default qttools5-dev-tools qttools5-doc libqt5svg5-dev
```

Then, best option is to use QtCreator since qmake projects (.pro files) are available.

Another way is to use the command line:
```
cd tarotclub
qmake prj/desktop.pro
make
```

The executable can be found on the build-desktop/release sub-directory. Take into account that the executable must be launched 
from a specific directory tree containing the game assets.

## How to build TarotClub under Fedora

Install the following packages

```
yum install gcc-c++ qt5-qtsvg-devel qt5-qtsvg qt5-base qt5-qtbase-devel
```

Then run Qmake:

```
cd tarotclub
qmake-qt5 prj/desktop.pro
make
```