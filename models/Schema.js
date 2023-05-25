const express = require('express');
const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  alias: { type: String, required: true },
  url: { type: String, required: true },
});

const Url = mongoose.model('url', UrlSchema);
module.exports = Url;

