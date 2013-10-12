;(function(Backbone, _) {
  var originalSync = Backbone.sync;
  Backbone.sync = function(method, model, options) {
    if (options && options.success) {
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!_.isUndefined(xhr) && _.isFunction(xhr.getResponseHeader) && /text\/html/.exec(xhr.getResponseHeader('Content-Type'))) resp = model.parseHTML(resp, options);
        success.apply(model, arguments);
      }
    }
    return originalSync.apply(model, arguments);
  };

  _.extend(Backbone.Model.prototype, {
    htmlAttribute: 'HTML',

    parseHTML: function(html, options) {
      options = (options || {});
      var storeHTMLas = (options.storeHTMLas || 'string');
      var keepScripts = (options.keepScripts || false);
      var htmlContext = (options.htmlContext || document);
      var keepScripts = (options.keepScripts || false);
      var parsedHTML = (html instanceof HTMLElement || html instanceof Text) ? [html] : Backbone.$.parseHTML(html, htmlContext, keepScripts);
      var data = _.reduce(parsedHTML, function(memo, el) {
        return _.extend(memo, $(el).data());
      }, {});
      data[this.htmlAttribute] = function() {
        switch(storeHTMLas) {
          case 'DOM':
          case 'dom':
            return parsedHTML;
          case 'jQuery':
          case '$':
            return _.reduce(parsedHTML, function(memo, el) {
              return memo.add(el);
            }, Backbone.$());
          default:
            return _.reduce(parsedHTML, function(memo, el) {
              return memo += el.outerHTML || el.textContent || '';
            }, '');
        }
      }();
      return data;
    }
  });

  _.extend(Backbone.Collection.prototype, {
    parseHTML: function(html, options) {
      options = (options || {});
      var htmlContext = (options.htmlContext || document);
      var keepScripts = (options.keepScripts || false);
      var parsedHTML = Backbone.$.parseHTML(html, htmlContext, keepScripts);
      return _.map(parsedHTML, function(el) {
        return Backbone.Model.prototype.parseHTML(el, options);
      });
    }
  });

})(Backbone, _);
