# pull official base image
FROM node:13.12.0-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
COPY package.json package-lock.json ./
RUN npm install --silent

COPY . ./

RUN npm run build

# Stage 2: Serve the React app using Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
