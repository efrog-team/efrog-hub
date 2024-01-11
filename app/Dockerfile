FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean


RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get -y install nodejs

COPY /my-app /my-app

WORKDIR /my-app

RUN npm install

RUN npm run build

EXPOSE 1204
EXPOSE 3306

ENV HOST=0.0.0.0
ENV PORT=1204
ENV BODY_SIZE_LIMIT=0

CMD ["node", "build"]