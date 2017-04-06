#!/bin/sh

sed '1,1d' es6/$1 > docs-src/$1
sed -i '$d' docs-src/$1


