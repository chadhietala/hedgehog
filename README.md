Hedgehog - Watch and Compile hogan.js templates
===============================================

This utility will watch a directory with raw hogan.js template files and
compile them into corresponding vanilla js files.

The templates will be available in the JST namespace and relative to the
filepath of the raw template. For instance: Let's say we created a template
and saved it as `./templates/user/profile.js`:

    <h1>{{ name }}</h1>

Now all you need to do is include the compiled templates and use them

    <script src="templates/compiled/user/profile.js"></script>
    <script>
      console.log(JST['user/profile'].r({name: "Daniel}));
    </script>

Usage
-----
require('Hedgehog');
Hedgehog.watch();

Where do I put the raw template files?
-------------------------------------
By default hedgehog will look in a `./templates` directory.

Where are the compiled templates?
---------------------------------
By default hedgehog will compile templates into a `./templates/compiled` directory

Configuration
-------------
Hedgehog.watch({
  'in': 'path/to/raw/templates',
  'out': 'path/to/compiled-templates/'
});

In production mode
------------------
For a Rails project, I'd typically use [Jammit](http://documentcloud.github.com/jammit/) 
to concatenate and minify the template files on deployment.

For a Express.js project I've tried [connect-assets](https://github.com/TrevorBurnham/connect-assets) with great success. It's an asset pipeline
for node.js/connect.js inspired by Rails 3.1
