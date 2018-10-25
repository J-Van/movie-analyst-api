FROM node:8.12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used so both package.json and package-lock.json (if it exists) are copied to the image
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]