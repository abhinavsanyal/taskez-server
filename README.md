<h3 align="center">
  Taskez NodeJs API
</h3>
<h4 align="center">
  A lean and clean REST API for kanban style project management. 
</h4>

# Demo :
[live demo link: ]("https://taskez-client.herokuapp.com/")
# About the API

**NodeJs** Rest Api for kanban board creation , modification and management. Implements a clean structure, with the best practices for authentication, including OAuth for _Google Login_ and _Facebook Login_ and the clasic JWT style. Keeping focus on well structured and clean code.

You can directly plug this API with the client of your choice by calling the different endpoints. I also give details on how to extend this code to adapt it for your project.

This API can be used with any client, here is the client I have developed with ReactJS to interact with this API. [React front end: ]("https://github.com/reltronx/taskez-client").

<div>
<img src="./readme_screen.png" alt="kanbanboard" title="kanbanboard">
</div>

# Features

(IN DEVELOMENT)

- [x] **Secure Authentification** with email/password using **JWT**
- [x] **OAuth 2.0 Authentication** via Facebook, Google, GitHub, LinkedIn, Instagram
- [x] Clean Structure Component Oriented
- [x] Use Passport
- [x] Easy-to-use endpoints
- [x] Middlewares to ensure authentification and permission to access resources.
- [ ] Implemented basic unit tests
- [ ] Option to add comments and memebers to a task / card in a kanban board.
- [x] Option to manage kanban board.

# Getting Started

## Prerequisites

Please make sure that you have:

