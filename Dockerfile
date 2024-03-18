FROM node:18 as build

WORKDIR /app

COPY package.json yarn.lock ./

# Step 4: Install dependencies
RUN yarn install

# Step 5: Copy the rest of the app's code
COPY . .

# Step 6: Build the app
RUN yarn build

# Step 7: Use the Nginx image to serve the static files
FROM nginx:alpine

# Step 8: Copy the build output from the previous stage to the Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Step 9: Expose port 80
EXPOSE 80

# Step 10: Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
