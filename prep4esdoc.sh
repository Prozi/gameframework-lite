#!/bin/sh

sed '1,1d' $1 > src/$1
sed -i '$d' src/$1


