var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var rootPath = __dirname + '/';
var itemsPath = rootPath + 'items.json';
var commentsPath = rootPath + 'comments.json';
var items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
var comments = JSON.parse(fs.readFileSync(commentsPath, 'utf8'));

app.use(bodyParser.json());

app.get('/api/items', function(req, res) {
  var itemIds = [1,2,3];
  console.log(itemIds);
  res.end(JSON.stringify(itemIds));
});

app.get('/api/items/:projectId/recommended', function(req, res) {
  var itemIds = [1,2,3];
  console.log(itemIds);
  res.end(JSON.stringify(itemIds));
});

app.get('/api/items/:itemId', function(req, res) {
  for(var i = 0; i < items.length; i++) {
    if(items[i].itemId == req.params.itemId) {
      var item = items[i];
      console.log(item);
      res.end(JSON.stringify(item));
    }
  }
  res.end("Requested item does not exist");
});

app.get('/api/items/:itemId/related', function(req, res) {
  var related = [];
  var id = 1;
  while(id <= 3) {
    if(id != req.params.itemId) {
      related.push(id);
    }
    id++;
  }
  console.log(related);
  res.end(JSON.stringify(related));
});

app.get('/api/items/:itemId/comments', function(req, res) {
  var itemComments = [];
  for(var i = 0; i < comments.length; i++) {
    if(comments[i].itemId == req.params.itemId) {
      itemComments.push(comments[i]);
    }
  }
  if(itemComments.length == 0) {
    console.log('No comments for this item')
    res.end('No comments for this item');
  }
  console.log(itemComments);
  res.end(JSON.stringify(itemComments));
});

app.post('/api/items/:itemId/comments', function(req, res) {
  var comment = {
    itemId: req.params.itemId,
    userId: req.body.userId,
    rating: req.body.rating,
    comment: req.body.comment
  };
  comments.push(comment);
  fs.writeFile(commentsPath, JSON.stringify(comments), function(err) {
    if(err) {
      console.log('Error writing file');
      res.end('Error adding comment');
    }
  });
  console.log('New comment added for item with id %s', req.params.itemId);
  res.end('New comment added for item with id ' + req.params.itemId);
});


var server = app.listen(3000, function() {
  console.log("Dummy Bazaar listening at http://%s:%s", server.address().address, server.address().port);
})
