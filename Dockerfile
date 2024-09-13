ARG BASE_IMAGE

FROM $BASE_IMAGE

WORKDIR /usr/src/app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start:prod" ]