- node.js installed (https://nodejs.org/)

## Cloning the repo

The easiest way to get started is to clone the repository:

```
# Get the latest snapshot
git clone https://github.com/reltronx/taskez-server.git taskezServer

# Change directory
cd taskezServer

# Install NPM dependencies
npm install

# Then simply start your app
npm start
```

## Configuration of the environment

To use all the functionnalities, you will need to set the environment variables.

Firstly, add a file named `.env` at the root of the folder (same level as `index.js`), use the
`.env.example` file to get the template for `.env`.

The three next steps will help you filling the other value of the .env file.

## Setup : MongoDB

- Create a new account on https://cloud.mongodb.com/ and choose the free plan
- On the homepage, click on _Connect > Connect your application > _
- Copy the **Connection String**, replace <password> by your actual password, and paste in the .env as _MONGO_URI_

## Setup : OAuth for Facebook Login ( Optional )

- Go on https://developers.facebook.com/apps and create a new app
- Add Facebook Login to its products
- In the settings of the Facebook Login Product
- If your servers runs locally, make sure the facebook app is in development mode
- If not, add `url-of-server:port/api/auth/facebook/callback` in the field _Valid OAuth Redirect URIs_
- Grab your **Client ID** and **Client Secret** in _Settings>Basic_
- Fill the .env at the root of the server with these credentials

## Setup : OAuth for Google Login ( Optional )

- Go on https://console.cloud.google.com/ and create a new app
- Add Credentials > OAuth client ID
- In _Authorized JavaScript origins_, enter `http://server:port` ( for me `http://127.0.0.1:5000`)
- In _Authorized redirect URIs_, enter `http://server:5000/api/auth/google/callback` ( for me `http://localhost:5000/api/auth/google/callback`)
- Grab your **Client ID** and **Client Secret** on the same page
- Fill the .env at the root of the server with these credentials

# Structure

Follows a Model Controller Middlewares sub structure. The business logic is grouped together by features :

- **models** for the database entities ( like `users`, `lanes`, `cards` ).
- **controllers/** for the actions on the models, that call the models actions ( like the management of the list of the users/cards/lanes).
- **middlewares/** intermediaries between the request and the response. Usually uses and modifies the request body parameters.
- **routes.js** for the definition of the endpoints for each actions of the controllers. Defines also what are the middleware used for the routes.

## Api Endpoints

#### Endpoints for the authentification

| Endpoint                  | Body Request Fields                               | Description                        |
| ------------------------- | ------------------------------------------------- | ---------------------------------- |
| `POST /api/auth/login`    | {email : "", password:""}                         | Login the user                     |
| `POST /api/auth/refresh`  | {refresh_token: ""}                               | Generate a new Json Web Token      |
| `POST /api/auth/register` | {email : "", name:"", password :"", password2:""} | Creates a new user.                |
| `GET /api/auth/google`    |                                                   | Entry point for the Google Oauth   |
| `GET /api/auth/facebook`  |                                                   | Entry point for the Facebook Oauth |

#### Endpoints for Kanban board management ( Lanes & Cards )

This is the usual API endpoints for a given entity ( here the users ):

| Endpoint                 | Token Needed | Body Request                            | Description                            |
| ------------------------ | ------------ | --------------------------------------- | -------------------------------------- |
| `GET /api/lanes/seed`    | no           |                                         | Seeds the db with 3 lanes.             |
| `GET /api/lanes/`        | yes          |                                         | Returns the entire kanban board        |
| `GET /api/cards/`        | yes          |                                         | Returns all cards / tasks              |
| `POST /api/cards/`       | yes          | {laneId :""}                            | Create a new card / task               |
| `POST /api/cards/move`   | yes          | {destination : "", source: ""}          | Shuffle the card position in the board |
| `POST /api/cards/update` | yes          | {cardId : "", title:"", description:""} | Updates the card details               |

# Understanding the kanban creation logic
    ## Will fill this section up shortly
## The authentication steps

#### Authenticate a user

Here is the different request between the server and the font end to handle the authentication.

1. The user enters its credentials on the client
2. The client sends the credentials to the server
3. The server compares the credentials with the database
4. The server sends back to the client a **jwt token** ( containing information about the user ) and a **refresh token**
5. The client extracts the token, sets the Authorization Headers of the next requests to `Bearer + token_value`

#### Refresh the token

The subititly is that for the system to be secure enough, the **jwt token** is encrypted with a limited lifetime.
If the client detects that the **jwt token** is expired, it needs a new one. Here is the process :

1. The client sends the expired **jwt token** along with the **refresh token**
2. The server checks the validity of the **refresh token**, and generates a new **jwt token**
3. The server sends back the same **refresh token** and the new **jwt token**

## Step 1 : Login with credentials

The first step in the login process, is for a registered user to send its email/passsword.
Endpoint : `endpoint:3600/auth`
Body :

```json
{
  "email": "user@somemail.com",
  "password": "donotsharemeplease"
}
```

If the login credentials are right, the response should be like:

```json
{
  "accessToken": "eyJhbGcidOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTIzNjRlZDQ4NDE2YzY2ZjYwMGIwYjgiLCJlbWFpbCI6InZhbGVudGluLmNoZWxsZTNAZ21haWwuY29tIiwicGVybWlzc2lvbkxldmVsIjoxLCJwcm92aWRlciI6ImVtYWlsIiwibmFtZSI6InVuZGVmaW5lZCB1bmRlZmluZWQiLCJyZWZyZXNoS2V5IjoiRUlVUk12NENQKytOZitzSHRnZThFZz09IiwiaWF0IjoxNTc5Mzc5NTY1fQ.jBIa5DNI0ObjVW7i3qF68XguKxuw_4lLmr-5S15rOp4",
  "refreshToken": "RFZJZE5YRWldTS3B2bWtUUlByaVZUeVJNTVFyYko5Sm80OUsycWtYUU9PYlFuQURCYkh4K202YWxnd2IybmFiRkQ0TWl2TElQemJKeGUrQ3FpdXVmR3c9PQ=="
}
```

## Step 2 : Stay logged with the JWT

In order to make your users stay logged on your app, you have to provide the jwt for each request. To do that, on the client side, grab the `accessToken` from the previous request, prefix it with `Bearer` and add it to the request headers under Authorization.

### Looking for a plug and play Client for consuming the API ?

[x]  [live demo link: ](https://taskez-client.herokuapp.com/)
[x]  [client repository](https://github.com/reltronx/taskez-client)
