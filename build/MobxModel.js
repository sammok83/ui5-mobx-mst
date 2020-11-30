/* global mobx */
window.mobx = require("mobx");
window.mobxStateTree = require("mobx-state-tree");

//jQuery.sap.require({modName: "node_modules.mobx.dist.mobx", type: "umd.production.min"});
//jQuery.sap.require({modName: "node_modules.mobx-state-tree.dist.mobx-state-tree", type: "umd"});

// For Older browsers compatibility
mobx.configure({
    useProxies: "never"
});

sap.ui.define(["sap/ui/model/Model", "sap/ui/model/Context", "./MobxListBinding", "./MobxPropertyBinding"],
	function(Model, Context, MobxListBinding, MobxPropertyBinding) {
		"use strict";

		function isNil(value) {
			return value === null;
		}

		return Model.extend("MobxModel", {
			constructor: function(observable) {
				mobx.extendObservable(this, {
					_observable: observable || {}
				});
				Model.apply(this, arguments);
			},
			getData: function() {
				return this._observable;
			},
			setData: function(observable) {
				this._observable = observable;
			},
			bindProperty: function(sPath, oContext, mParameters) {
				return new MobxPropertyBinding(this, sPath, oContext, mParameters);
			},
			bindList: function(sPath, oContext, aSorters, aFilters, mParameters) {
				return new MobxListBinding(this, sPath, oContext, aSorters, aFilters, mParameters);
			},
			setProperty: function(sPath, value, oContext) {
				var sResolvedPath = this.resolve(sPath, oContext);
				if (sResolvedPath) {
					var iLastSlash = sResolvedPath.lastIndexOf("/");
					var sProperty = sResolvedPath.substring(iLastSlash + 1);
					var sPathUntilProperty = sResolvedPath.substring(0, iLastSlash);
					if (sPathUntilProperty.length === 0) {
						sPathUntilProperty = "/";
					}
					if (sPathUntilProperty === "/" && sProperty.length === 0) {
						this.setData(value);
					} else {
						var oObservable = this.getProperty(sPathUntilProperty);
						oObservable[sProperty] = value;
					}
				}
			},
			getProperty: function(sPath, oContext) {
				var sResolvedPath = this.resolve(sPath, oContext);
				if (sResolvedPath) {
					var aParts = sResolvedPath.substring(1).split("/");
					var currentNode = this._observable;
					var partsLength = aParts.length;
					if (!(partsLength === 1 && aParts[0].length === 0)) {
						for (var i = 0; i < partsLength && !isNil(currentNode); i++) {
							// The following is a warning from mobx that array indices that do not exist are called.
							// The warning indicated that it is better to first check the length of the array, so we do that here.
							if (mobx.isObservableArray(currentNode) && i < partsLength && Number(aParts[i]) + 1 > currentNode.length) {
								currentNode = undefined;
								break;
							}
							
							if (currentNode){
								currentNode = currentNode[aParts[i]];
							}
						}
					}
					return currentNode;
				}
			}
		});

	});
