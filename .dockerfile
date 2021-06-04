FROM node:latest

# Create the directory!
RUN mkdir -p /usr/src/mirror-bot
WORKDIR /usr/src/kronos-rss

# Copy and Install our bot
COPY package.json /usr/src/mirror-bot
RUN npm install

# Our precious bot
COPY . /usr/src/mirror-bot

# Start me!
CMD ["node", "index.js"]