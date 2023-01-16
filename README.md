# RTKQ Example Tiny Project

## Getting started

- cline the repo: `git clone git@github.com:Perry5/RTKQ-Tiny-Project.git`
- `npm install` and `cd` into the dir
- `npm run start`
- (in a separate terminal window) `npm run start:server`

This project uses both async thunks and Redux Toolkit Query
just to compare both of them and see why we might pick one over the other.

## The Tiny Project
This project displays a component for a user to create users and
albums (associated with the users)

I used [json-server](https://www.npmjs.com/package/json-server)
to serve as the backend. Our DB is the `db.json` file. When you create
a user or album, they get added to this file.

- The AddUser functionality is built with async thunks
- The AddAlbums functionality is built with RTKQ

