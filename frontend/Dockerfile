FROM node:20.15.0


WORKDIR /usr/src/app


COPY package*.json ./


RUN NODE_OPTIONS="--max-old-space-size=4096" npm install --no-audit --prefer-offline --no-cache



COPY . .


CMD ["npm", "start"]
EXPOSE 3000