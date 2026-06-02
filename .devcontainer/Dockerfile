FROM node:26

USER root

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get -y update && apt-get -y upgrade && apt-get -y install zsh python3 sudo

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

RUN chsh -s $(which zsh)
