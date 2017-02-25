livedocs-middleware
===================

[![Greenkeeper badge](https://badges.greenkeeper.io/simonmcmanus/livedocs-middleware.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/simonmcmanus/livedocs-middleware.svg)](https://travis-ci.org/simonmcmanus/livedocs-middleware)

Validate request coming into Restify based on spec for LiveDocs.

Assuming the spec is attached to the req (req.spec) this middleware will ensure incoming data is as stated in the spec before sending requests on to the routing functions.

