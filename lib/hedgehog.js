var hogan = require('hogan.js');
var mkdirp = require('mkdirp').mkdirp;
var fs = require('fs');
var watcher = require('watch-tree');

function Hedgehog(options) {

  var self = this;
  self.input_path =  './templates';
  self.output_path = './templates/compiled';
  var watch = watcher.watchTree(self.input_path, {
    'sample-rate' : 30
  });

  watch.on('fileModified', function(path, stats) {
    fs.readFile(path, function(e, data) {
      if(e) {
        throw e;
      }
      else {
        self.compile(data, path);
      }
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
  var compiled = data;

  // mkdirp will create subfolders if neccesary
  mkdirp(dir_path, 0755, function(e) {
    if(e) {
      throw e;
    }
    fs.writeFile(final_path, compiled, function (e) {
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

/*
watcher.on('fileModified', function(path, stats) {
  fs.readFile(path, function (err, data) {
    if (err) throw err;

    var filename = path.split("/").reverse()[0].replace(".dust","");
    var dir_path = path.split("/");
    dir_path.pop()
    dir_path.splice(0,4);
    var template_path = dir_path.join("/");
    var filepath = public_path + template_path + "/" + filename + ".js";
    var compiled = dust.compile(data, filename);

    var test = public_path + template_path;
    console.log(test);

    mkdirp(test, 0755, function (err) {
      if (err) console.error(err)
      else console.log('pow!')
      fs.writeFile(filepath, compiled, function (err) {
        if (err) throw err;
        console.log('Saved ' + filepath);
      });
    });
  });
});
*/
