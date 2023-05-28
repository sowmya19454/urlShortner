const express = require('express');
const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  //alias: { type: String, required: true },
  url: { type: String, required: true },
  alias: { type: String, required: true, index:true, unique: true, sparse:true },
  visitHistory: [{ timestamp: { type: Number } }],
},
{ timestamps: true}
);

const Url = mongoose.model('url', UrlSchema);
module.exports = Url;

