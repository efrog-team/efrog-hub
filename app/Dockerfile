FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean


RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get -y install nodejs

COPY efrog-hub/my-app /efrog-hub/my-app

WORKDIR /efrog-hub/my-app

RUN npm install
RUN npm update

EXPOSE 1204
EXPOSE 5917

CMD ["npm", "run", "dev"]