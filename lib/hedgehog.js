// (c) 2011 Daniel Stocks
// hedgehog may be freely distributed under the MIT license.
// For all details and documentation:
// https://github.com/danielstocks/hedgehog

var
  hogan = require('hogan.js'),
  mkdirp = require('mkdirp').mkdirp,
  fs = require('fs'),
  watcher = require('watch-tree'),
  // The directory from where the script is run
  pwd = process.cwd() + "/";

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
  self.dir_path

  // Initialize watchTree utility
  var watch = watcher.watchTree(pwd + self.conf.input_path, {
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

    var
      self = this,
      relative_path = path.substr(pwd.length + self.conf.input_path.length),
      // File path to the 'soon to be' compiled .js file
      file_path = (self.conf.output_path + relative_path).replace(self.conf.extension, '.js'),
      // Directoy path to the compiled .js file
      dir_path = file_path.split("/").slice(0, -1).join('/'),
      // Template local namespace, for instance: T["user/profile]
      template_ns = relative_path.replace(self.conf.extension, '').substr(1);

    var output = '(function() {\n'
      + self.conf.namespace + ' = ' + self.conf.namespace + ' || {};\n'
      + self.conf.namespace + '["' + template_ns + '"] = new HoganTemplate();\n'
      + self.conf.namespace + '["' + template_ns + '"].r = '
      + hogan.compile(data.toString(), {asString: true})
      + '\n})();';


    // mkdirp will create subfolders if neccesary
    mkdirp(pwd + dir_path, 0755, function(e) {
      if(e) throw e;
      fs.writeFile(pwd + file_path, output, function (e) {
        if (e) throw e;
        console.log('Compiled Hogan.js template into: ' + file_path);
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
