FROM node:22-alpine
WORKDIR /app
COPY . .
RUN yarn install
EXPOSE 3033
CMD ["yarn", "run", "start"]
