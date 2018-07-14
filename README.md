# Stocks Website
A simple website that shows stock prices and news using ReactJS, EpxressJs, MySQL and C++

# What the project is about
This project is mostly an experiment. My first attempt at trying out javascript frameworks and MySQL. I wanted to combine my knowledge with C++ to write the site's backend. With C++ I wrote a program to update the database which the site uses through an ExpressJS API ( [Database Updater Project](https://github.com/PanagiotisPtr/Database-Updater-Cpp) ). The site uses data gathered from the AlphaVantage API and NewsAPI for stock prices and stock news respectively. The design is done using AntDesign, a ReactJS design framework.

# Why not get data straight from the API?
The APIs that I am using have a limited amount of requests. Thus to overcome this issue since most of the calls I am making are the same, I decided to have a database and use all of my requests up front to update it. By doing that I can now afford as many requests as my server can handle ( Note that I haven't hosted the site anywhere yet ). Another reason is that I was learning MySQL and wanted to have a chance to use it with C+++ thus I created the [Database Updater](https://github.com/PanagiotisPtr/Database-Updater-Cpp) insead of just getting the JSON straight from the API.

# The code
If you know ReactJS the code should be pretty straight forward. This is my first ReactJS app so I think that I could have done a better job here and there. I did try to have at least a few components ( My components are in the Components folder ) but I think that I should have a few more. Also the backend uses ExpressJS and thus is pretty simple to understand. All it does is make and return database requests.

# Demo
Short [demo on YouTube](https://www.youtube.com/watch?v=jEFd_ZY5Dtg)

# How to run the demo
First of all you will need to setup your database with the [Database Updater](https://github.com/PanagiotisPtr/Database-Updater-Cpp). After that you can just replace a few bits of code; on API-server/index.js replace database username, password etc. and on website/App.js replace "DATABASE_NAME" with the name of your database.
