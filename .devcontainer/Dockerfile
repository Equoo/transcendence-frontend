FROM node:26

USER root

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get -y update && apt-get -y upgrade && apt-get -y install zsh python3 sudo
RUN wget https://github.com/gittower/git-flow-next/releases/download/v1.1.0/git-flow-next-v1.1.0-linux-amd64.tar.gz; tar -xzvf git-flow-next-v1.1.0-linux-amd64.tar.gz; mv git-flow-v1.1.0-linux-amd64 /bin/git-flow

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

RUN chsh -s $(which zsh)
