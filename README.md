Hedgehog - Watch and Compile hogan.js templates
===============================================

Hedgehog is a node.js utility script that will watch a directory with raw [hogan.js](http://twitter.github.com/hogan.js/) template
files.
It will listen for changes and compile the raw mustache templates into compiled vanilla js files.

The templates will be available in a global T namespace (this is
configurable), relative to the
filepath of the raw template file.
For instance: Let's say we create a template
and save it as `./templates/user/profile.mustache`:

```mustache
<h1>{{ name }}</h1>
```

Now all you need to do is include the compiled templates along with the HoganTemplate (~700 bytes) lib.

```html
<script src="HoganTemplate.js"></script>
<script src="templates/compiled/user/profile.js"></script>
<script>
  var html = T['user/profile'].r({name: "Daniel"});
  // html == "<h1>Daniel</h1>"
</script>
```

Usage
-----

You can run the hedgehog as standalone utility or with your existing node app:

```javascript
var Hedgehog = require('hedgehog');
var h = new Hedgehog();
```

Where do I put the raw template files?
-------------------------------------
By default hedgehog will look in a `./templates` directory.

Where are the compiled templates?
---------------------------------
By default hedgehog will compile templates into a `./templates/compiled` directory

Configuration
-------------

You can configure hedgehog by passing an options object. For example:

```javascript
new Hedh.watch({
  'input_path': 'path/to/raw/templates',
});
```

### Options

#### namespace | default: 'window.T'

By default compiled templates will be accessible through the
window.T object in the browser, you can set this to whatever you prefer.

#### input_path | default: './templates'
#### output_path | default: './templates/compiled'
#### extension | default: '.mustache'


In production mode
------------------
For a Rails project, I'd typically use [Jammit](http://documentcloud.github.com/jammit/)
to concatenate and minify the template files on deployment.

For a Express.js project I've tried [connect-assets](https://github.com/TrevorBurnham/connect-assets) with great success. It's an asset pipeline
for node.js/connect.js inspired by Rails 3.1
