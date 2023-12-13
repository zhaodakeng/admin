import Vue from 'vue'
const requireComponent = require.context('../components', true, /\.vue$/)

requireComponent.keys().forEach(element => {
    const name = element.split("/")[1];
    const componentConfig = requireComponent(element);
    Vue.component(name,componentConfig.default || componentConfig);
});