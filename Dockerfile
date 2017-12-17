FROM nginx

RUN apt-get update -qq && \
    apt-get install -qq -y build-essential libpng-dev curl gnupg && \
    \
    echo "===> add webupd8 repository..."  && \
    echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" | tee /etc/apt/sources.list.d/webupd8team-java.list  && \
    echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" | tee -a /etc/apt/sources.list.d/webupd8team-java.list  && \
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys EEA14886  && \
    apt-get update -qq && \
    \
    echo "===> install Java"  && \
    echo debconf shared/accepted-oracle-license-v1-1 select true | debconf-set-selections  && \
    echo debconf shared/accepted-oracle-license-v1-1 seen true | debconf-set-selections  && \
    DEBIAN_FRONTEND=noninteractive apt-get install -qq -y oracle-java8-installer oracle-java8-set-default
    \
    echo "===> clean up..." && \
    rm -rf /var/cache/oracle-jdk8-installer  && \
    apt-get clean -qq && \
    rm -rf /var/lib/apt/lists/*
    \
    echo "===> install NodeJS"  && \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get install -qq -y nodejs

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY src src
COPY test test
COPY server server
COPY webpack webpack
COPY webpack.*.js ./
COPY ts*.json ./
COPY typing.d.ts .
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN npm run build
