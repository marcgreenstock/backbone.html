$(document).ready(function() {
  var model;

  module("HTML - Backbone.Model", {
    setup: function() {
      model = new Backbone.Model;
    }
  });
  
  test("parseHTML with default options", 3, function(assert) {
    var h = "<li data-id='1' data-name='egg'>Egg</li>";
    var p = model.parseHTML(h)

    assert.equal(p.id, 1, 'should set the id from the html element');
    assert.equal(p.name, 'egg', 'should set the name from the html element')
    assert.htmlEqual(p.HTML, h, 'should store the HTML as a string')
  });
  
  test("parseHTML with storeHTMLas $", 1, function(assert) {
    var h = "<li data-id='1' data-name='egg'>Egg</li>";
    var p = model.parseHTML(h, {storeHTMLas: '$'})
    assert.equal(p.HTML instanceof $, true, 'should store as a jQuery object')
  });

  test("parseHTML with storeHTMLas dom", 2, function(assert) {
    var h = "<li data-id='1' data-name='egg'>Egg</li>";
    var p = model.parseHTML(h, {storeHTMLas: 'dom'})
    assert.equal(p.HTML instanceof Array, true, 'should store as an array') 
    assert.equal(p.HTML[0] instanceof HTMLLIElement, true, 'should be a HTMLLIElement')
  });
  
  test("parseHTML with complex HTML", 3, function(assert) {
    var h = "Some test up front<div data-id='4' data-name='bacon'>some test in the middle</div> whitespace<div id='another_div'>inside</div>"
    var p = model.parseHTML(h)
    assert.equal(p.id, 4, 'should set the id')
    assert.equal(p.name, 'bacon', 'should set the name')
    assert.htmlEqual(p.HTML, h, 'should add the HTML as a string')
  });
});
