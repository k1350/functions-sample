FROM ubuntu:24.04

RUN apt-get -y update && apt-get -y install openjdk-21-jdk wget xz-utils

# https://nodejs.org/en/download/prebuilt-binaries
RUN wget https://nodejs.org/dist/v20.12.2/node-v20.12.2-linux-x64.tar.xz && \
    tar -xf node-v20.12.2-linux-x64.tar.xz && \
    mv node-v20.12.2-linux-x64 /usr/local/lib/node && \
    rm node-v20.12.2-linux-x64.tar.xz

USER ubuntu

RUN echo 'export PATH=$PATH:/usr/local/lib/node/bin' >> ~/.bashrc && \
    export PATH=$PATH:/usr/local/lib/node/bin && \
    npm install -g firebase-tools

WORKDIR /app
