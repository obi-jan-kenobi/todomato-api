FROM node:alpine

USER node

ENV APPDIR "/home/node/app"
ENV PORT 3000

RUN mkdir -p ${APPDIR}

COPY app/package.json ${APPDIR}/

WORKDIR ${APPDIR}
RUN npm install

COPY app ${APPDIR}

EXPOSE 3000

CMD ["yarn", "start"]
