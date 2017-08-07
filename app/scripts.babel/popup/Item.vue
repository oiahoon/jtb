<template>
  <li :data-id="item.id" :data-key="item.key">
    <a :href="item.url">
      <div class="main-image" :class="classObject" :issuetype="item.issuetype"></div>
      <span class="link-title"><b>[{{ item.key }}]</b>{{ item.summary }}</span>
      <span class="link-excerpt">{{ item.issuetype }} / <time class="date" datetime="November 12 2012">{{ item.dev_duedate }}</time> / {{ item.assignee }}</span>
    </a>
  </li>
</template>

<script>
  export default{
    name: 'item',
    props: ['item'],
    computed: {
      classObject: function () {
        var bugPtn = new RegExp(/bug/i)
        var storyPtn = new RegExp(/story/i)
        return {
          bug: this.item.issuetype && bugPtn.test(this.item.issuetype),
          story: this.item.issuetype && storyPtn.test(this.item.issuetype)
        }
      }
    }
  }
</script>