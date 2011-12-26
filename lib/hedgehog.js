var hogan = require('hogan.js');
var mkdirp = require('mkdirp').mkdirp;
var fs = require('fs');
var watcher = require('watch-tree');

var util = require('util');
function Hedgehog(options) {

  var self = this;
  self.input_path =  './templates';
  self.output_path = './templates/compiled';
  var watch = watcher.watchTree(self.input_path, {
    'sample-rate' : 30
  });

  watch.on('fileModified', function(path, stats) {

    // If it's not a mustache file, don't bother
    if(path.split(".").pop() != "mustache") {
      return
    }

    fs.readFile(path, function(e, data) {
      if(e) throw e;
      self.compile(data, path);
    });
  });
}

Hedgehog.prototype.compile = function(data, path) {

  // calculate where the file should be compiled
  var relative_path = path.substr(this.input_path.length);
  var compile_path = this.output_path + relative_path;
  var final_path = compile_path.replace('.mustache', '.js');
  var dir_path = final_path.split("/").slice(0, -1).join('/');

  // Compile template
  var compiled = hogan.compile(data.toString(), {asString: true});
  var namespace = relative_path.replace('.mustache', '');
  namespace.substr(0,1);
  var output = 'JST["' + namespace + '"] = new HoganTemplate();\n';
  output += 'JST["' + namespace + '"].r = ' + compiled;

  // mkdirp will create subfolders if neccesary
  mkdirp(dir_path, 0755, function(e) {
    if(e) throw e;
    fs.writeFile(final_path, output, function (e) {
      if (e) throw e;
      console.log('Compiled and saved: ' + final_path);
    });
  });
};

// Export the hedgehog constructor for Node.js and CommonJS.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Hedgehog;
} else if (typeof exports !== 'undefined') {
  exports.Hedgehog = Hedgehog;
}
