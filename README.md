Hedgehog - Watch and Compile hogan.js templates
===============================================

This utility will watch a directory with raw hogan.js template files and
compile them into corresponding vanilla js files.

The templates will be available in the JST namespace and relative to the
filepath of the raw template. For instance:

./templates/user/profile.js
    <h1>{{ name }}</h1>

Now all you need to do is include the compiled templates and use them

    <script src="/templates/compiled/user/profile.js"></script>
    <script>
      console.log(JST['user/profile'].r({name: "Daniel}));
    </script>


Where do I put the raw template files?
-------------------------------------
It's up to you really, but by default hedgehog will look in a
./templates directory.


Where are the compiled templates?
---------------------------------
By default templates are compiled into ./templates/compiled


In production mode
------------------
For a Rails project, I'd typically use Jammit to concatenate and minify
the template files on deployment.

For Node.js + Express.js I'm using connect-assets wich is an asset pipeline
inspired by Rails 3.1
