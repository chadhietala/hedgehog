// (c) 2011 Daniel Stocks
// hedgehog may be freely distributed under the MIT license.
// For all details and documentation:
// https://github.com/danielstocks/hedgehog

var
  hogan = require('hogan.js'),
  mkdirp = require('mkdirp').mkdirp,
  fs = require('fs'),
  watcher = require('watch-tree');

function Hedgehog(options) {

  var self = this;

  // Options can be configured
  // but they all have sensible defaults
  self.options = options || {};
  self.conf = {}
  self.setup({
    namespace : 'window.T',
    input_path : './templates',
    output_path : './templates/compiled',
    extension : '.mustache'
  });

  // Initialize watchTree utility
  var watch = watcher.watchTree(self.conf.input_path, {
    'sample-rate' : 30
  });

  // Listen for a file modified event
  watch.on('fileModified', function(path, stats) {

    // Exit if it's not a "template" file
    if(path.split(".").pop() != self.conf.extension.substr(1)) {
      return;
    }

    // Read file contents and compile it
    fs.readFile(path, function(e, data) {
      if(e) throw e;
      self.compile(data, path);
    });
  });
}

Hedgehog.prototype = {

  _setOption: function(option, def) {
    this.conf[option] = (typeof this.options[option] == "undefined") ? def : this.options[option];
  },

  setup: function(defaults) {
    var self = this;
    Object.keys(defaults).forEach(function(key) {
      self._setOption(key, defaults[key]);
    });
  },

  compile: function(data, path) {

    var self = this;
    var relative_path = path.substr(self.conf.input_path.length);
    var compile_path = self.conf.output_path + relative_path;
    var final_path = compile_path.replace(self.conf.extension, '.js');
    var dir_path = final_path.split("/").slice(0, -1).join('/');
    var template_path = relative_path.replace(self.conf.extension, '').substr(1);
    var compiled = hogan.compile(data.toString(), {asString: true});

    var output = '(function() {\n'
      + self.conf.namespace + ' = ' + self.conf.namespace + ' || {};\n'
      + self.conf.namespace + '["' + template_path + '"] = new HoganTemplate();\n'
      + self.conf.namespace + '["' + template_path + '"].r = ' + compiled
      + '\n})();';

    // mkdirp will create subfolders if neccesary
    mkdirp(dir_path, 0755, function(e) {
      if(e) throw e;
      fs.writeFile(final_path, output, function (e) {
        if (e) throw e;
        console.log('Compiled and saved: ' + final_path);
      });
    });
  }
}

// Export the hedgehog constructor for Node.js and CommonJS.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Hedgehog;
} else if (typeof exports !== 'undefined') {
  exports.Hedgehog = Hedgehog;
}
