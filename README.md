# bigspace

an experimental app based on [big](https://github.com/bigcompany/big)

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
