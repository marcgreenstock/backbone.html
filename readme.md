# Backbone.HTML


A simple Backbone plugin for using HTML as a data source instead of JSON.

[![Build Status](https://travis-ci.org/marcgreenstock/backbone.html.png?branch=master)](https://travis-ci.org/marcgreenstock/backbone.html)

---
This plugin will come in handy if you're generating HTML on the server and want to render it in a view or if the HTML is already rendered in the browser and you want to turn it in to a `Model` or `Collection`.

## Fetching an HTML collection

---

##### HTML
    <li data-id="1" data-name="Get some milk">Get some milk</li>
    <li data-id="2" data-name="Wash the car">Wash the car</li>

##### JavaScript
    var TotoList = Backbone.Collection.extend({
      url: '/path/to/collection.html'
    });

    var TodoView = Backbone.View.extend({
      tagName: 'ul',
      
      initialize: function() {
        this.collection = new TodoList;
        this.listenTo(this.collection, 'reset', this.render);
        this.collection.fetch();
      },
      
      render: function() {
      	var view = this;
      	this.collection.each(function(model) {
      	  view.$el.append(model.get('HTML'));
      	});
      }
    });

## Creating a collection from pre-existing HTML

---

###### HTML
    <ul id="todo_list">
      <li data-id="1" data-name="Get some milk">Get some milk</li>
      <li data-id="2" data-name="Wash the car">Wash the car</li>
    </ul>

###### JavaScript
    var TodoList = Backbone.Collection.extend({
      initialize: function(options) {
        @reset(@parseHTML(options.el));
      }
    });
    
    var TodoView = Backbone.View.extend({
    	initialize: function() {    	  
    	  this.collection = new TodoList([], el: this.$el.html());
    	});
    });
    
    new TodoView({
    	el: '#todo_list'
    });

The `parseHTML()` method is responsible for extracting data from the top level elements and putting and preparing them to be inserted into model attributes. In both examples above it will parse the HTML and create normal collections and models as expected.

### model.htmlAttribute = 'HTML'

---
By default the htmlAttribute is set to 'HTML' however this can be changed if needed.


### model|collection.parseHTML (string|jQuery Object|DOM Object/Array, [options])

---
model.parseHTML can accept an HTML string, jQuery object, DOM object or array of DOM objects. It returns an object containing the keys and values of the data attributes and the HTML in the key defined in model.htmlAttribute (HTML by default).

By default the HTML will be a string, however this can be changed by setting the `storeHTMLas` option. It accepts `'$'` or `'dom'`.

model.parseHTML uses jQuery's $.parseHTML method which accepts `htmlContext`, defaulted to `document` and `keepScripts`, defaulted to `false`.