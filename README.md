# Northcoders Games API

## In order to use the database. Node version 16.x.x and PSQL version 14.x are required

## Access The Database - Environment Variables

Once you have cloned this repository please note you will not have access to the necessary enviroment variables. In order to successfully connect to the databases locally, you will need to create two .env files. The two files are as follows: .env.test and .env.development. Within each, add PGDATABASE=<database_name_here>, with the correct database name for that environment. In order to obtain the correct name for the database, see /db/setup.sql. Remember to specify that one of the databases is for test purposes in the your environment variables like so PGDATABASE=<my_database_test>. Finally, you will need to make sure that these two files have been gitignored.

## Link to Hosted Version

https://jlaws-nc-games.onrender.com

## Project Summary

This project is a web-based database that allows users to access information about various games. The database is designed to be user-friendly, and includes a variety of endpoints that allow users to access different types of information.

The database gives you the ability to access reviews and comments from other users. Users can view ratings and reviews for different games. In addition to reviews and comments, the database also includes information about individual users.

## How To Use The Database - Instructions

In order to use/developer this database further first you will need to:

1. Fork this repository to your own GitHub account

2. Clone it locally to your machine

   ```
    git clone (insert your url for the repository here)
   ```
