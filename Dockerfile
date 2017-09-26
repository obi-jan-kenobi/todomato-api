FROM node:slim

USER node

ENV APPDIR "/home/node/app"
ENV PORT 3000

RUN mkdir -p ${APPDIR}

COPY app/package.json ${APPDIR}/

WORKDIR ${APPDIR}
RUN npm install

#WORKAROUND TILL NO MORE SEGFAULT
RUN npm install --build-from-source=secure-password

COPY app ${APPDIR}

EXPOSE 3000

CMD ["yarn", "start"]
