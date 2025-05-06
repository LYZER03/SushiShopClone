# MongoDB Atlas Setup Instructions

Follow these steps to set up MongoDB Atlas for the Sushi Shop application:

## 1. Create an Atlas account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account
2. Verify your email address

## 2. Create a new cluster

1. Click "Build a Database"
2. Choose the free tier option (M0 Sandbox)
3. Select your preferred cloud provider (AWS, GCP, or Azure)
4. Choose a region closest to your user base
5. Click "Create Cluster" (this may take a few minutes to provision)

## 3. Set up database access

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" for authentication method
4. Enter a username and a secure password (save these credentials)
5. Set user privileges to "Read and Write to Any Database"
6. Click "Add User"

## 4. Set up network access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development, you can select "Allow Access from Anywhere" (0.0.0.0/0)
   (Note: For production, you should restrict this to specific IP addresses)
4. Click "Confirm"

## 5. Get your connection string

1. Go back to the "Database" section and click "Connect"
2. Select "Connect your application"
3. Copy the provided connection string
4. Replace `<password>` with your database user's password
5. Replace `myFirstDatabase` with `sushishop`

## 6. Update your environment variables

Update the `.env` file in the server folder with your MongoDB Atlas connection string:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/sushishop?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, and `<cluster>` with your actual values.

## 7. Test your connection

Run the server with `npm run dev` and verify that the connection is successful.
