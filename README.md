# bigspace

bigspace is an extensible, open source, next-gen social platform.

it acts as an interface to the [big](https://github.com/bigcompany/big) framework by providing virtual spaces (like IRC channels/subreddits) full of developer-friendly [resources](https://github.com/bigcompany/resource) which also integrate with existing web platforms.

## how to run

```
# bigspace requires specific branch of 'resource' module
git clone git@github.com:bigcompany/resource.git -b bigspace
cd resource
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
