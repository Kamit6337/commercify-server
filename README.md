# Commercify

<p>It's a Full Stack e-Commerce Web App build in MERN Stack including Stripe payment integartion</p>

You can visit the [Live website](https://commercify-client.vercel.app)  

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech](#tech)
- [Screenshots](#screenshots)

## Description

This is an e-Commerce website like Amazon, Flipkart etc. where you can get various products of different categories.

## Features

- using Twilio for sending otp to mobile
- protect routes and data though express middleware
- Stripe payment integration to accept card
- global error handling at one place : globalErrorHandler.js
- cookie is created using jwt token to maintain user session

## Tech
<ul>
<li>Node JS</li>
<li>Express JS</li>
<li>JsonWebToken - <i>create token to maintain user logged in</i></li>
<li>MongoDB - <i>NoSQL database to store user data</i></li>
<li>Stripe - <i>online payment integration where user can pay using card</i></li>
<li>Twilio - <i>user logged in through mobile OTP</i></li>
</ul>

## Screenshots

Here are the screenshots of my project:

![product 1](https://commercify-vercel.s3.ap-south-1.amazonaws.com/images/commercify1.png)
![product 2](https://commercify-vercel.s3.ap-south-1.amazonaws.com/images/commercify2.png)
