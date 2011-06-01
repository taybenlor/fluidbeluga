coffee -o build -c -j source/app.coffee source/notifier.coffee
cat beluga.js build/concatenation.js > dist.js