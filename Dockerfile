FROM node:alpine

ENV APPDIR "/app"

COPY app/yarn.lock ${APPDIR}/
COPY app/package.json ${APPDIR}/

WORKDIR ${APPDIR}
RUN yarn

COPY app ${APPDIR}

EXPOSE 3000

CMD ["yarn", "start"]
