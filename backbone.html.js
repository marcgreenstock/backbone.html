;(function(Backbone, _) {
  var originalSync = Backbone.sync;
  Backbone.sync = function(method, model, options) {
    if (options && options.success) {
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!_.isUndefined(xhr) && _.isFunction(xhr.getResponseHeader) && /text\/html/.exec(xhr.getResponseHeader('Content-Type'))) resp = model.parseHTML(resp);
        success.apply(model, arguments);
      }
    }
    return originalSync.apply(model, arguments);
  };

  _.extend(Backbone.Model.prototype, {
    htmlAttribute: 'HTML',

    parseHTML: function(html, options) {
      var data = Backbone.$(html).data();
      data[this.htmlAttribute] = html;
      return data;
    }
  });

  _.extend(Backbone.Collection.prototype, {
    parseHTML: function(html, options) {
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

})(Backbone, _);
