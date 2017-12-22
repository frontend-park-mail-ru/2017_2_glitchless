FROM nginx

RUN apt-get update -qq && \
    apt-get install -qq -y build-essential gnupg curl wget && \
    \
    apt-get install -qq -y libpng-dev && \
    wget -q -O /tmp/libpng12.deb http://mirrors.kernel.org/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1_amd64.deb && \
    dpkg -i /tmp/libpng12.deb && \
    \
    mkdir -p /usr/share/man/man1 && \
    apt-get install -qq -y default-jdk && \
    \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get install -qq -y nodejs

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY src src
COPY src-kotlin src-kotlin
COPY test test
COPY server server
COPY webpack webpack
COPY webpack.*.js ./
COPY ts*.json ./
COPY typing.d.ts .
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN npm run build
