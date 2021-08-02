# Game development rules

## Project licence

GNU GENERAL PUBLIC LICENSE Version 3

## Technologies used

The Qt library is used for the GUI interface. It is a wonderful library that help me a lot to provide the same software on all the supported platforms. The configuration files are in JSON format.

## Hosting platform

Github : https://github.com/tarotclub/tarotclub

## Development tools

Qt Creator must be the only editor to be used to edit C++ files. Any other tool can be used to edit the JavaScript files if the coding rules are respected.

Typically:
- QtCreator for C++
- Visual Studio Code for Javascript
  								
## Coding rules

Here is a quick-and-dirty coding rules list:

- Indentation takes 4-spaces, to tabulations allowed. BSD style brackets.
- Class members are prefixed by a 'm' letter, followed by mixed-case: mMyMemberVariable;
- Class/Enum/Structure names are mixed-case: class MyClass() { ... };

AStyle is used to automatically reformat the source code according to the project coding rules.


## Release process

### Version numbering

  
TODO: explain when and how to increment the version
  

### Game manual tests
  
Some parts of the game are not easy to test automatically. Here is a check list of manual tests to perform.
  
- Check translations (dock windows, about box, editor)
- Check different bids (guard, guard without...) with discard creation
- Check handle creation using predefined deals
- Check game modes (tournament ==> play two or more consecutive games, one deal)
- Check option change, game exit
- Check menus (help, options ...)
- Finally, check the generated log and debug output to look for problems especially bot related errors
  

### Delivery process

  
- Increase the version number in Defines.h file
- Check and update the TODO, HISTORY and README files
- Create the setup executables or install packages
- Install the packages on all the supported platforms, execute manual tests (criteria: all passed)
- Save the code quality checker results for this version
- Create a delivery report
- Tag the new version (format: VERSION_2_1_3), push the Mercurial depot
- Upload the setup executables on Bitbucket
- Update the website versions
- Make an announcement
