<template>
  <div class="container">
    <div class="pure-g">
      <button class="pure-button pure-button-primary" @click="goOptioins">Please fill the options first!</button>
    </div>
  </div>
</template>


<script>
export default {
  methods:{
    goOptioins: function(){
      if (chrome.runtime.openOptionsPage) {
        // New way to open options pages, if supported (Chrome 42+).
        chrome.runtime.openOptionsPage();
      } else {
        // Reasonable fallback.
        window.open(chrome.runtime.getURL('options.html'));
      }
    }
  }
}

</script>