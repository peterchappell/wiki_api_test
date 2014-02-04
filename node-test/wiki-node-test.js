var fs = require('fs'),
    http = require('http'),
    cheerio = require('cheerio');

var options,
    callback;

options = {
  host: 'en.wikipedia.org',
  path: '/w/api.php?action=parse&page=2010_Winter_Olympics_medal_table&prop=text&section=1&format=json'
};

callback = function(response) {
  var rawContent = '',
      textSegment,
      $,
      medalTable;

  response.on('data', function (content) {
    rawContent += content;
  });

  response.on('end', function () {
    textSegment = JSON.parse(rawContent).parse.text['*'];
    $ = cheerio.load(textSegment);
    $('.wikitable tr').removeAttr('bgcolor');
    $('.wikitable td a').addClass('hidden');
    $('.wikitable th').each(function(index) {
      $(this).css('width','auto').addClass('col_' + index);
    });
    medalTable = '<table class="wikitable">' + $('table.wikitable').html() + '</table>';

    fs.writeFile('medal_table.txt', medalTable, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('The file was saved');
      }
    });
  });

};

http.request(options, callback).end();

/*
TODO:
- Better practice?
- Replace Gold, Silver, Bronze text with images and remove backgrounds
- Append a credit to Wikipedia
- Add some tests so as not to overwrite the file if it doesn't look like the right table...
*/
