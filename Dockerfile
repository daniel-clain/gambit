FROM node:8
COPY . .
RUN npm ci --only=production
COPY "./compiled-code" "./compiled-code"
EXPOSE 4444 69
CMD ["node", "compiled-code/server/server.js"]