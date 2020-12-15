# IHS-by-Car
Intelegence help system by car (OSTIS project)

Steps to run project:
1) Install clean version of Ubuntu 16.04
2) In terminal:
  a) sudo apt-get update
  b) sudo apt-get upgrade
  c) sudo install git
3) Go to some folder and clone project
4) Go to "scripts/" folder
5) ./prepare.sh
6) ./run.sh (to run sctp and scweb)

If there is problem with "tornado" package, then type in terminal:
1) pip install tornado==5.1.1
2) pip install numpy==1.14.6

To rebuild base input "./build_kb.sh"
