<img src="https://raw.githubusercontent.com/sammok83/ui5-mobx-mst/master/img/UI5_MST_logo.png" alt="logo" height="120" align="right" />

# ui5-mobx-mst

_UI5 Reactive State Management Framework with MobX / MobX State Tree. Integrated with the latest [Mobx 6](https://michel.codes/blogs/mobx6) package._

# Getting started
### Install

With `yarn`:
```sh
yarn add ui5-mobx-mst
```
Or `npm`:
```sh
npm i ui5-mobx-mst -S
```

### Configure

Register the following custom task in your project's `ui5.yaml`:
#### Local development usage:

1. Install a middleware router, for example: [ui5-middleware-route](https://www.npmjs.com/package/ui5-middleware-route).
   
2. Set the custom middleware accordingly:
```yaml
server:
  customMiddleware:
    # Static source routing for mobx state tree resources 
    - name: ui5-middleware-route
      mountPath: /resources/thirdparty
      beforeMiddleware: compression
      configuration:
        path: node_modules 
```

#### Production usage:

1. Configure your [shims](https://sap.github.io/ui5-tooling/pages/extensibility/ProjectShims) accordingly:

```yaml
# For testing resources after deployment - third party libraries
specVersion: '2.2'
kind: extension
type: project-shim
metadata:
  name: thirdparty # this can be your project shim name
shims:
  configurations:
    ui5-mobx-mst: # name as defined in package.json
      specVersion: '2.2'
      type: module # Use module type
      metadata:
        name: ui5-mobx-mst
      resources:
        configuration:
          paths:
            /resources/thirdparty/ui5-mobx-mst/: ""  # location where modules are stored            
```
2. Issue the following command to preload build for project and dependencies to "./dist"
```bash
ui5 build --all
```

#### In your UI5 app:
Example of defining it in Component.js
```javascript

// Works for both configurations above 
sap.ui.define([
	"sap/ui/core/UIComponent",
	"thirdparty/ui5-mobx-mst/MobxModel"
], function(UIComponent, MobxModel) {
    ...
}
```

For older browser support, ui5-mobx-mst disables [proxies](https://mobx.js.org/configuration.html#proxy-support) by default:
```javascript
mobx.configure({
    useProxies: "never"
});
```

If however, you want to override this, the mobx and mobxStateTree globals are available for you to do this, after you've loaded the MobxModel above.

## About Mobx
👉 Official docs can be found at [Mobx](https://mobx.js.org/README.html)

## About Mobx State Tree
👉 Official docs can be found at [Mobx State Tree](http://mobx-state-tree.js.org/)

## About Mobx/Mobx State Tree and UI5 Integration
👉 Further reads:

## Credits
* Christian Theilemann [@geekflyer](https://github.com/geekflyer), a former SAP™ Employee - for the Mobx - UI5 Integration inspiration 
* Leon van Ginneken [@leon-vg](https://github.com/leon-vg) for the Mobx State Tree - UI5 Integration inspiration
