'use strict';

var http = require("http");
var Router = require("./router");
var Helpers = require("./utils/helpers");
var Talks = require("./data/Talks");
var Changes = require("./data/Changes");
var ecstatic = require("ecstatic");

var fileServer = ecstatic({root: "./public"});
var router = new Router();

var server = http.createServer(function(request, response) {
  if (!router.resolve(request, response))
    fileServer(request, response);
}).listen(8000);

router.add("GET", /^\/talks\/([^\/]+)$/,
           function(request, response, title) {
  let talks = Talks.getTalks();

  if (title in talks)
    Helpers.respondJSON(response, 200, talks[title]);
  else
    Helpers.respond(response, 404, "No talk '" + title + "' found");
});

router.add("DELETE", /^\/talks\/([^\/]+)$/,
           function(request, response, title) {
  let talks = Talks.getTalks();

  if (title in talks) {
    delete talks[title];
    registerChange(title);
  }
  Helpers.respond(response, 204, null);
});

router.add("PUT", /^\/talks\/([^\/]+)$/,
           function(request, response, title) {
  Helpers.readStreamAsJSON(request, function(error, talk) {
    if (error) {
      Helpers.respond(response, 400, error.toString());
    } else if (!talk ||
               typeof talk.presenter != "string" ||
               typeof talk.summary != "string") {
      Helpers.respond(response, 400, "Bad talk data");
    } else {
      let talks = Talks.getTalks();

      talks[title] = {title: title,
                      presenter: talk.presenter,
                      summary: talk.summary,
                      comments: []};
      registerChange(title);
      Helpers.respond(response, 204, null);
    }
  });
});

router.add("POST", /^\/talks\/([^\/]+)\/comments$/,
           function(request, response, title) {
  Helpers.readStreamAsJSON(request, function(error, comment) {
    let talks = Talks.getTalks();

    if (error) {
      Helpers.respond(response, 400, error.toString());
    } else if (!comment ||
               typeof comment.author != "string" ||
               typeof comment.message != "string") {
      Helpers.respond(response, 400, "Bad comment data");
    } else if (title in talks) {
      let talks = Talks.getTalks();

      talks[title].comments.push(comment);
      registerChange(title);
      Helpers.respond(response, 204, null);
    } else {
      Helpers.respond(response, 404, "No talk '" + title + "' found");
    }
  });
});

router.add("GET", /^\/talks$/, function(request, response) {
  let talks = Talks.getTalks();

  var query = require("url").parse(request.url, true).query;
  if (query.changesSince == null) {
    var list = [];
    for (var title in talks)
      list.push(talks[title]);
    Helpers.sendTalks(list, response);
  } else {
    var since = Number(query.changesSince);
    if (isNaN(since)) {
      Helpers.respond(response, 400, "Invalid parameter");
    } else {
      var changed = getChangedTalks(since);
      if (changed.length > 0)
         Helpers.sendTalks(changed, response);
      else
        waitForChanges(since, response);
    }
  }
});

var waiting = [];

function waitForChanges(since, response) {
  var waiter = {since: since, response: response};
  waiting.push(waiter);
  setTimeout(function() {
    var found = waiting.indexOf(waiter);
    if (found > -1) {
      waiting.splice(found, 1);
      Helpers.sendTalks([], response);
    }
  }, 90 * 1000);
}

function registerChange(title) {
  Changes.pushChange({title: title, time: Date.now()});
  waiting.forEach(function(waiter) {
    Helpers.sendTalks(getChangedTalks(waiter.since), waiter.response);
  });
  waiting = [];
}

function getChangedTalks(since) {
  var found = [];
  let talks = Talks.getTalks();
  let changes = Changes.getChanges();

  function alreadySeen(title) {
    return found.some(function(f) {return f.title == title;});
  }
  for (var i = changes.length - 1; i >= 0; i--) {
    var change = changes[i];
    if (change.time <= since)
      break;
    else if (alreadySeen(change.title))
      continue;
    else if (change.title in talks)
      found.push(talks[change.title]);
    else
      found.push({title: change.title, deleted: true});
  }
  return found;
}

module.exports = server;
