#!/bin/sh

sed '1,1d' es6/$1.js > docs-src/$1.js
sed -i '$d' docs-src/$1.js


