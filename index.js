const http = require('http');
const https = require('https');
const regEx = /href=.{1,}?[>'"]/g;

const server = http.createServer((request, response) => {
  sendLinks(request, response);
});

const getLinks = (callBack, request) => {
  const options = {
    hostname: request.url.slice(1),
    method: 'GET'
  };

  const req = https.request(options, function(res) {
    let body = '';

    res.on('data', function(data) {
      body += data.toString();
    });
    res.on('end', function() {
      const linkElements = body.match(regEx);

      const links = linkElements.map(linkElement => {
        let linkSlice = linkElement.slice(6, -1);
        if (linkSlice[0] !== '/') linkSlice = '/' + linkSlice;
        return linkSlice;
      });

      callBack(null, links);
    });
  });

  req.end();
};

const sendLinks = (request, response) => {
  getLinks((err, links) => {
    if (err) console.log(err);
    response.setHeader('Content-Type', 'application/json');
    response.statusCode = 200;
    response.write(JSON.stringify(links));
    response.end();
  }, request);
};

server.listen(9090, () => console.log('listening...'));
