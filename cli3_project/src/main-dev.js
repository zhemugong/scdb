/*开发模式*/

import Vue from 'vue'
import App from './App.vue'
import router from './routers'
import axios from './http.js'
import apiUrl from './utils/apiUrl'
import store from './store/index'
import * as common from './assets/js/commonJs'
import qs from 'qs'

//import ElementUI from 'element-ui'


//import echarts from 'echarts'

// 引入提示框组件、标题组件、工具箱组件。
/*import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';*/

//Vue.use(ElementUI)
Vue.prototype.qs = qs;
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
Vue.prototype.apiUrl=apiUrl
Vue.prototype.common=common
Vue.config.productionTip = false


new Vue({
    el:"#app",
    router,
    store,
    render:h=>h(App)
}).$mount('#app');