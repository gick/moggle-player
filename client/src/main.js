import 'onsenui/css/onsenui.css' // Onsen UI basic CSS
import 'buefy/dist/buefy.css'
import './onsen-css-components.css' // Onsen UI CSS components source for custom themes (requires cssnext)
import './vue-onsenui-kitchensink.css' // CSS specific to this app
import 'vue-simple-markdown/dist/vue-simple-markdown.css'
window._ = require('lodash')
import Buefy from 'buefy'

import VueSimpleMarkdown from 'vue-simple-markdown'
import VueYoutube from 'vue-youtube'
import VueSignaturePad from 'vue-signature-pad'
import Vue from 'vue'
import Vuex from 'vuex'
import VueOnsen from 'vue-onsenui' // For UMD
// import VueOnsen from 'vue-onsenui/esm'; // For ESM
// import * as OnsenComponents from './onsen-components'; // For ESM
import storeLike from './store.js'
import CustomToolbar from './partials/CustomToolbar.vue'
import Toasted from 'vue-toasted'


import AppNavigator from './AppNavigator.vue'
import GameToolbar from './partials/GameToolbar.vue'
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})
Vue.use(VueYoutube)
Vue.use(Toasted)
Vue.use(Vuex)
Vue.use(VueOnsen)
Vue.use(VueSimpleMarkdown)
Vue.use(VueSignaturePad)
Vue.use(Buefy)
// Register components globally
// Object.values(OnsenComponents).forEach(component => Vue.component(component.name, component)); // For ESM
Vue.component('custom-toolbar', CustomToolbar) // Common toolbar
Vue.component('game-toolbar', GameToolbar)
new Vue({
	el: '#app',
	render: h => h(AppNavigator),
	store: new Vuex.Store(storeLike),
	beforeCreate() {
		// Shortcut for Material Design
		Vue.prototype.md = this.$ons.platform.isAndroid()

    // Set iPhoneX flag based on URL
    if (window.location.search.match(/iphonex/i)) {
			document.documentElement.setAttribute('onsflag-iphonex-portrait', '')
      document.documentElement.setAttribute('onsflag-iphonex-landscape', '')
    }
	}
})
