<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {

  color: #2c3e50;
  height: 100vh;
  min-width: 1440px;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
