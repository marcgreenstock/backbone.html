;(function(Backbone, _) {
  _.extend(Backbone.Model.prototype, {
    htmlAttribute: 'HTML',

    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (xhr && _.isFunction(xhr.getResponseHeader) && /text\/html/.exec(xhr.getResponseHeader('Content-Type'))) resp = this.parseHTML(resp);
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    parseHTML: function(html) {
      var data = Backbone.$(html).data();
      data[this.htmlAttribute] = html;
      return data;
    }
  });

  _.extend(Backbone.Collection.prototype, {
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp, status, xhr) {
        if (xhr && _.isFunction(xhr.getResponseHeader) && /text\/html/.exec(xhr.getResponseHeader('Content-Type'))) resp = this.parseHTML(resp);
        var method = options.reset ? 'reset' : 'set'; 
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    parseHTML: function(html) {
      var htmlAttribute = this.model.prototype.htmlAttribute;
      return Backbone.$(html).map(function(index, el) {
        var data = Backbone.$(el).data();
        data[htmlAttribute] = el.outerHTML;
        return data;
      }).get();
    },

    html: function() {
      return this.pluck(this.model.prototype.htmlAttribute).join("\n");
    }
  });
  
  // Wrap an optional error callback with a fallback error event.
  var wrapError = function (model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

})(Backbone, _);
