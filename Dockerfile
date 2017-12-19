FROM nginx

RUN apt-get update -qq && \
    mkdir -p /usr/share/man/man1 && \
    apt-get install -qq -y build-essential gnupg curl libpng-dev default-jdk && \
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
