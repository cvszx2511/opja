FROM node:alpine
WORKDIR /app
COPY index.html server.js ./
RUN mkdir -p data
EXPOSE 3000
CMD ["node", "server.js"]
