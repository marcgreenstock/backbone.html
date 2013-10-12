$(document).ready(function() {
  var collection;

  module("HTML - Backbone.Collection", {
    setup: function() {
      collection = new Backbone.Collection;
    }
  });
  
  test("parseHTML", 7, function(assert) {
    var h = "<li data-id='1' data-name='bacon'>Bacon</li><li data-id='2' data-name='beans'>Beans</li>";
    var p = collection.parseHTML(h);
    equal(p.length, 2, 'should contain 2 objects');
    equal(p[0].id, 1, 'should set the first id')
    equal(p[0].name, 'bacon', 'should set the first name')
    assert.htmlEqual(p[0].HTML, "<li data-id='1' data-name='bacon'>Bacon</li>", 'should set the first HTML')
    equal(p[1].id, 2, 'should set the second id')
    equal(p[1].name, 'beans', 'should set the second name')
    assert.htmlEqual(p[1].HTML, "<li data-id='2' data-name='beans'>Beans</li>", 'should set the second HTML')
  });
});
