Vresh?
======

A fancy way to check the weather on the web.


# Developing/Testing

You should first install `gulp` (in case it isn't  already installed):
```
npm i -g gulp
```

Then install all the dependecies:
```
npm i
bower i
```

You can then start the dev server by running:
```
gulp serve
```

# Running the dist build
First run the default `gulp` task to build the dist files
```
gulp
```

Then serve the contents of the `dist` folder with any HTTP server.
For exampe you can use python's simple HTTP server:
```
python -m SimpleHTTPServer 8000
```
