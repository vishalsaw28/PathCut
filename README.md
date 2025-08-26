PathCut = URL- Shortner app

This app allows users to convert long, hard-to-share links into short and easy-to-remember URLs.

- Features

Shorten any valid URL into a unique short code

Redirect to the original URL via short code

Health check endpoint with database connection status

MongoDB backend for persistence

CORS-enabled API for frontend usage

Built with TypeScript for type-safety

- Architecture Overview

The system follows this flow:

A client submits a long URL.

The API (Express server) receives the request at the "shorten URL" endpoint.

The server validates the URL format.

MongoDB stores the record, including the original URL, the generated short code, and metadata such as creation date and click count.

The server responds with the newly created shortened URL.

When the user visits the shortened link, the server looks up the short code in MongoDB and redirects to the original URL.

here is the flowchart image for all the operations i am doing in the pathcut

![alt text](url_shortener_mongodb_flowchart.png)
