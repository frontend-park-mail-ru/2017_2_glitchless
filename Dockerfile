FROM nginx

RUN apt-get update -qq && \
    apt-get install -y  software-properties-common && \
    add-apt-repository ppa:webupd8team/java -y && \
    apt-get update && \
    echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections && \
    apt-get install -y oracle-java7-installer && \
    apt-get install -qq -y build-essential libpng-dev curl gnupg && \
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
