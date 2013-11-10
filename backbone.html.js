;(function(root) {
  var factory = function(exports, Backbone, _) {
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
    return exports = Backbone;
  }
  
  // Dependency management
  // Lifted from https://github.com/knockout/knockout/blob/master/build/fragments/amd-pre.js
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    // [1] CommonJS/Node.js
    module.exports = factory(exports, require('backbone'), require('underscore'))
  } else if (typeof define === 'function' && define['amd']) {
    // [2] AMD anonymous module
    define(['exports', 'backbone', 'underscore'], factory);
  } else {
    // [3] No module loader (plain <script> tag) - put directly in global namespace
    factory(root.Backbone, Backbone, _);
  }

})(this);
