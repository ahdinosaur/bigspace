# bigspace

### EXPERIMENTAL

bigspace is an extensible, open source, next-gen social platform.

it acts as an interface to the [big](https://github.com/bigcompany/big) framework by providing virtual spaces (like IRC channels/subreddits) full of developer-friendly [resources](https://github.com/bigcompany/resource) which also integrate with existing web platforms.

## how to run

```
# bigspace requires bigspace branch of 'resources' module
git clone git@github.com:bigcompany/resources.git -b bigspace
cd resources
npm install
sudo npm link
cd ../

# bigspace requires bigspace branch of 'resource' module
git clone git@github.com:bigcompany/resource.git -b bigspace
cd resources
# include the 'resources' module we linked
npm link resources
npm install
sudo npm link
cd ../

# now we are ready to get bigspace
git clone git@github.com:ahdinosaur/bigspace.git -b master --recursive
cd bigspace
# include the 'resource' module we linked
npm link resource
npm install
node bin/server
browse to http://localhost:8888
```

### how to update submodules, if changed since ```git clone```

```
git submodule update --init
```
