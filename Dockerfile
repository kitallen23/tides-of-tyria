# Build
FROM node:20 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve
FROM nginx:alpine
# Copy the build output from the previous stage to the Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 80
# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
