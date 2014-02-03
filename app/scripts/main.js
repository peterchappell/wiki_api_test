$(document).ready(function() {

  var $content = $('#tally_content'),
      url = 'http://en.wikipedia.org/w/api.php?action=parse&page=2010_Winter_Olympics_medal_table&prop=text&section=1&format=json&callback=?',
      $contentArray,
      $medalTable;

  $.getJSON(url, function(data) {
    $contentArray = $(data.parse.text['*']);
    console.log('content array length', $contentArray.length);
    $contentArray.each(function(index) {
      var $this = $(this);
      console.log(index + ': ' + $this);
      if ($this.is('table.wikitable')) {
        $medalTable = $this;
        return false;
      }
    });

    $content.html($medalTable);
  });

});