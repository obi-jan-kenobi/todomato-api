FROM node:alpine

ENV APPDIR "/app"

COPY app ${APPDIR}
WORKDIR ${APPDIR}

RUN yarn

EXPOSE 3000

CMD ["yarn", "start"]
