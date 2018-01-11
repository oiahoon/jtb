<template>
  <li :data-id="item.id" :data-key="item.key">
    <a :href="item.url" @click.prevent="newtab($event)">
      <div class="main-image" :class="classObject" :issuetype="item.issuetype" :title="item.issuetype"></div>
      <span class="link-title"><b>[{{ item.key }}]</b>{{ item.summary }}</span>
      <span class="link-excerpt"><i class='badget badget-sprint'>{{ item.sprint }}</i> <time class="date" datetime="November 12 2012">{{ item.dev_duedate }}</time> <i class="badget badget-assignee">{{ item.assignee }}</i><i class='badget'>{{ statusObject }}</i></span>
    </a>
  </li>
</template>

<script>
  export default{
    name: 'item',
    props: ['item'],
    computed: {
      classObject: function () {
        var bugPtn         = new RegExp(/bug/i)
        var storyPtn       = new RegExp(/story/i)
        var enhancementPtn = new RegExp(/enhancement/i)
        var esiPtn         = new RegExp(/Escalated/i)

        return {
          bug: this.item.issuetype && bugPtn.test(this.item.issuetype),
          story: this.item.issuetype && storyPtn.test(this.item.issuetype),
          enhancement: this.item.issuetype && enhancementPtn.test(this.item.issuetype),
          esi: this.item.issuetype && esiPtn.test(this.item.issuetype)
        }
      },
      statusObject: function () {
        var str = this.item.status.name
        console.log(str)
        return str.toLowerCase()
      }
    },
    methods: {
      newtab: function(event){
        var url = event.currentTarget.href
        chrome.tabs.create({url: url, active: false})
      }
    }
  }
</script>