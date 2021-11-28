FROM node:14 as build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:14
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/abi ./abi
ENV PORT=80
CMD npm run start:prod
