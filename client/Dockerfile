# 1. base image
FROM node:18-alpine

# 2. set working dir
WORKDIR /app

# 3. copy only package manifests, install deps
COPY package.json package-lock.json* ./
RUN npm install

# 4. copy rest of source
COPY . .

# 5. expose and run
EXPOSE 3000
CMD ["npm", "run", "dev"]
